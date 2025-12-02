/**
 * HTTP header builder and validator utilities
 */

import type { HttpMethod, HttpHeader, HttpRequest, CommonHeader } from "@workspace/types/http";
import { COMMON_HEADERS } from "@workspace/constants/http";

// Re-export for backward compatibility
export type { HttpMethod, HttpHeader, HttpRequest, CommonHeader } from "@workspace/types/http";
export { COMMON_HEADERS } from "@workspace/constants/http";

/**
 * Builds HTTP headers string
 * @param headers - Array of header objects
 * @returns Formatted headers string
 */
export function buildHttpHeaders(headers: HttpHeader[]): string {
  return headers.map((h) => `${h.name}: ${h.value}`).join("\n");
}

/**
 * Parses HTTP headers string
 * @param headersString - Headers string (one per line)
 * @returns Array of header objects
 */
export function parseHttpHeaders(headersString: string): HttpHeader[] {
  const lines = headersString.split("\n").filter((line) => line.trim());
  const headers: HttpHeader[] = [];

  lines.forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;

    const name = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (name && value) {
      headers.push({ name, value });
    }
  });

  return headers;
}

/**
 * Validates HTTP header name
 * @param name - Header name
 * @returns True if valid
 */
export function validateHeaderName(name: string): boolean {
  // RFC 7230: header names are case-insensitive and must match token rule
  return /^[a-zA-Z0-9!#$%&'*+.^_`|~-]+$/.test(name);
}

/**
 * Validates HTTP header value
 * @param value - Header value
 * @returns True if valid
 */
export function validateHeaderValue(value: string): boolean {
  // RFC 7230: header values must not contain control characters except HTAB
  return !/[\x00-\x08\x0A-\x1F\x7F]/.test(value);
}

/**
 * Validates HTTP headers
 * @param headers - Array of headers
 * @returns Validation result
 */
export function validateHttpHeaders(headers: HttpHeader[]): {
  valid: boolean;
  errors: Array<{ header: string; error: string }>;
} {
  const errors: Array<{ header: string; error: string }> = [];

  headers.forEach((header) => {
    if (!validateHeaderName(header.name)) {
      errors.push({
        header: header.name,
        error: "Invalid header name",
      });
    }
    if (!validateHeaderValue(header.value)) {
      errors.push({
        header: header.name,
        error: "Invalid header value (contains control characters)",
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gets common headers by category
 * @param category - Header category
 * @returns Array of common headers
 */
export function getCommonHeadersByCategory(
  category: CommonHeader["category"],
): CommonHeader[] {
  return COMMON_HEADERS.filter((h) => h.category === category);
}

/**
 * Builds HTTP request string
 * @param request - HTTP request object
 * @returns Formatted request string
 */
export function buildHttpRequest(request: HttpRequest): string {
  const parts: string[] = [];

  // Request line
  parts.push(`${request.method} ${request.url} HTTP/1.1`);

  // Headers
  if (request.headers.length > 0) {
    parts.push(buildHttpHeaders(request.headers));
  }

  // Empty line before body
  parts.push("");

  // Body
  if (request.body) {
    parts.push(request.body);
  }

  return parts.join("\n");
}

/**
 * Generates cURL command from HTTP request
 * @param request - HTTP request object
 * @returns cURL command string
 */
export function generateCurlCommand(request: HttpRequest): string {
  const parts: string[] = ["curl"];

  // Method
  if (request.method !== "GET") {
    parts.push(`-X ${request.method}`);
  }

  // Headers
  request.headers.forEach((header) => {
    parts.push(`-H "${header.name}: ${header.value}"`);
  });

  // Body
  if (request.body) {
    parts.push(`-d '${request.body}'`);
  }

  // URL
  parts.push(`"${request.url}"`);

  return parts.join(" \\\n  ");
}

/**
 * Generates fetch code from HTTP request
 * @param request - HTTP request object
 * @returns Fetch code string
 */
export function generateFetchCode(request: HttpRequest): string {
  const headersObj: Record<string, string> = {};
  request.headers.forEach((h) => {
    headersObj[h.name] = h.value;
  });

  const headersCode = JSON.stringify(headersObj, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : "    " + line))
    .join("\n");

  const bodyCode = request.body
    ? `,\n    body: ${JSON.stringify(request.body)}`
    : "";

  return `fetch('${request.url}', {
    method: '${request.method}',
    headers: ${headersCode}${bodyCode}
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));`;
}
