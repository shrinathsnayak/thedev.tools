/**
 * File conversion utilities
 * Common functions for converting between different file types
 */

/**
 * Converts input to ArrayBuffer
 * @param input - File, Blob, ArrayBuffer, or Uint8Array
 * @returns Promise resolving to ArrayBuffer
 */
export async function toArrayBuffer(
  input: File | Blob | ArrayBuffer | Uint8Array,
): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) {
    return input;
  }

  if (input instanceof File || input instanceof Blob) {
    return await input.arrayBuffer();
  }

  const uint8Array = new Uint8Array(input);
  return uint8Array.buffer.slice(
    uint8Array.byteOffset,
    uint8Array.byteOffset + uint8Array.byteLength,
  );
}

/**
 * Converts input to Uint8Array
 * @param input - File, Blob, ArrayBuffer, or Uint8Array
 * @returns Promise resolving to Uint8Array
 */
export async function toUint8Array(
  input: File | Blob | ArrayBuffer | Uint8Array,
): Promise<Uint8Array> {
  if (input instanceof Uint8Array) {
    return input;
  }

  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }

  const arrayBuffer = await input.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Converts file data to Uint8Array
 * @param data - ArrayBuffer, Uint8Array, or string
 * @returns Promise resolving to Uint8Array
 */
export async function convertFileDataToUint8Array(
  data: ArrayBuffer | Uint8Array | string,
): Promise<Uint8Array> {
  if (data instanceof Uint8Array) {
    return data;
  }

  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }

  return new Uint8Array(data);
}

/**
 * Converts input file to Blob
 * @param inputFile - File, Blob, ArrayBuffer, or Uint8Array
 * @returns Blob instance
 */
export function toBlob(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
): Blob {
  if (inputFile instanceof Blob || inputFile instanceof File) {
    return inputFile;
  }

  if (inputFile instanceof ArrayBuffer) {
    return new Blob([new Uint8Array(inputFile)]);
  }

  const arrayBuffer = new Uint8Array(inputFile).buffer;
  return new Blob([arrayBuffer]);
}

/**
 * Gets file extension from file object
 * @param file - File, Blob, ArrayBuffer, or Uint8Array
 * @returns File extension string or null
 */
export function getFileExtension(
  file: File | Blob | ArrayBuffer | Uint8Array,
): string | null {
  if (file instanceof File) {
    const parts = file.name.split(".");
    return parts.length > 1 ? (parts[parts.length - 1] ?? null) : null;
  }

  if (file instanceof Blob && file.type) {
    const mimeParts = file.type.split("/");
    if (mimeParts.length === 2) {
      const extension = mimeParts[1]?.split(";")[0];
      return extension ?? null;
    }
  }

  return null;
}

