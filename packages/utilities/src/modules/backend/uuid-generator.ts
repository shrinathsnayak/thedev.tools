/**
 * UUID generation utilities
 */

export type UuidVersion = 1 | 4;

/**
 * Generates a UUID v4 (random) using Web Crypto API or fallback implementation
 * @returns UUID v4 string in format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a UUID v1 (time-based) using timestamp and random components
 * Note: This is a simplified implementation. Full RFC 4122 v1 requires MAC address
 * @returns UUID v1 string in format: xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUuidV1(): string {
  const now = Date.now();
  const timestamp = Math.floor(now / 1000);

  const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, "0");
  const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, "0");
  const timeHi = ((timestamp >> 48) & 0x0fff).toString(16).padStart(4, "0");
  const clockSeq = Math.floor(Math.random() * 0x3fff)
    .toString(16)
    .padStart(4, "0");
  const node = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

  return `${timeLow}-${timeMid}-1${timeHi}-${(parseInt(clockSeq, 16) | 0x8000).toString(16)}-${node}`;
}

/**
 * Generates a UUID based on the specified version
 * @param version - UUID version (1 for time-based, 4 for random)
 * @returns UUID string matching the specified version
 */
export function generateUuid(version: UuidVersion = 4): string {
  return version === 1 ? generateUuidV1() : generateUuidV4();
}

/**
 * Generates multiple UUIDs in a single call
 * @param count - Number of UUIDs to generate
 * @param version - UUID version to use (default: 4)
 * @returns Array of UUID strings
 */
export function generateMultipleUuids(
  count: number,
  version: UuidVersion = 4,
): string[] {
  return Array.from({ length: count }, () => generateUuid(version));
}

/**
 * Validates whether a string matches the UUID format (RFC 4122)
 * @param uuid - The string to validate
 * @returns True if the string is a valid UUID format
 */
export function validateUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Extracts the version number from a UUID string
 * @param uuid - The UUID string to analyze
 * @returns Version number (1-5) or null if invalid
 */
export function getUuidVersion(uuid: string): number | null {
  if (!validateUuid(uuid)) {
    return null;
  }

  const parts = uuid.split("-");
  const versionChar = parts[2]?.[0];
  const version = parseInt(versionChar || "0", 16);

  return version >= 1 && version <= 5 ? version : null;
}
