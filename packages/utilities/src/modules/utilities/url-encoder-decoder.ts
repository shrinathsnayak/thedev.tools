/**
 * URL encoding/decoding utilities
 */

/**
 * Encodes URL
 * @param url - URL string to encode
 * @param encodeAll - If true, encodes all special characters. If false, only encodes unsafe characters
 * @returns Encoded URL string
 */
export function encodeUrl(url: string, encodeAll: boolean = false): string {
  if (encodeAll) {
    return encodeURIComponent(url);
  }

  return encodeURI(url);
}

/**
 * Decodes URL
 * @param url - Encoded URL string to decode
 * @returns Decoded URL string
 */
export function decodeUrl(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch (error) {
    try {
      return decodeURI(url);
    } catch {
      throw new Error(
        `Failed to decode URL: ${error instanceof Error ? error.message : "Invalid encoding"}`,
      );
    }
  }
}

/**
 * Encodes URL component (more aggressive encoding)
 * @param component - URL component string to encode
 * @returns Encoded component string
 */
export function encodeUrlComponent(component: string): string {
  return encodeURIComponent(component);
}

/**
 * Decodes URL component
 * @param component - Encoded component string to decode
 * @returns Decoded component string
 */
export function decodeUrlComponent(component: string): string {
  try {
    return decodeURIComponent(component);
  } catch (error) {
    throw new Error(
      `Failed to decode URL component: ${error instanceof Error ? error.message : "Invalid encoding"}`,
    );
  }
}

/**
 * Parses URL and encodes individual components
 * @param url - URL string to parse and encode
 * @returns Object with encoded components
 */
export function parseAndEncodeUrl(url: string): {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  full: string;
} {
  try {
    const parsed = new URL(url);

    return {
      protocol: parsed.protocol,
      hostname: encodeUrlComponent(parsed.hostname),
      port: parsed.port,
      pathname: encodeURI(parsed.pathname),
      search: encodeURI(parsed.search),
      hash: encodeURI(parsed.hash),
      full: encodeUrl(url),
    };
  } catch (error) {
    throw new Error(
      `Failed to parse URL: ${error instanceof Error ? error.message : "Invalid URL format"}`,
    );
  }
}

/**
 * Validates URL format
 * @param url - URL string to validate
 * @returns True if valid URL
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
