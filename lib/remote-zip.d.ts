/**
 * RemoteZip - A TypeScript library for extracting individual files from .zip files over HTTP
 * without downloading the entire archive.
 *
 * Inspired by the Python unzip-http library by Saul Pwanson.
 */
export declare class RemoteZip {
    private url;
    private zipSize;
    private files;
    private readonly magic_eocd64;
    private readonly magic_eocd;
    constructor(url: string);
    private getRange;
    private infoiter;
    private findLastIndex;
    getFileList(): Promise<string[]>;
    getFileAsObjectURL(filename: string, mimeType?: string): Promise<string>;
    private calculateCRC32;
}
