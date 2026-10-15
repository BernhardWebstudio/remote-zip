import { expect, test, describe, beforeAll, afterAll, vi } from "vitest";
import { RemoteZip } from "./remote-zip";
import * as fs from "fs";
import * as path from "path";

describe("RemoteZip - Deflate and Advanced Features", () => {
  let deflatedBuffer: Buffer;
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    const zipPath = path.resolve(__dirname, "../test-assets/deflated.zip");
    deflatedBuffer = fs.readFileSync(zipPath);

    globalThis.fetch = vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.signal?.aborted) {
        const error = new Error("This operation was aborted");
        error.name = "AbortError";
        throw error;
      }

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
            "Content-Length": deflatedBuffer.length.toString(),
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
          const sliced = deflatedBuffer.subarray(start, end + 1);
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
              "Content-Range": `bytes ${start}-${end}/${deflatedBuffer.length}`,
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

  test("should list all files including nested, empty, and UTF-8 files", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    const files = await rz.getFileList();
    expect(files).toContain("empty.txt");
    expect(files).toContain("deflated.txt");
    expect(files).toContain("dir/");
    expect(files).toContain("dir/nested.txt");
    expect(files).toContain("ümlaut.txt");
  });

  test("should extract deflated text file with exact content match", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    const entry = await rz.getEntry("deflated.txt");
    expect(entry).toBeDefined();
    expect(entry?.compressType).toBe(8); // Deflate
    expect(entry?.fileSize).toBe(5100);
    expect(entry?.compressSize).toBeLessThan(5100);

    const bytes = await rz.getFile("deflated.txt");
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(5100);

    const text = await rz.getFileAsText("deflated.txt");
    const expected = "This is repetitive text that compresses very well! ".repeat(100);
    expect(text).toBe(expected);

    const blob = await rz.getFileAsBlob("deflated.txt");
    expect(blob.size).toBe(5100);
    expect(blob.type).toBe("text/plain");

    const objectUrl = await rz.getFileAsObjectURL("deflated.txt");
    const fetchedResp = await originalFetch(objectUrl);
    expect(await fetchedResp.text()).toBe(expected);
  });

  test("should extract nested file in subdirectory", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    const text = await rz.getFileAsText("dir/nested.txt");
    const expected = "Nested file content repeated! ".repeat(50);
    expect(text).toBe(expected);
  });

  test("should recognize directory entry metadata", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    const entry = await rz.getEntry("dir/");
    expect(entry).toBeDefined();
    expect(entry?.isDirectory).toBe(true);
    expect(entry?.fileSize).toBe(0);
  });

  test("should handle empty (0-byte) files without invalid range requests", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    const bytes = await rz.getFile("empty.txt");
    expect(bytes.length).toBe(0);

    const text = await rz.getFileAsText("empty.txt");
    expect(text).toBe("");

    const blob = await rz.getFileAsBlob("empty.txt");
    expect(blob.size).toBe(0);
  });

  test("should handle UTF-8 / non-ASCII filenames correctly", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    expect(await rz.hasFile("ümlaut.txt")).toBe(true);

    const text = await rz.getFileAsText("ümlaut.txt");
    const expected = "Grüße von über den Wolken! Äpfel, Öfen, Übermut. ".repeat(20);
    expect(text).toBe(expected);
  });

  test("should handle non-existent files gracefully", async () => {
    const rz = new RemoteZip("https://example.com/deflated.zip");
    expect(await rz.hasFile("missing.txt")).toBe(false);
    expect(await rz.getEntry("missing.txt")).toBeUndefined();
    await expect(rz.getFile("missing.txt")).rejects.toThrow("File not found: missing.txt");
  });

  test("should pass custom request headers to fetch", async () => {
    const headersSent: Record<string, string>[] = [];

    const customFetch = vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const hdrs = init?.headers;
      const rec: Record<string, string> = {};
      if (hdrs instanceof Headers) {
        hdrs.forEach((v, k) => {
          rec[k] = v;
        });
      }
      headersSent.push(rec);

      return (globalThis.fetch as typeof fetch)(input, init);
    }) as unknown as typeof fetch;

    const rz = new RemoteZip("https://example.com/deflated.zip", {
      fetch: customFetch,
      headers: {
        Authorization: "Bearer secret-token",
        "X-Custom-Header": "custom-val",
      },
    });

    await rz.getFileAsText("deflated.txt");
    expect(headersSent.length).toBeGreaterThan(0);
    for (const h of headersSent) {
      expect(h["authorization"]).toBe("Bearer secret-token");
      expect(h["x-custom-header"]).toBe("custom-val");
    }
  });

  test("should handle AbortSignal cancellation", async () => {
    const controller = new AbortController();
    controller.abort();

    const rz = new RemoteZip("https://example.com/deflated.zip", {
      signal: controller.signal,
    });

    await expect(rz.getFileList()).rejects.toThrow(/aborted/);
  });

  test("should throw descriptive error when Deflate decompression fails", async () => {
    // Corrupt compressed payload at offset 273 (deflated.txt compressed payload)
    const corruptedZip = Buffer.from(deflatedBuffer);
    for (let i = 273; i < 273 + 20; i++) {
      corruptedZip[i] = 0xff;
    }

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

    const rz = new RemoteZip("https://example.com/deflated.zip", {
      fetch: corruptedFetch,
    });

    await expect(rz.getFile("deflated.txt")).rejects.toThrow("Failed to decompress file data");
  });
});
