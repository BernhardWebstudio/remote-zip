import { expect, test, describe, beforeAll, afterAll, vi } from "vitest";
import { RemoteZip } from "./remote-zip";
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
          const found = headers.find(h => h[0].toLowerCase() === "range");
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
          const arrayBuffer = sliced.buffer.slice(sliced.byteOffset, sliced.byteOffset + sliced.byteLength);
          return {
            ok: true,
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
});
