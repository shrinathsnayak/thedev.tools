/**
 * HTTP Status Code Reference
 * Comprehensive reference for HTTP status codes
 */

import type { HttpStatus } from "@workspace/types/http";
import { HTTP_STATUS_CODES } from "@workspace/constants/http";

// Re-export for backward compatibility
export type { HttpStatus } from "@workspace/types/http";
export { HTTP_STATUS_CODES } from "@workspace/constants/http";

/**
 * Gets status code information
 */
export function getHttpStatus(code: number): HttpStatus | null {
  return HTTP_STATUS_CODES[code] || null;
}

/**
 * Gets all status codes by category
 */
export function getHttpStatusByCategory(
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx",
): HttpStatus[] {
  return Object.values(HTTP_STATUS_CODES).filter(
    (status) => status.category === category,
  );
}

/**
 * Searches status codes by name or description
 */
export function searchHttpStatus(query: string): HttpStatus[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(HTTP_STATUS_CODES).filter(
    (status) =>
      status.name.toLowerCase().includes(lowerQuery) ||
      status.description.toLowerCase().includes(lowerQuery) ||
      status.useCase.toLowerCase().includes(lowerQuery) ||
      String(status.code).includes(query),
  );
}

/**
 * Gets common status codes
 */
export function getCommonHttpStatus(): HttpStatus[] {
  const commonCodes = [
    200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 409, 422, 429, 500, 502,
    503,
  ];
  return commonCodes.map((code) => HTTP_STATUS_CODES[code]!).filter(Boolean);
}
