/**
 * HMAC (Hash-based Message Authentication Code) generation utilities
 */

export type HMACAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface HMACResult {
  hmac: string;
  algorithm: HMACAlgorithm;
  message: string;
  key: string;
  hex: string;
  base64: string;
}

/**
 * Generates HMAC using Web Crypto API
 * @param message - Message to authenticate
 * @param key - Secret key
 * @param algorithm - Hash algorithm (default: SHA-256)
 * @returns HMAC result
 */
export async function generateHMAC(
  message: string,
  key: string,
  algorithm: HMACAlgorithm = "SHA-256",
): Promise<HMACResult> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto API not available");
  }

  const encoder = new TextEncoder();
  const messageBuffer = encoder.encode(message);
  const keyBuffer = encoder.encode(key);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    {
      name: "HMAC",
      hash: algorithm,
    },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageBuffer);

  const hex = _arrayBufferToHex(signature);
  const base64 = _arrayBufferToBase64(signature);

  return {
    hmac: hex,
    algorithm,
    message,
    key,
    hex,
    base64,
  };
}

/**
 * Verifies HMAC signature by generating a new HMAC and comparing
 * @param message - Original message that was signed
 * @param key - Secret key used for signing
 * @param signature - HMAC signature to verify (hex or base64)
 * @param algorithm - Hash algorithm used (default: SHA-256)
 * @returns Promise that resolves to true if signature is valid, false otherwise
 */
export async function verifyHMAC(
  message: string,
  key: string,
  signature: string,
  algorithm: HMACAlgorithm = "SHA-256",
): Promise<boolean> {
  try {
    const generated = await generateHMAC(message, key, algorithm);

    const normalizedGenerated = generated.hex.toLowerCase();
    const normalizedSignature = signature
      .toLowerCase()
      .replace(/[^0-9a-f]/g, "");

    return normalizedGenerated === normalizedSignature;
  } catch {
    return false;
  }
}

/**
 * Converts ArrayBuffer to hexadecimal string
 * @param buffer - ArrayBuffer to convert
 * @returns Hexadecimal string representation
 */
function _arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Converts ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary);
}

/**
 * Generates HMAC signature for webhook payloads
 * @param payload - Webhook payload (string or object, will be JSON stringified if object)
 * @param secret - Webhook secret key
 * @param algorithm - Hash algorithm to use (default: SHA-256)
 * @returns Promise that resolves to HMAC signature as hex string
 */
export async function generateWebhookHMAC(
  payload: string | object,
  secret: string,
  algorithm: HMACAlgorithm = "SHA-256",
): Promise<string> {
  const payloadString =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  const result = await generateHMAC(payloadString, secret, algorithm);
  return result.hex;
}

/**
 * Gets list of available HMAC algorithms
 * @returns Array of supported HMAC algorithm names
 */
export function getHMACAlgorithms(): HMACAlgorithm[] {
  return ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
}
