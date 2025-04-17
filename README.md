# remote-zip

A TypeScript/JavaScript library for extracting individual files from .zip files over HTTP without downloading the entire archive.

The implementation is heavily inspired by the [unzip-http](https://github.com/saulpw/unzip-http) Python package.

## Installation

```bash
npm i -D remote-zip
```

## Usage

Example:

```javascript
const remoteZip = new RemoteZip(zipUrl);
const availableFiles = await remoteZip.getFileList();
const objectURL = await remoteZip.getFileAsObjectURL(availableFiles[0]);
```

And with that, you would have downloaded the first file from the ZIP.

## Example

A live example might be published on GitHub pages in a while.
