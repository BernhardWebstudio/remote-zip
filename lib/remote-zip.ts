/**
 * RemoteZip - A TypeScript library for extracting individual files from .zip files over HTTP
 * without downloading the entire archive.
 * 
 * Inspired by the Python unzip-http library by Saul Pwanson.
 */

// Constants for ZIP file format
const MAGIC_EOCD = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);
const MAGIC_EOCD64 = new Uint8Array([0x50, 0x4b, 0x06, 0x06]);

// Helper function to find a byte sequence in an array
function findBytes(haystack: Uint8Array, needle: Uint8Array): number {
  search:
  for (let i = haystack.length - needle.length; i >= 0; i--) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue search;
    }
    return i;
  }
  return -1;
}

// Helper function to read little-endian values from a buffer
function readUint32LE(buffer: Uint8Array, offset: number): number {
  return buffer[offset] | 
         (buffer[offset + 1] << 8) | 
         (buffer[offset + 2] << 16) | 
         (buffer[offset + 3] << 24);
}

function readUint16LE(buffer: Uint8Array, offset: number): number {
  return buffer[offset] | (buffer[offset + 1] << 8);
}

function readUint64LE(buffer: Uint8Array, offset: number): number {
  // JavaScript can't handle 64-bit integers precisely, but this works for most cases
  const lo = readUint32LE(buffer, offset);
  const hi = readUint32LE(buffer, offset + 4);
  return lo + hi * 4294967296;
}

// Interface for file information
interface RemoteZipInfo {
  filename: string;
  headerOffset: number;
  compressType: number;
  compressSize: number;
  fileSize: number;
  dateTime: Date;
  isDirectory: boolean;
}

