/**
 * Base64 encoding/decoding utilities
 */

/**
 * Encodes a string to Base64 format
 * @param text - The text string to encode
 * @returns Base64 encoded string
 * @throws Error if encoding fails or environment doesn't support Base64
 */
export function encodeBase64(text: string): string {
  try {
    if (typeof btoa !== "undefined") {
      return btoa(unescape(encodeURIComponent(text)));
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(text, "utf8").toString("base64");
    }

    throw new Error("Base64 encoding not supported in this environment");
  } catch (error) {
    throw new Error(
      `Failed to encode to Base64: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Decodes a Base64 string back to original text
 * @param base64 - The Base64 encoded string to decode
 * @returns Decoded text string
 * @throws Error if decoding fails or environment doesn't support Base64
 */
export function decodeBase64(base64: string): string {
  try {
    if (typeof atob !== "undefined") {
      return decodeURIComponent(escape(atob(base64)));
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf8");
    }

    throw new Error("Base64 decoding not supported in this environment");
  } catch (error) {
    throw new Error(
      `Failed to decode from Base64: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validates whether a string is in valid Base64 format
 * @param base64 - The string to validate
 * @returns True if the string is valid Base64 format
 */
export function validateBase64(base64: string): boolean {
  if (!base64 || typeof base64 !== "string") {
    return false;
  }

  const cleaned = base64.replace(/\s/g, "");
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

  if (!base64Regex.test(cleaned)) {
    return false;
  }

  const paddingCount = (cleaned.match(/=/g) || []).length;
  if (paddingCount > 2) {
    return false;
  }

  const contentLength = cleaned.length - paddingCount;
  if (contentLength % 4 !== 0 && paddingCount === 0) {
    return false;
  }

  return true;
}

/**
 * Encodes a file (ArrayBuffer or Blob) to Base64 string
 * @param file - The file to encode (ArrayBuffer or Blob)
 * @returns Promise that resolves to Base64 encoded string
 * @throws Error if encoding fails or environment doesn't support Base64
 */
export async function encodeFileToBase64(
  file: ArrayBuffer | Blob,
): Promise<string> {
  try {
    let arrayBuffer: ArrayBuffer;

    if (file instanceof Blob) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    const bytes = new Uint8Array(arrayBuffer);
    const binary = Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join("");

    if (typeof btoa !== "undefined") {
      return btoa(binary);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(bytes).toString("base64");
    }

    throw new Error("Base64 encoding not supported in this environment");
  } catch (error) {
    throw new Error(
      `Failed to encode file to Base64: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Calculates size information for a Base64 encoded string
 * @param base64 - The Base64 string to analyze
 * @returns Object containing encoded size, estimated original size, and overhead metrics
 */
export function getBase64SizeInfo(base64: string): {
  encodedSize: number;
  estimatedOriginalSize: number;
  overhead: number;
  overheadPercent: number;
} {
  const encodedSize = base64.length;
  const estimatedOriginalSize = Math.floor((encodedSize * 3) / 4);
  const overhead = encodedSize - estimatedOriginalSize;
  const overheadPercent = ((overhead / estimatedOriginalSize) * 100).toFixed(2);

  return {
    encodedSize,
    estimatedOriginalSize,
    overhead,
    overheadPercent: parseFloat(overheadPercent),
  };
}
