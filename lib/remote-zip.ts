import * as pako from "pako";
import { crc32 } from "@foxglove/crc";
import { mimeTypes } from "./mime-types";

/**
 * RemoteZip - A TypeScript library for extracting individual files from .zip files over HTTP
 * without downloading the entire archive.
 *
 * Inspired by the Python unzip-http library by Saul Pwanson.
 */
export class RemoteZip {
  private url: string;
  private zipSize: number = 0;
  private files: Map<string, RemoteZipInfo> = new Map();

  // private readonly fmt_eocd = "<IHHHHIIH";
  // private readonly fmt_eocd64 = "<IQHHIIQQQQ";
  // private readonly fmt_cdirentry = "<IHHHHIIIIHHHHHII";
  // private readonly fmt_localhdr = "<IHHHIIIIHH";
  private readonly magic_eocd64 = new Uint8Array([0x50, 0x4b, 0x06, 0x06]);
  private readonly magic_eocd = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);

  constructor(url: string) {
    this.url = url;
  }

  private async getRange(start: number, n: number): Promise<ArrayBuffer> {
    const response = await fetch(this.url, {
      headers: { Range: `bytes=${start}-${start + n - 1}` },
    });
    return await response.arrayBuffer();
  }

  private async infoiter(): Promise<RemoteZipInfo[]> {
    const response = await fetch(this.url, { method: "HEAD" });
    const r = response.headers.get("Accept-Ranges") || "";
    if (r !== "bytes") {
      const hostname = new URL(this.url).hostname;
      console.warn(
        `${hostname} Accept-Ranges header ('${r}') is not 'bytes'--trying anyway`
      );
    }

    this.zipSize = parseInt(response.headers.get("Content-Length") || "0");
    let resp = await this.getRange(Math.max(this.zipSize - 65536, 0), 65536);
    let respData = new Uint8Array(resp);

    let cdirStart = -1;
    let cdirBytes = 0;
    let i = this.findLastIndex(respData, this.magic_eocd64);
    if (i >= 0) {
      // Parse EOCD64 record
      const view = new DataView(resp);
      cdirBytes = Number(view.getBigUint64(i + 40, true));
      cdirStart = Number(view.getBigUint64(i + 48, true));
    } else {
      i = this.findLastIndex(respData, this.magic_eocd);
      if (i >= 0) {
        // Parse EOCD record
        const view = new DataView(resp);
        cdirBytes = view.getUint32(i + 12, true);
        cdirStart = view.getUint32(i + 16, true);
      }
    }

    if (cdirStart < 0 || cdirStart >= this.zipSize) {
      throw new Error("Cannot find central directory");
    }

    // Fetch the entire central directory
    resp = await this.getRange(cdirStart, cdirBytes);
    respData = new Uint8Array(resp);

    const result: RemoteZipInfo[] = [];
    let filehdrIndex = 0;

    while (filehdrIndex < cdirBytes) {
      const view = new DataView(resp, filehdrIndex);
      // const magic = view.getUint32(0, true);
      const method = view.getUint16(10, true);
      const dateTime = view.getUint32(12, true);
      const complen = view.getUint32(20, true);
      const uncomplen = view.getUint32(24, true);
      const fnlen = view.getUint16(28, true);
      const extralen = view.getUint16(30, true);
      const commentlen = view.getUint16(32, true);
      const localHeaderOfs = view.getUint32(42, true);
      const crc32 = view.getUint32(16, true);

      filehdrIndex += 46;

      const filename = new TextDecoder().decode(
        respData.slice(filehdrIndex, filehdrIndex + fnlen)
      );
      filehdrIndex += fnlen;

      const extra = respData.slice(filehdrIndex, filehdrIndex + extralen);
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
      if (searchElement.every((value, index) => value === array[i + index])) {
        return i;
      }
    }
    return -1;
  }

  async getFileList(): Promise<string[]> {
    const infoList = await this.infoiter();
    this.files = new Map(infoList.map((info) => [info.filename, info]));
    return Array.from(this.files.keys());
  }

  async getFileAsObjectURL(
    filename: string,
    mimeType: string = ""
  ): Promise<string> {
    const fileInfo = this.files.get(filename);
    if (!fileInfo) {
      throw new Error(`File not found: ${filename}`);
    }

    const fileExtension = "." + (filename.split(".").pop() || "").toLowerCase();
    if (fileExtension in mimeTypes && mimeType == "") {
      mimeType = mimeTypes[fileExtension as keyof typeof mimeTypes];
    }

    console.log("File info:", fileInfo);

    // Fetch the local file header
    const localHdrSize = 30; // Size of local file header
    const localHdrData = await this.getRange(
      fileInfo.headerOffset,
      localHdrSize + fileInfo.filename.length + 2
    );
    const localHdrView = new DataView(localHdrData);

    // Parse local file header
    const signature = localHdrView.getUint32(0, true);
    if (signature !== 0x04034b50) {
      throw new Error("Invalid local file header signature");
    }
    const filenameLength = localHdrView.getUint16(26, true);
    const extraFieldLength = localHdrView.getUint16(28, true);

    console.log("Local header info:", {
      signature: signature.toString(16),
      filenameLength,
      extraFieldLength,
    });

    // Calculate the offset to the file data
    const fileDataOffset =
      fileInfo.headerOffset + localHdrSize + filenameLength + extraFieldLength;

    console.log("File data offset:", fileDataOffset);

    // Fetch the compressed data
    const compressedData = await this.getRange(
      fileDataOffset,
      fileInfo.compressSize
    );
    console.log("Compressed data size:", compressedData.byteLength);

    let decompressedData: Uint8Array;
    if (fileInfo.compressType === 0) {
      // Stored (no compression)
      decompressedData = new Uint8Array(compressedData);
    } else if (fileInfo.compressType === 8) {
      // Deflate
      try {
        // Use raw inflate (no zlib wrapper)
        decompressedData = pako.inflateRaw(new Uint8Array(compressedData));
      } catch (error) {
        console.error("Decompression error:", error);
        console.error(
          "Compressed data (first 50 bytes):",
          new Uint8Array(compressedData).slice(0, 50)
        );
        throw new Error("Failed to decompress file data");
      }
    } else {
      throw new Error(
        `Unsupported compression method: ${fileInfo.compressType}`
      );
    }

    console.log("Decompressed data size:", decompressedData.length);

    // Verify the decompressed size
    if (decompressedData.length !== fileInfo.fileSize) {
      console.warn(
        `Decompressed size (${decompressedData.length}) doesn't match expected size (${fileInfo.fileSize})`
      );
    }

    // Verify CRC32
    const calculatedCRC32 = this.calculateCRC32(decompressedData);
    if (calculatedCRC32 !== fileInfo.crc32) {
      console.warn(
        `Calculated CRC32 (${calculatedCRC32}) doesn't match expected CRC32 (${fileInfo.crc32})`
      );
    }

    const blob = new Blob([decompressedData], {
      type: mimeType || "application/octet-stream",
    });
    return URL.createObjectURL(blob);
  }

  private calculateCRC32(data: Uint8Array): number {
    return crc32(data);
  }
}

class RemoteZipInfo {
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
    while (i < extra.length) {
      const fieldId = (extra[i + 1] << 8) | extra[i];
      const fieldSize = (extra[i + 3] << 8) | extra[i + 2];
      i += 4;

      if (fieldId === 0x0001) {
        // ZIP64
        if (fieldSize >= 8 && this.fileSize === 0xffffffff) {
          this.fileSize = Number(
            new DataView(extra.buffer, i, 8).getBigUint64(0, true)
          );
          i += 8;
        }
        if (fieldSize >= 16 && this.compressSize === 0xffffffff) {
          this.compressSize = Number(
            new DataView(extra.buffer, i, 8).getBigUint64(0, true)
          );
          i += 8;
        }
        if (fieldSize >= 24 && this.headerOffset === 0xffffffff) {
          this.headerOffset = Number(
            new DataView(extra.buffer, i, 8).getBigUint64(0, true)
          );
          i += 8;
        }
      } else {
        i += fieldSize;
      }
    }
  }
}