export class RemoteZip {
  private url: string;
  private zipSize: number = 0;
  private files: Map<string, RemoteZipInfo> = new Map();
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Initialize the RemoteZip instance by fetching the central directory
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInit();
    await this.initPromise;
    this.initialized = true;
  }

  private async doInit(): Promise<void> {
    // First, get the file size with a HEAD request
    const headResponse = await fetch(this.url, { method: 'HEAD' });
    
    // Check if the server supports range requests
    const acceptRanges = headResponse.headers.get('Accept-Ranges');
    if (acceptRanges !== 'bytes') {
      console.warn(`Server Accept-Ranges header ('${acceptRanges}') is not 'bytes'--trying anyway`);
    }

    const contentLength = headResponse.headers.get('Content-Length');
    if (!contentLength) {
      throw new Error('Server did not provide Content-Length header');
    }

    this.zipSize = parseInt(contentLength, 10);

    // Get the end of the file to find the central directory
    const endBytes = await this.getRange(Math.max(this.zipSize - 65536, 0), 65536);
    const endData = new Uint8Array(await endBytes.arrayBuffer());

    // Find the end of central directory record
    let cdirStart = -1;
    let i = findBytes(endData, MAGIC_EOCD64);
    
    if (i >= 0) {
      // ZIP64 format
      cdirStart = readUint64LE(endData, i + 48);
    } else {
      i = findBytes(endData, MAGIC_EOCD);
      if (i >= 0) {
        // Standard ZIP format
        cdirStart = readUint32LE(endData, i + 16);
      }
    }

    if (cdirStart < 0 || cdirStart >= this.zipSize) {
      throw new Error('Cannot find central directory');
    }

    // Get the central directory
    let cdirData: Uint8Array;
    if (this.zipSize <= 65536) {
      cdirData = endData;
    } else {
      const cdirResponse = await this.getRange(cdirStart, this.zipSize - cdirStart);
      cdirData = new Uint8Array(await cdirResponse.arrayBuffer());
    }

    // Parse the central directory entries
    await this.parseCentralDirectory(cdirData, cdirStart);
  }

  private async parseCentralDirectory(data: Uint8Array, cdirStart: number): Promise<void> {
    let offset = 0;
    
    while (offset < data.length) {
      // Check for central directory entry signature (0x02014b50)
      if (data[offset] !== 0x50 || data[offset + 1] !== 0x4b || 
          data[offset + 2] !== 0x01 || data[offset + 3] !== 0x02) {
        break;
      }

      // Parse central directory entry
      const method = readUint16LE(data, offset + 10);
      const dateTimeRaw = readUint32LE(data, offset + 12);
      const compressSize = readUint32LE(data, offset + 20);
      const uncompressSize = readUint32LE(data, offset + 24);
      const filenameLength = readUint16LE(data, offset + 28);
      const extraFieldLength = readUint16LE(data, offset + 30);
      const commentLength = readUint16LE(data, offset + 32);
      const headerOffset = readUint32LE(data, offset + 42);

      offset += 46; // Move past the fixed-size portion

      // Read filename
      const filenameBytes = data.slice(offset, offset + filenameLength);
      const filename = new TextDecoder().decode(filenameBytes);
      offset += filenameLength;

      // Read extra field for ZIP64 extensions if needed
      let realCompressSize = compressSize;
      let realUncompressSize = uncompressSize;
      let realHeaderOffset = headerOffset;

      if (extraFieldLength > 0) {
        const extraField = data.slice(offset, offset + extraFieldLength);
        let extraOffset = 0;
        
        while (extraOffset + 4 <= extraField.length) {
          const headerId = readUint16LE(extraField, extraOffset);
          const dataSize = readUint16LE(extraField, extraOffset + 2);
          
          if (headerId === 0x0001 && dataSize >= 8) { // ZIP64 extended information
            extraOffset += 4;
            
            if (uncompressSize === 0xFFFFFFFF && extraOffset + 8 <= extraField.length) {
              realUncompressSize = readUint64LE(extraField, extraOffset);
              extraOffset += 8;
            }
            
            if (compressSize === 0xFFFFFFFF && extraOffset + 8 <= extraField.length) {
              realCompressSize = readUint64LE(extraField, extraOffset);
              extraOffset += 8;
            }
            
            if (headerOffset === 0xFFFFFFFF && extraOffset + 8 <= extraField.length) {
              realHeaderOffset = readUint64LE(extraField, extraOffset);
            }
            
            break;
          }
          
          extraOffset += 4 + dataSize;
        }
      }
      
      offset += extraFieldLength + commentLength;

      // Parse date and time
      const sec = (dateTimeRaw & 0x1F) * 2;
      const min = (dateTimeRaw >> 5) & 0x3F;
      const hour = (dateTimeRaw >> 11) & 0x1F;
      const day = (dateTimeRaw >> 16) & 0x1F;
      const month = ((dateTimeRaw >> 21) & 0x0F) - 1;
      const year = ((dateTimeRaw >> 25) & 0x7F) + 1980;
      
      const dateTime = new Date(year, month, day, hour, min, sec);

      // Create file info object
      const fileInfo: RemoteZipInfo = {
        filename,
        headerOffset: realHeaderOffset,
        compressType: method,
        compressSize: realCompressSize,
        fileSize: realUncompressSize,
        dateTime,
        isDirectory: filename.endsWith('/')
      };

      this.files.set(filename, fileInfo);
    }
  }

  /**
   * Get a range of bytes from the remote file
   */
  private async getRange(start: number, length: number): Promise<Response> {
    const response = await fetch(this.url, {
      headers: {
        'Range': `bytes=${start}-${start + length - 1}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  }

  /**
   * List all files in the ZIP archive
   */
  async getFileList(): Promise<string[]> {
    await this.init();
    return Array.from(this.files.keys());
  }

  /**
   * Get information about all files in the ZIP archive
   */
  async getFileInfo(): Promise<RemoteZipInfo[]> {
    await this.init();
    return Array.from(this.files.values());
  }

  /**
   * Find files matching a pattern
   */
  async findFiles(pattern: string | RegExp): Promise<RemoteZipInfo[]> {
    await this.init();
    
    const regex = pattern instanceof RegExp ? pattern : new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    const matches: RemoteZipInfo[] = [];
    
    for (const [filename, info] of this.files.entries()) {
      if (regex.test(filename)) {
        matches.push(info);
      }
    }
    
    return matches;
  }

  /**
   * Extract a file from the ZIP archive and return it as an ArrayBuffer
   */
  async extractFile(filename: string): Promise<ArrayBuffer> {
    await this.init();
    
    const fileInfo = this.files.get(filename);
    if (!fileInfo) {
      throw new Error(`File not found: ${filename}`);
    }
    
    // Get the local file header
    const headerResponse = await this.getRange(fileInfo.headerOffset, 30); // Fixed size of local file header
    const headerData = new Uint8Array(await headerResponse.arrayBuffer());
    
    // Check local file header signature
    if (headerData[0] !== 0x50 || headerData[1] !== 0x4b || 
        headerData[2] !== 0x03 || headerData[3] !== 0x07) {
      throw new Error('Invalid local file header');
    }
    
    const filenameLength = readUint16LE(headerData, 26);
    const extraFieldLength = readUint16LE(headerData, 28);
    
    // Calculate data offset
    const dataOffset = fileInfo.headerOffset + 30 + filenameLength + extraFieldLength;
    
    // Get the file data
    const dataResponse = await this.getRange(dataOffset, fileInfo.compressSize);
    const compressedData = await dataResponse.arrayBuffer();
    
    // Handle different compression methods
    if (fileInfo.compressType === 0) {
      // No compression
      return compressedData;
    } else if (fileInfo.compressType === 8) {
      // DEFLATE compression
      // We need to use the pako library or similar for decompression
      // This is a common external library for handling DEFLATE in JavaScript
      try {
        // Check if pako is available
        if (typeof window !== 'undefined' && (window as any).pako) {
          return (window as any).pako.inflate(new Uint8Array(compressedData)).buffer;
        } else {
          throw new Error('Pako library not found. Please include pako.js for DEFLATE decompression.');
        }
      } catch (error) {
        throw new Error(`Decompression failed: ${error.message}. Make sure pako.js is included.`);
      }
    } else {
      throw new Error(`Unsupported compression method: ${fileInfo.compressType}`);
    }
  }

  /**
   * Extract a file and create an object URL for it
   */
  async getFileAsObjectURL(filename: string, mimeType: string = ''): Promise<string> {
    const data = await this.extractFile(filename);
    
    // Determine MIME type if not provided
    if (!mimeType) {
      const extension = filename.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'txt':
          mimeType = 'text/plain';
          break;
        case 'html':
        case 'htm':
          mimeType = 'text/html';
          break;
        case 'json':
          mimeType = 'application/json';
          break;
        default:
          mimeType = 'application/octet-stream';
      }
    }
    
    const blob = new Blob([data], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  /**
   * Extract a text file and return its contents
   */
  async getTextFile(filename: string, encoding: string = 'utf-8'): Promise<string> {
    const data = await this.extractFile(filename);
    const decoder = new TextDecoder(encoding);
    return decoder.decode(new Uint8Array(data));
  }

  /**
   * Extract a file and download it
   */
  async downloadFile(filename: string): Promise<void> {
    const url = await this.getFileAsObjectURL(filename);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
