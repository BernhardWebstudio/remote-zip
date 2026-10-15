import * as pako from "pako";
import { crc32 } from "@foxglove/crc";
import { mimeTypes } from "./mime-types";

export interface RemoteZipOptions {
  headers?: HeadersInit;
  fetch?: typeof fetch;
  signal?: AbortSignal;
  strictCrc?: boolean; // default true
  debug?: boolean; // default false
}

export interface RemoteZipEntry {
  filename: string;
  dateTime: Date;
  headerOffset: number;
  compressType: number;
  compressSize: number;
  fileSize: number;
  crc32: number;
  isDirectory: boolean;
}

/**
 * RemoteZip - A TypeScript library for extracting individual files from .zip files over HTTP
 * without downloading the entire archive.
 *
 * Inspired by the Python unzip-http library by Saul Pwanson.
 */
export class RemoteZip {
  private url: string;
  private options: {
    headers?: HeadersInit;
    fetch?: typeof fetch;
    signal?: AbortSignal;
    strictCrc: boolean;
    debug: boolean;
  };
  private zipSize: number = 0;
  private files: Map<string, RemoteZipInfo> = new Map();
  private loaded: boolean = false;
  private loadPromise: Promise<void> | null = null;

  private readonly magic_eocd = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);
  private readonly magic_eocd64 = new Uint8Array([0x50, 0x4b, 0x06, 0x06]);
  private readonly magic_eocd64_locator = new Uint8Array([0x50, 0x4b, 0x06, 0x07]);

  constructor(url: string, options: RemoteZipOptions = {}) {
    this.url = url;
    this.options = {
      strictCrc: options.strictCrc ?? true,
      debug: options.debug ?? false,
      headers: options.headers,
      fetch: options.fetch,
      signal: options.signal,
    };
  }

  private async getRange(start: number, n: number): Promise<ArrayBuffer> {
    const fetchFn = this.options.fetch || globalThis.fetch;
    const headers = new Headers(this.options.headers);
    headers.set("Range", `bytes=${start}-${start + n - 1}`);

    const response = await fetchFn(this.url, {
      method: "GET",
      headers,
      signal: this.options.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch range: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    if (response.status === 200) {
      if (this.options.debug) {
        console.warn(
          "Server returned 200 OK instead of 206 Partial Content. Slicing requested range from response body."
        );
      }
      if (arrayBuffer.byteLength > n) {
        return arrayBuffer.slice(start, start + n);
      }
    }

    return arrayBuffer;
  }

  private async infoiter(): Promise<RemoteZipInfo[]> {
    const fetchFn = this.options.fetch || globalThis.fetch;
    const headHeaders = new Headers(this.options.headers);
    const response = await fetchFn(this.url, {
      method: "HEAD",
      headers: headHeaders,
      signal: this.options.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch zip metadata: ${response.status} ${response.statusText}`);
    }

    const r = response.headers.get("Accept-Ranges") || "";
    if (r !== "bytes" && this.options.debug) {
      const hostname = new URL(this.url).hostname;
      console.warn(
        `${hostname} Accept-Ranges header ('${r}') is not 'bytes'--trying anyway`
      );
    }

    this.zipSize = parseInt(response.headers.get("Content-Length") || "0", 10);
    if (!this.zipSize || this.zipSize <= 0) {
      throw new Error("Invalid or missing Content-Length header");
    }

    const readSize = Math.min(this.zipSize, 65536);
    const searchStart = this.zipSize - readSize;
    let resp = await this.getRange(searchStart, readSize);
    let respData = new Uint8Array(resp);

    let cdirStart = -1;
    let cdirBytes = 0;

    // First search for standard EOCD record
    const eocdIndex = this.findLastIndex(respData, this.magic_eocd);
    if (eocdIndex >= 0) {
      const view = new DataView(resp, eocdIndex);
      cdirBytes = view.getUint32(12, true);
      cdirStart = view.getUint32(16, true);
      const totalEntries = view.getUint16(10, true);

      // Check if ZIP64 locator is needed
      if (
        cdirStart === 0xffffffff ||
        cdirBytes === 0xffffffff ||
        totalEntries === 0xffff
      ) {
        let locatorFound = false;
        let locatorIndex = -1;
        if (eocdIndex >= 20) {
          if (
            respData[eocdIndex - 20] === 0x50 &&
            respData[eocdIndex - 19] === 0x4b &&
            respData[eocdIndex - 18] === 0x06 &&
            respData[eocdIndex - 17] === 0x07
          ) {
            locatorIndex = eocdIndex - 20;
          }
        }
        if (locatorIndex < 0) {
          locatorIndex = this.findLastIndex(
            respData.subarray(0, eocdIndex),
            this.magic_eocd64_locator
          );
        }

        if (locatorIndex >= 0) {
          const locView = new DataView(resp, locatorIndex);
          const eocd64Offset = Number(locView.getBigUint64(8, true));

          if (eocd64Offset >= searchStart && eocd64Offset + 56 <= this.zipSize) {
            const eocd64View = new DataView(resp, eocd64Offset - searchStart);
            if (eocd64View.getUint32(0, true) === 0x06064b50) {
              cdirBytes = Number(eocd64View.getBigUint64(40, true));
              cdirStart = Number(eocd64View.getBigUint64(48, true));
              locatorFound = true;
            }
          } else if (eocd64Offset >= 0 && eocd64Offset + 56 <= this.zipSize) {
            const eocd64Buf = await this.getRange(eocd64Offset, 56);
            const eocd64View = new DataView(eocd64Buf);
            if (eocd64View.getUint32(0, true) === 0x06064b50) {
              cdirBytes = Number(eocd64View.getBigUint64(40, true));
              cdirStart = Number(eocd64View.getBigUint64(48, true));
              locatorFound = true;
            }
          }
        }

        if (!locatorFound) {
          // Fallback safely to searching for magic_eocd64 directly in respData
          const eocd64Index = this.findLastIndex(respData, this.magic_eocd64);
          if (eocd64Index >= 0 && eocd64Index + 56 <= respData.length) {
            const view64 = new DataView(resp, eocd64Index);
            if (view64.getUint32(0, true) === 0x06064b50) {
              cdirBytes = Number(view64.getBigUint64(40, true));
              cdirStart = Number(view64.getBigUint64(48, true));
            }
          }
        }
      }
    } else {
      // Fallback: search for EOCD64 record directly
      const eocd64Index = this.findLastIndex(respData, this.magic_eocd64);
      if (eocd64Index >= 0 && eocd64Index + 56 <= respData.length) {
        const view = new DataView(resp, eocd64Index);
        if (view.getUint32(0, true) === 0x06064b50) {
          cdirBytes = Number(view.getBigUint64(40, true));
          cdirStart = Number(view.getBigUint64(48, true));
        }
      }
    }

    if (
      cdirStart < 0 ||
      cdirStart > this.zipSize ||
      cdirBytes < 0 ||
      cdirStart + cdirBytes > this.zipSize
    ) {
      throw new Error("Cannot find central directory");
    }

    if (cdirBytes === 0) {
      return [];
    }

    // Fetch the entire central directory
    resp = await this.getRange(cdirStart, cdirBytes);
    respData = new Uint8Array(resp);

    const result: RemoteZipInfo[] = [];
    let filehdrIndex = 0;

    while (filehdrIndex + 46 <= cdirBytes) {
      const view = new DataView(resp, filehdrIndex);
      const signature = view.getUint32(0, true);
      if (signature !== 0x02014b50) {
        break;
      }

      const method = view.getUint16(10, true);
      const dateTime = view.getUint32(12, true);
      const crc32 = view.getUint32(16, true);
      const complen = view.getUint32(20, true);
      const uncomplen = view.getUint32(24, true);
      const fnlen = view.getUint16(28, true);
      const extralen = view.getUint16(30, true);
      const commentlen = view.getUint16(32, true);
      const localHeaderOfs = view.getUint32(42, true);

      filehdrIndex += 46;

      if (filehdrIndex + fnlen > cdirBytes) {
        break;
      }
      const filename = new TextDecoder().decode(
        respData.subarray(filehdrIndex, filehdrIndex + fnlen)
      );
      filehdrIndex += fnlen;

      if (filehdrIndex + extralen > cdirBytes) {
        break;
      }
      const extra = respData.subarray(filehdrIndex, filehdrIndex + extralen);
      filehdrIndex += extralen;

      filehdrIndex += commentlen;

      const rzi = new RemoteZipInfo(
        filename,
        dateTime,
        localHeaderOfs,
        method,
        complen,
        uncomplen,
        crc32
      );
      rzi.parseExtra(extra);
      result.push(rzi);
    }

    return result;
  }

  private findLastIndex(array: Uint8Array, searchElement: Uint8Array): number {
    for (let i = array.length - searchElement.length; i >= 0; i--) {
      let match = true;
      for (let j = 0; j < searchElement.length; j++) {
        if (array[i + j] !== searchElement[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        return i;
      }
    }
    return -1;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) {
      return;
    }
    if (!this.loadPromise) {
      this.loadPromise = (async () => {
        const infoList = await this.infoiter();
        this.files = new Map(infoList.map((info) => [info.filename, info]));
        this.loaded = true;
      })();
    }
    await this.loadPromise;
  }

  async getFileList(): Promise<string[]> {
    await this.ensureLoaded();
    return Array.from(this.files.keys());
  }

  async getEntries(): Promise<RemoteZipEntry[]> {
    await this.ensureLoaded();
    return Array.from(this.files.values()).map((info) => info.toEntry());
  }

  async getEntry(filename: string): Promise<RemoteZipEntry | undefined> {
    await this.ensureLoaded();
    const info = this.files.get(filename);
    return info ? info.toEntry() : undefined;
  }

  async hasFile(filename: string): Promise<boolean> {
    await this.ensureLoaded();
    return this.files.has(filename);
  }

  async getFile(filename: string): Promise<Uint8Array> {
    await this.ensureLoaded();
    const fileInfo = this.files.get(filename);
    if (!fileInfo) {
      throw new Error(`File not found: ${filename}`);
    }

    if (this.options.debug) {
      console.log("File info:", fileInfo);
    }

    // Fetch the 30-byte local file header
    const localHdrSize = 30;
    const localHdrData = await this.getRange(fileInfo.headerOffset, localHdrSize);
    const localHdrView = new DataView(localHdrData);

    const signature = localHdrView.getUint32(0, true);
    if (signature !== 0x04034b50) {
      throw new Error("Invalid local file header signature");
    }

    const filenameLength = localHdrView.getUint16(26, true);
    const extraFieldLength = localHdrView.getUint16(28, true);

    if (this.options.debug) {
      console.log("Local header info:", {
        signature: signature.toString(16),
        filenameLength,
        extraFieldLength,
      });
    }

    const fileDataOffset =
      fileInfo.headerOffset + localHdrSize + filenameLength + extraFieldLength;

    if (this.options.debug) {
      console.log("File data offset:", fileDataOffset);
    }

    let decompressedData: Uint8Array;

    if (fileInfo.compressSize === 0) {
      decompressedData = new Uint8Array(0);
    } else {
      const compressedData = await this.getRange(
        fileDataOffset,
        fileInfo.compressSize
      );

      if (this.options.debug) {
        console.log("Compressed data size:", compressedData.byteLength);
      }

      if (fileInfo.compressType === 0) {
        // Stored (no compression)
        decompressedData = new Uint8Array(compressedData);
      } else if (fileInfo.compressType === 8) {
        // Deflate
        try {
          decompressedData = pako.inflateRaw(new Uint8Array(compressedData));
        } catch (error) {
          if (this.options.debug) {
            console.error("Decompression error:", error);
            console.error(
              "Compressed data (first 50 bytes):",
              new Uint8Array(compressedData).slice(0, 50)
            );
          }
          throw new Error("Failed to decompress file data");
        }
      } else {
        throw new Error(
          `Unsupported compression method: ${fileInfo.compressType}`
        );
      }
    }

    if (this.options.debug) {
      console.log("Decompressed data size:", decompressedData.length);
    }

    // Verify decompressed size
    if (decompressedData.length !== fileInfo.fileSize) {
      const msg = `Decompressed size (${decompressedData.length}) doesn't match expected size (${fileInfo.fileSize})`;
      if (this.options.strictCrc) {
        throw new Error(msg);
      } else if (this.options.debug) {
        console.warn(msg);
      }
    }

    // Verify CRC32
    const calculatedCRC32 = this.calculateCRC32(decompressedData);
    const expectedCRC32 = fileInfo.crc32 >>> 0;
    if (calculatedCRC32 !== expectedCRC32) {
      const msg = `Calculated CRC32 (${calculatedCRC32}) doesn't match expected CRC32 (${expectedCRC32})`;
      if (this.options.strictCrc) {
        throw new Error(msg);
      } else if (this.options.debug) {
        console.warn(msg);
      }
    }

    return decompressedData;
  }

  async getFileAsText(filename: string, encoding: string = "utf-8"): Promise<string> {
    const data = await this.getFile(filename);
    return new TextDecoder(encoding).decode(data);
  }

  async getFileAsBlob(
    filename: string,
    mimeType: string = ""
  ): Promise<Blob> {
    const data = await this.getFile(filename);
    if (!mimeType) {
      const fileExtension = "." + (filename.split(".").pop() || "").toLowerCase();
      if (fileExtension in mimeTypes) {
        mimeType = mimeTypes[fileExtension as keyof typeof mimeTypes];
      }
    }

    return new Blob([data as unknown as BlobPart], {
      type: mimeType || "application/octet-stream",
    });
  }

  async getFileAsObjectURL(
    filename: string,
    mimeType: string = ""
  ): Promise<string> {
    const blob = await this.getFileAsBlob(filename, mimeType);
    return URL.createObjectURL(blob);
  }

  private calculateCRC32(data: Uint8Array): number {
    return crc32(data) >>> 0;
  }
}

export class RemoteZipInfo {
  filename: string;
  dateTime: number;
  headerOffset: number;
  compressType: number;
  compressSize: number;
  fileSize: number;
  crc32: number;

  constructor(
    filename: string,
    dateTime: number,
    headerOffset: number,
    compressType: number,
    compressSize: number,
    fileSize: number,
    crc32: number
  ) {
    this.filename = filename;
    this.dateTime = dateTime;
    this.headerOffset = headerOffset;
    this.compressType = compressType;
    this.compressSize = compressSize;
    this.fileSize = fileSize;
    this.crc32 = crc32;
  }

  parseExtra(extra: Uint8Array): void {
    let i = 0;
    const view = new DataView(extra.buffer, extra.byteOffset, extra.byteLength);

    while (i + 4 <= extra.length) {
      const fieldId = view.getUint16(i, true);
      const fieldSize = view.getUint16(i + 2, true);
      const nextField = i + 4 + fieldSize;

      if (nextField > extra.length) {
        break;
      }

      if (fieldId === 0x0001) {
        // ZIP64 Extra Information Field
        let offset = i + 4;
        if (this.fileSize === 0xffffffff && offset + 8 <= nextField) {
          this.fileSize = Number(view.getBigUint64(offset, true));
          offset += 8;
        }
        if (this.compressSize === 0xffffffff && offset + 8 <= nextField) {
          this.compressSize = Number(view.getBigUint64(offset, true));
          offset += 8;
        }
        if (this.headerOffset === 0xffffffff && offset + 8 <= nextField) {
          this.headerOffset = Number(view.getBigUint64(offset, true));
          offset += 8;
        }
      }

      i = nextField;
    }
  }

  toEntry(): RemoteZipEntry {
    const time = this.dateTime & 0xffff;
    const date = (this.dateTime >>> 16) & 0xffff;

    const seconds = (time & 0x1f) * 2;
    const minutes = (time >>> 5) & 0x3f;
    const hours = (time >>> 11) & 0x1f;

    const day = Math.max(1, date & 0x1f);
    const month = Math.max(0, ((date >>> 5) & 0x0f) - 1);
    const year = ((date >>> 9) & 0x7f) + 1980;

    return {
      filename: this.filename,
      dateTime: new Date(year, month, day, hours, minutes, seconds),
      headerOffset: this.headerOffset,
      compressType: this.compressType,
      compressSize: this.compressSize,
      fileSize: this.fileSize,
      crc32: this.crc32,
      isDirectory: this.filename.endsWith("/"),
    };
  }
}

export default RemoteZip;
