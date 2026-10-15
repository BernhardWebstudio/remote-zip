export interface RemoteZipOptions {
    headers?: HeadersInit;
    fetch?: typeof fetch;
    signal?: AbortSignal;
    strictCrc?: boolean;
    debug?: boolean;
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
export declare class RemoteZip {
    private url;
    private options;
    private zipSize;
    private files;
    private loaded;
    private loadPromise;
    private readonly magic_eocd;
    private readonly magic_eocd64;
    private readonly magic_eocd64_locator;
    constructor(url: string, options?: RemoteZipOptions);
    private getRange;
    private infoiter;
    private findLastIndex;
    private ensureLoaded;
    getFileList(): Promise<string[]>;
    getEntries(): Promise<RemoteZipEntry[]>;
    getEntry(filename: string): Promise<RemoteZipEntry | undefined>;
    hasFile(filename: string): Promise<boolean>;
    getFile(filename: string): Promise<Uint8Array>;
    getFileAsText(filename: string, encoding?: string): Promise<string>;
    getFileAsBlob(filename: string, mimeType?: string): Promise<Blob>;
    getFileAsObjectURL(filename: string, mimeType?: string): Promise<string>;
    private calculateCRC32;
}
export declare class RemoteZipInfo {
    filename: string;
    dateTime: number;
    headerOffset: number;
    compressType: number;
    compressSize: number;
    fileSize: number;
    crc32: number;
    constructor(filename: string, dateTime: number, headerOffset: number, compressType: number, compressSize: number, fileSize: number, crc32: number);
    parseExtra(extra: Uint8Array): void;
    toEntry(): RemoteZipEntry;
}
export default RemoteZip;
