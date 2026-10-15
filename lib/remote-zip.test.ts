import { expect, test, describe, beforeAll, afterAll, vi } from "vitest";
import { RemoteZip, RemoteZipInfo } from "./remote-zip";
import { mimeTypes } from "./mime-types";
import * as fs from "fs";
import * as path from "path";

describe("RemoteZip", () => {
  let zipBuffer: Buffer;
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    const zipPath = path.resolve(__dirname, "../test-assets/test.zip");
    zipBuffer = fs.readFileSync(zipPath);

    // Mock fetch
    globalThis.fetch = vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method?.toUpperCase() || "GET";
      const urlStr = typeof input === "string" ? input : (input as URL).toString();

      if (urlStr.startsWith("blob:")) {
        return originalFetch(input, init);
      }

      if (method === "HEAD") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Length": zipBuffer.length.toString(),
            "Accept-Ranges": "bytes",
          }),
        } as unknown as Response;
      }

      if (method === "GET") {
        const headers = init?.headers;
        let rangeHeader = "";
        if (headers instanceof Headers) {
          rangeHeader = headers.get("Range") || "";
        } else if (Array.isArray(headers)) {
          const found = headers.find((h) => h[0].toLowerCase() === "range");
          if (found) rangeHeader = found[1];
        } else if (headers && typeof headers === "object") {
          rangeHeader = (headers as Record<string, string>)["Range"] || "";
        }

        const match = rangeHeader.match(/bytes=(\d+)-(\d+)/);
        if (match) {
          const start = parseInt(match[1], 10);
          const end = parseInt(match[2], 10);
          const sliced = zipBuffer.subarray(start, end + 1);
          // Convert Node Buffer to ArrayBuffer
          const arrayBuffer = sliced.buffer.slice(
            sliced.byteOffset,
            sliced.byteOffset + sliced.byteLength
          );
          return {
            ok: true,
            status: 206,
            statusText: "Partial Content",
            arrayBuffer: async () => arrayBuffer,
            headers: new Headers({
              "Content-Range": `bytes ${start}-${end}/${zipBuffer.length}`,
              "Content-Length": sliced.length.toString(),
            }),
          } as unknown as Response;
        }
      }

      throw new Error(`Unhandled fetch: ${method} ${urlStr}`);
    }) as unknown as typeof fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  test("should list files and fetch their contents correctly", async () => {
    const remoteZip = new RemoteZip("https://example.com/test.zip");

    const files = await remoteZip.getFileList();
    expect(files).toContain("hello.txt");
    expect(files).toContain("another.txt");

    // Fetch and check hello.txt
    const helloUrl = await remoteZip.getFileAsObjectURL("hello.txt");
    const helloResponse = await originalFetch(helloUrl);
    const helloText = await helloResponse.text();
    expect(helloText.trim()).toBe("Hello remote zip world!");

    // Fetch and check another.txt
    const anotherUrl = await remoteZip.getFileAsObjectURL("another.txt");
    const anotherResponse = await originalFetch(anotherUrl);
    const anotherText = await anotherResponse.text();
    expect(anotherText.trim()).toBe("Another file with some more content.");
  });

  test("should support lazy loading without calling getFileList() first", async () => {
    const remoteZip = new RemoteZip("https://example.com/test.zip");

    // Directly call getFileAsText
    const content = await remoteZip.getFileAsText("hello.txt");
    expect(content.trim()).toBe("Hello remote zip world!");
  });

  test("should support getEntries(), getEntry(), and hasFile()", async () => {
    const remoteZip = new RemoteZip("https://example.com/test.zip");

    expect(await remoteZip.hasFile("hello.txt")).toBe(true);
    expect(await remoteZip.hasFile("nonexistent.txt")).toBe(false);

    const entry = await remoteZip.getEntry("hello.txt");
    expect(entry).toBeDefined();
    expect(entry?.filename).toBe("hello.txt");
    expect(entry?.fileSize).toBe(24);
    expect(entry?.dateTime).toBeInstanceOf(Date);
    expect(entry?.isDirectory).toBe(false);

    const entries = await remoteZip.getEntries();
    expect(entries.length).toBeGreaterThanOrEqual(2);
    expect(entries.map((e) => e.filename)).toContain("hello.txt");
    expect(entries.map((e) => e.filename)).toContain("another.txt");
  });

  test("should support getFile() returning Uint8Array", async () => {
    const remoteZip = new RemoteZip("https://example.com/test.zip");
    const bytes = await remoteZip.getFile("hello.txt");
    expect(bytes).toBeInstanceOf(Uint8Array);
    const text = new TextDecoder().decode(bytes);
    expect(text.trim()).toBe("Hello remote zip world!");
  });

  test("should support getFileAsBlob() with mimeType detection", async () => {
    const remoteZip = new RemoteZip("https://example.com/test.zip");
    const blob = await remoteZip.getFileAsBlob("hello.txt");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/plain");

    const customBlob = await remoteZip.getFileAsBlob("hello.txt", "application/custom");
    expect(customBlob.type).toBe("application/custom");
  });

  test("should handle server returning 200 instead of 206 by slicing body", async () => {
    const customFetch = vi.fn().mockImplementation(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method?.toUpperCase() || "GET";
      if (method === "HEAD") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Length": zipBuffer.length.toString(),
            "Accept-Ranges": "bytes",
          }),
        } as unknown as Response;
      }
      if (method === "GET") {
        // Return full buffer with status 200
        const ab = zipBuffer.buffer.slice(zipBuffer.byteOffset, zipBuffer.byteOffset + zipBuffer.byteLength);
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          arrayBuffer: async () => ab,
          headers: new Headers({
            "Content-Length": zipBuffer.length.toString(),
          }),
        } as unknown as Response;
      }
      throw new Error(`Unhandled: ${method}`);
    }) as unknown as typeof fetch;

    const remoteZip = new RemoteZip("https://example.com/test.zip", {
      fetch: customFetch,
      debug: false,
    });

    const text = await remoteZip.getFileAsText("hello.txt");
    expect(text.trim()).toBe("Hello remote zip world!");
  });

  test("should throw descriptive error when range request fails", async () => {
    const failingFetch = vi.fn().mockImplementation(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method?.toUpperCase() || "GET";
      if (method === "HEAD") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Length": "1000",
            "Accept-Ranges": "bytes",
          }),
        } as unknown as Response;
      }
      return {
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as unknown as Response;
    }) as unknown as typeof fetch;

    const remoteZip = new RemoteZip("https://example.com/test.zip", {
      fetch: failingFetch,
    });

    await expect(remoteZip.getFileList()).rejects.toThrow("Failed to fetch range: 404 Not Found");
  });

  test("should throw on strictCrc failure and allow bypass when strictCrc is false", async () => {
    // Corrupt one byte of file data in hello.txt (offset 67)
    const corruptedZip = Buffer.from(zipBuffer);
    corruptedZip[68] = (corruptedZip[68] ?? 0) ^ 0xff;

    const corruptedFetch = vi.fn().mockImplementation(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method?.toUpperCase() || "GET";
      if (method === "HEAD") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Length": corruptedZip.length.toString(),
            "Accept-Ranges": "bytes",
          }),
        } as unknown as Response;
      }
      if (method === "GET") {
        const headers = init?.headers;
        let rangeHeader = "";
        if (headers instanceof Headers) {
          rangeHeader = headers.get("Range") || "";
        }
        const match = rangeHeader.match(/bytes=(\d+)-(\d+)/);
        if (match) {
          const start = parseInt(match[1], 10);
          const end = parseInt(match[2], 10);
          const sliced = corruptedZip.subarray(start, end + 1);
          const arrayBuffer = sliced.buffer.slice(
            sliced.byteOffset,
            sliced.byteOffset + sliced.byteLength
          );
          return {
            ok: true,
            status: 206,
            statusText: "Partial Content",
            arrayBuffer: async () => arrayBuffer,
            headers: new Headers({
              "Content-Range": `bytes ${start}-${end}/${corruptedZip.length}`,
              "Content-Length": sliced.length.toString(),
            }),
          } as unknown as Response;
        }
      }
      throw new Error(`Unhandled: ${method}`);
    }) as unknown as typeof fetch;

    const strictZip = new RemoteZip("https://example.com/test.zip", {
      fetch: corruptedFetch,
      strictCrc: true,
    });
    await expect(strictZip.getFile("hello.txt")).rejects.toThrow(/Calculated CRC32 .* doesn't match expected CRC32/);

    const nonStrictZip = new RemoteZip("https://example.com/test.zip", {
      fetch: corruptedFetch,
      strictCrc: false,
    });
    const bytes = await nonStrictZip.getFile("hello.txt");
    expect(bytes).toBeInstanceOf(Uint8Array);
  });

  test("parseExtra handles ZIP64 extra fields correctly and avoids infinite loops", () => {
    // Construct a ZIP64 extra field
    // Header ID: 0x0001 (2 bytes)
    // Data size: 24 (2 bytes)
    // uncompressed size: 10000000000 (8 bytes)
    // compressed size: 5000000000 (8 bytes)
    // header offset: 2000000000 (8 bytes)
    const buffer = new ArrayBuffer(28);
    const view = new DataView(buffer);
    view.setUint16(0, 0x0001, true); // ZIP64 fieldId
    view.setUint16(2, 24, true); // fieldSize
    view.setBigUint64(4, 10000000000n, true);
    view.setBigUint64(12, 5000000000n, true);
    view.setBigUint64(20, 2000000000n, true);

    const extra = new Uint8Array(buffer);

    // Case 1: All values in central directory were 0xffffffff
    const info1 = new RemoteZipInfo("large.bin", 0, 0xffffffff, 0, 0xffffffff, 0xffffffff, 0);
    info1.parseExtra(extra);
    expect(info1.fileSize).toBe(10000000000);
    expect(info1.compressSize).toBe(5000000000);
    expect(info1.headerOffset).toBe(2000000000);

    // Case 2: Only headerOffset was 0xffffffff (so extra only contains header offset 8 bytes)
    const buffer2 = new ArrayBuffer(12);
    const view2 = new DataView(buffer2);
    view2.setUint16(0, 0x0001, true);
    view2.setUint16(2, 8, true);
    view2.setBigUint64(4, 4294967296n, true);

    const info2 = new RemoteZipInfo("file2.bin", 0, 0xffffffff, 0, 100, 100, 0);
    info2.parseExtra(new Uint8Array(buffer2));
    expect(info2.headerOffset).toBe(4294967296);
    expect(info2.fileSize).toBe(100);
    expect(info2.compressSize).toBe(100);

    // Case 3: Truncated extra field (does not crash or loop infinitely)
    const truncatedExtra = new Uint8Array([0x01, 0x00, 0x10]); // incomplete header
    const info3 = new RemoteZipInfo("trunc.bin", 0, 0, 0, 0, 0, 0);
    expect(() => info3.parseExtra(truncatedExtra)).not.toThrow();

    // Case 4: Non-zip64 extra field preceding zip64 field
    const combinedBuffer = new ArrayBuffer(4 + 4 + 4 + 8); // field 1 (size 4) + field 2 (ZIP64 size 8)
    const combView = new DataView(combinedBuffer);
    // Field 1: unknown 0x9999, size 4
    combView.setUint16(0, 0x9999, true);
    combView.setUint16(2, 4, true);
    combView.setUint32(4, 0x12345678, true);
    // Field 2: ZIP64 0x0001, size 8
    combView.setUint16(8, 0x0001, true);
    combView.setUint16(10, 8, true);
    combView.setBigUint64(12, 9999999999n, true);

    const info4 = new RemoteZipInfo("comb.bin", 0, 0, 0, 0, 0xffffffff, 0);
    info4.parseExtra(new Uint8Array(combinedBuffer));
    expect(info4.fileSize).toBe(9999999999);
  });
});

describe("mime-types", () => {
  test("should have correct MIME type fixes and additions", () => {
    expect(mimeTypes[".jpeg"]).toBe("image/jpeg");
    expect(mimeTypes[".jpg"]).toBe("image/jpeg");
    expect(mimeTypes[".mid"]).toBe("audio/midi");
    expect(mimeTypes[".xml"]).toBe("application/xml");
    expect(mimeTypes[".mp4"]).toBe("video/mp4");
    expect(mimeTypes[".wasm"]).toBe("application/wasm");
    expect(mimeTypes[".avif"]).toBe("image/avif");
    expect(mimeTypes[".cjs"]).toBe("text/javascript");
  });
});
