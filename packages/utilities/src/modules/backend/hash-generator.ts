/**
 * Hash generation utilities using Web Crypto API
 */

export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

/**
 * Converts an ArrayBuffer to a hexadecimal string representation
 * @param buffer - The ArrayBuffer to convert
 * @returns Hexadecimal string
 */
function _arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a cryptographic hash using the Web Crypto API
 * @param text - The text string to hash
 * @param algorithm - Hash algorithm to use (SHA-1, SHA-256, SHA-384, or SHA-512)
 * @returns Promise that resolves to hexadecimal hash string
 * @throws Error if hashing fails
 */
export async function generateHash(
  text: string,
  algorithm: Exclude<HashAlgorithm, "MD5"> = "SHA-256",
): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return _arrayBufferToHex(hashBuffer);
  } catch (error) {
    throw new Error(
      `Failed to generate hash: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Generates MD5 hash (not supported by Web Crypto API)
 * Note: This function throws an error as MD5 requires an external library
 * @param text - The text string to hash
 * @returns Promise that resolves to hexadecimal hash string
 * @throws Error indicating MD5 requires an external library
 */
export async function generateMd5(text: string): Promise<string> {
  throw new Error(
    "MD5 is not supported by Web Crypto API. Use a library like 'crypto-js' or implement a polyfill.",
  );
}

/**
 * Generates hashes using all supported algorithms (SHA-1, SHA-256, SHA-384, SHA-512)
 * @param text - The text string to hash
 * @returns Promise that resolves to object containing all hash values
 */
export async function generateAllHashes(text: string): Promise<{
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}> {
  const [sha1, sha256, sha384, sha512] = await Promise.all([
    generateHash(text, "SHA-1"),
    generateHash(text, "SHA-256"),
    generateHash(text, "SHA-384"),
    generateHash(text, "SHA-512"),
  ]);

  return {
    sha1,
    sha256,
    sha384,
    sha512,
  };
}

/**
 * Validates whether a hash string matches the expected format for the given algorithm
 * @param hash - The hash string to validate
 * @param algorithm - The hash algorithm to validate against
 * @returns True if the hash format is valid for the algorithm
 */
export function validateHash(hash: string, algorithm: HashAlgorithm): boolean {
  const lengths: Record<HashAlgorithm, number> = {
    "SHA-1": 40,
    "SHA-256": 64,
    "SHA-384": 96,
    "SHA-512": 128,
    MD5: 32,
  };

  const expectedLength = lengths[algorithm];
  const hexRegex = /^[0-9a-f]+$/i;

  return hash.length === expectedLength && hexRegex.test(hash);
}
