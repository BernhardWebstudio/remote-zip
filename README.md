# remote-zip

A lightweight TypeScript/JavaScript library for extracting individual files from remote `.zip` files over HTTP without downloading the entire archive.

Inspired by the [unzip-http](https://github.com/saulpw/unzip-http) Python package.

## Features

- ⚡ **Zero Full Downloads:** Fetches only the ZIP Central Directory and the specific file byte ranges needed.
- 🗜️ **Deflate & Stored Support:** Seamlessly decompresses Deflate (Method 8) and Stored (Method 0) files.
- 📦 **Rich Extraction Formats:** Retrieve files as `Uint8Array`, UTF-8 `string`, `Blob`, or browser `ObjectURL`.
- 🗂️ **Metadata Inspection:** Query directory entries, file sizes, compression ratios, and modification dates.
- 🔒 **Integrity Verification:** Built-in CRC32 and decompressed size validation (`strictCrc`).
- 🌐 **Modern HTTP Options:** Support for custom headers (authentication tokens), `AbortSignal`, custom `fetch`, and HTTP 200/206 partial content handling.
- ⚙️ **Universal Runtime:** Works in Browsers, Node.js, Deno, Bun, and Web Workers.

## Installation

```bash
npm install remote-zip
```

## Quick Start

```typescript
import { RemoteZip } from "remote-zip";

const zip = new RemoteZip("https://example.com/archive.zip", {
  headers: {
    Authorization: "Bearer your-token",
  },
});

// List all files inside the remote archive
const files = await zip.getFileList();
console.log(files); // ["hello.txt", "images/logo.png", ...]

// Extract content directly as text
const text = await zip.getFileAsText("hello.txt");
console.log(text);

// Extract raw bytes (Uint8Array)
const bytes = await zip.getFile("images/logo.png");

// Extract as a Blob
const blob = await zip.getFileAsBlob("images/logo.png");

// Extract as an Object URL (browser)
const objectUrl = await zip.getFileAsObjectURL("images/logo.png");
```

> **Note:** Extraction methods automatically ensure the archive index is loaded—you do not need to call `getFileList()` first.

## API Reference

### `new RemoteZip(url: string, options?: RemoteZipOptions)`

Creates a new `RemoteZip` instance.

#### `RemoteZipOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `headers` | `HeadersInit` | `undefined` | Custom HTTP headers sent with every request (e.g. `Authorization`). |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Custom `fetch` implementation. |
| `signal` | `AbortSignal` | `undefined` | `AbortSignal` for request cancellation or timeouts. |
| `strictCrc` | `boolean` | `true` | Throws an error if calculated CRC32 or decompressed size does not match archive metadata. |
| `debug` | `boolean` | `false` | Enables diagnostic logging to the console. |

### Methods

- **`getFileList(): Promise<string[]>`**  
  Returns an array of all file and directory paths in the archive.

- **`getEntries(): Promise<RemoteZipEntry[]>`**  
  Returns metadata objects for all entries in the archive.

- **`getEntry(filename: string): Promise<RemoteZipEntry | undefined>`**  
  Returns metadata for a specific file, or `undefined` if not found.

- **`hasFile(filename: string): Promise<boolean>`**  
  Returns `true` if the specified file exists in the archive.

- **`getFile(filename: string): Promise<Uint8Array>`**  
  Downloads and decompresses the file, returning raw bytes as a `Uint8Array`.

- **`getFileAsText(filename: string, encoding: string = "utf-8"): Promise<string>`**  
  Downloads, decompresses, and decodes the file as a string.

- **`getFileAsBlob(filename: string, mimeType?: string): Promise<Blob>`**  
  Downloads and decompresses the file as a `Blob`. If `mimeType` is omitted, it is inferred from the file extension.

- **`getFileAsObjectURL(filename: string, mimeType?: string): Promise<string>`**  
  Downloads and decompresses the file, returning a browser `blob:` Object URL. Remember to call `URL.revokeObjectURL(url)` when done.

#### `RemoteZipEntry`

```typescript
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
```

## License

MIT
