/**
 * URL parser and builder utilities
 */

export interface ParsedURL {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password: string;
  host: string;
  origin: string;
  href: string;
  searchParams: Record<string, string>;
}

/**
 * Parses URL into components
 * @param url - URL string
 * @returns Parsed URL object
 */
export function parseURL(url: string): ParsedURL {
  try {
    const urlObj = new URL(url);
    const searchParams: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      searchParams[key] = value;
    });

    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      username: urlObj.username,
      password: urlObj.password,
      host: urlObj.host,
      origin: urlObj.origin,
      href: urlObj.href,
      searchParams,
    };
  } catch (error) {
    throw new Error(
      `Invalid URL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validates URL string
 * @param url - URL to validate
 * @returns True if valid URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds URL from components
 * @param components - URL components
 * @returns URL string
 */
export function buildURL(components: Partial<ParsedURL>): string {
  const url = new URL(components.href || "http://example.com");

  if (components.protocol) {
    url.protocol = components.protocol;
  }
  if (components.hostname) {
    url.hostname = components.hostname;
  }
  if (components.port) {
    url.port = components.port;
  }
  if (components.pathname !== undefined) {
    url.pathname = components.pathname;
  }
  if (components.search !== undefined) {
    url.search = components.search;
  }
  if (components.hash !== undefined) {
    url.hash = components.hash;
  }
  if (components.username) {
    url.username = components.username;
  }
  if (components.password) {
    url.password = components.password;
  }

  // Set search params
  if (components.searchParams) {
    url.search = ""; // Clear existing
    Object.entries(components.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.href;
}

/**
 * Adds query parameter to URL
 * @param url - Base URL
 * @param key - Parameter key
 * @param value - Parameter value
 * @returns URL with added parameter
 */
export function addQueryParam(url: string, key: string, value: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.href;
}

/**
 * Removes query parameter from URL
 * @param url - Base URL
 * @param key - Parameter key
 * @returns URL with removed parameter
 */
export function removeQueryParam(url: string, key: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.href;
}

/**
 * Gets query parameter value
 * @param url - URL string
 * @param key - Parameter key
 * @returns Parameter value or null
 */
export function getQueryParam(url: string, key: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(key);
  } catch {
    return null;
  }
}

/**
 * Gets all query parameters
 * @param url - URL string
 * @returns Object with all query parameters
 */
export function getAllQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

/**
 * Sets query parameters
 * @param url - Base URL
 * @param params - Object with query parameters
 * @returns URL with set parameters
 */
export function setQueryParams(
  url: string,
  params: Record<string, string>,
): string {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  return urlObj.href;
}

/**
 * Normalizes URL (removes default ports, trailing slashes, etc.)
 * @param url - URL to normalize
 * @returns Normalized URL
 */
export function normalizeURL(url: string): string {
  try {
    const urlObj = new URL(url);

    if (
      (urlObj.protocol === "http:" && urlObj.port === "80") ||
      (urlObj.protocol === "https:" && urlObj.port === "443")
    ) {
      urlObj.port = "";
    }

    if (urlObj.pathname !== "/" && urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }

    const sortedParams = new URLSearchParams();
    Array.from(urlObj.searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        sortedParams.set(key, value);
      });
    urlObj.search = sortedParams.toString();

    return urlObj.href;
  } catch {
    return url;
  }
}

/**
 * Resolves relative URL against base URL
 * @param relativeUrl - Relative URL
 * @param baseUrl - Base URL
 * @returns Resolved absolute URL
 */
export function resolveURL(relativeUrl: string, baseUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    throw new Error("Invalid URL");
  }
}

/**
 * Gets URL domain
 * @param url - URL string
 * @returns Domain name
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "";
  }
}

/**
 * Checks if URL is absolute
 * @param url - URL string
 * @returns True if absolute URL
 */
export function isAbsoluteURL(url: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

/**
 * Checks if URL uses HTTPS
 * @param url - URL string
 * @returns True if HTTPS
 */
export function isHTTPS(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "https:";
  } catch {
    return false;
  }
}
