/**
 * Cookie parser and builder utilities
 */

export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface ParsedCookie extends Cookie {
  raw: string;
}

/**
 * Parses Set-Cookie header string into cookie object
 * @param cookieString - Set-Cookie header string
 * @returns Parsed cookie object with all attributes
 * @throws Error if cookie string is invalid
 */
export function parseCookie(cookieString: string): ParsedCookie {
  const parts = cookieString.split(";").map((p) => p.trim());
  const [nameValue, ...attributes] = parts;

  if (!nameValue) {
    throw new Error("Invalid cookie string: missing name-value pair");
  }

  const [name, value] = nameValue.split("=").map((s) => s.trim());
  const cookie: Cookie = { name: name || "", value: value || "" };

  attributes.forEach((attr) => {
    const lowerAttr = attr.toLowerCase();

    if (lowerAttr.startsWith("domain=")) {
      cookie.domain = attr.substring(7);
    } else if (lowerAttr.startsWith("path=")) {
      cookie.path = attr.substring(5);
    } else if (lowerAttr.startsWith("expires=")) {
      const dateStr = attr.substring(8);
      cookie.expires = new Date(dateStr);
    } else if (lowerAttr.startsWith("max-age=")) {
      cookie.maxAge = parseInt(attr.substring(8), 10);
    } else if (lowerAttr === "secure") {
      cookie.secure = true;
    } else if (lowerAttr === "httponly") {
      cookie.httpOnly = true;
    } else if (lowerAttr.startsWith("samesite=")) {
      const sameSite = attr.substring(9) as "Strict" | "Lax" | "None";
      cookie.sameSite = sameSite;
    }
  });

  return {
    ...cookie,
    raw: cookieString,
  };
}

/**
 * Parses multiple Set-Cookie header strings
 * @param cookieStrings - Array of Set-Cookie header strings
 * @returns Array of parsed cookie objects
 */
export function parseCookies(cookieStrings: string[]): ParsedCookie[] {
  return cookieStrings.map(parseCookie);
}

/**
 * Builds Set-Cookie header string from cookie object
 * @param cookie - Cookie object with name, value, and optional attributes
 * @returns Set-Cookie header string
 */
export function buildCookie(cookie: Cookie): string {
  const parts: string[] = [`${cookie.name}=${cookie.value}`];

  if (cookie.domain) {
    parts.push(`Domain=${cookie.domain}`);
  }
  if (cookie.path) {
    parts.push(`Path=${cookie.path}`);
  }
  if (cookie.expires) {
    parts.push(`Expires=${cookie.expires.toUTCString()}`);
  }
  if (cookie.maxAge !== undefined) {
    parts.push(`Max-Age=${cookie.maxAge}`);
  }
  if (cookie.secure) {
    parts.push("Secure");
  }
  if (cookie.httpOnly) {
    parts.push("HttpOnly");
  }
  if (cookie.sameSite) {
    parts.push(`SameSite=${cookie.sameSite}`);
  }

  return parts.join("; ");
}

/**
 * Validates cookie name according to RFC 6265
 * @param name - Cookie name to validate
 * @returns True if name follows RFC 6265 token format
 */
export function validateCookieName(name: string): boolean {
  return /^[a-zA-Z0-9!#$%&'*+.^_`|~-]+$/.test(name);
}

/**
 * Validates cookie value according to RFC 6265
 * @param value - Cookie value to validate
 * @returns True if value is valid token or quoted-string format
 */
export function validateCookieValue(value: string): boolean {
  if (value.startsWith('"') && value.endsWith('"')) {
    return true;
  }
  return /^[a-zA-Z0-9!#$%&'()*+./:<=>?@[\]^_`{|}~-]*$/.test(value);
}

/**
 * Validates cookie object for name, value, and attribute correctness
 * @param cookie - Cookie object to validate
 * @returns Validation result with errors array
 */
export function validateCookie(cookie: Cookie): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateCookieName(cookie.name)) {
    errors.push("Invalid cookie name");
  }
  if (!validateCookieValue(cookie.value)) {
    errors.push("Invalid cookie value");
  }
  if (cookie.maxAge !== undefined && cookie.maxAge < 0) {
    errors.push("Max-Age must be non-negative");
  }
  if (cookie.sameSite === "None" && !cookie.secure) {
    errors.push("SameSite=None requires Secure flag");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates session cookie that expires when browser closes
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Additional cookie options (domain, path, secure, etc.)
 * @returns Cookie object without expires or maxAge
 */
export function createSessionCookie(
  name: string,
  value: string,
  options: Partial<Cookie> = {},
): Cookie {
  return {
    name,
    value,
    ...options,
  };
}

/**
 * Creates persistent cookie with expiration date
 * @param name - Cookie name
 * @param value - Cookie value
 * @param daysToExpire - Number of days until cookie expires
 * @param options - Additional cookie options (domain, path, secure, etc.)
 * @returns Cookie object with expires date set
 */
export function createPersistentCookie(
  name: string,
  value: string,
  daysToExpire: number,
  options: Partial<Cookie> = {},
): Cookie {
  const expires = new Date();
  expires.setTime(expires.getTime() + daysToExpire * 24 * 60 * 60 * 1000);

  return {
    name,
    value,
    expires,
    ...options,
  };
}

/**
 * Parses Cookie header string (request cookies) into name-value pairs
 * @param cookieHeader - Cookie header string from request
 * @returns Object mapping cookie names to values
 */
export function parseCookieHeader(
  cookieHeader: string,
): Record<string, string> {
  const cookies: Record<string, string> = {};

  cookieHeader.split(";").forEach((pair) => {
    const [name, value] = pair.split("=").map((s) => s.trim());
    if (name) {
      cookies[name] = value || "";
    }
  });

  return cookies;
}

/**
 * Builds Cookie header string from cookie name-value pairs
 * @param cookies - Object mapping cookie names to values
 * @returns Cookie header string
 */
export function buildCookieHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}
