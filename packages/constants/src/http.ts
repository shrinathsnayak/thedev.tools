/**
 * HTTP-related constants
 */

import type { HttpStatus, CommonHeader } from "@workspace/types/http";

/**
 * Complete HTTP status codes reference
 */
export const HTTP_STATUS_CODES: Record<number, HttpStatus> = {
  // Informational (1xx)
  100: {
    code: 100,
    name: "Continue",
    description: "The server has received the request headers.",
    category: "1xx",
    useCase:
      "Used to inform the client that the initial part of the request has been received.",
  },
  101: {
    code: 101,
    name: "Switching Protocols",
    description: "The server is switching protocols as requested.",
    category: "1xx",
    useCase: "Used when upgrading to a different protocol (e.g., WebSocket).",
  },
  102: {
    code: 102,
    name: "Processing",
    description:
      "The server is processing the request but has not completed it.",
    category: "1xx",
    useCase: "Used for long-running requests to prevent timeout.",
  },

  // Success (2xx)
  200: {
    code: 200,
    name: "OK",
    description: "The request was successful.",
    category: "2xx",
    useCase: "Standard success response for GET, PUT, PATCH requests.",
  },
  201: {
    code: 201,
    name: "Created",
    description: "The request was successful and a new resource was created.",
    category: "2xx",
    useCase: "Used after successful POST request that creates a resource.",
  },
  202: {
    code: 202,
    name: "Accepted",
    description: "The request has been accepted for processing.",
    category: "2xx",
    useCase: "Used for asynchronous processing that will be completed later.",
  },
  204: {
    code: 204,
    name: "No Content",
    description:
      "The request was successful but there is no content to return.",
    category: "2xx",
    useCase:
      "Used for successful DELETE requests or updates that don't return data.",
  },
  206: {
    code: 206,
    name: "Partial Content",
    description: "The server is delivering only part of the resource.",
    category: "2xx",
    useCase: "Used for range requests (downloading part of a file).",
  },

  // Redirection (3xx)
  301: {
    code: 301,
    name: "Moved Permanently",
    description: "The resource has been moved permanently to a new location.",
    category: "3xx",
    useCase: "Used for permanent redirects. Search engines update their links.",
  },
  302: {
    code: 302,
    name: "Found",
    description: "The resource has been temporarily moved to a new location.",
    category: "3xx",
    useCase: "Used for temporary redirects. Common for URL shorteners.",
  },
  304: {
    code: 304,
    name: "Not Modified",
    description: "The resource has not been modified since the last request.",
    category: "3xx",
    useCase: "Used with ETags and Last-Modified headers for caching.",
  },
  307: {
    code: 307,
    name: "Temporary Redirect",
    description:
      "The resource has been temporarily moved. Method must not change.",
    category: "3xx",
    useCase: "Similar to 302 but preserves the HTTP method.",
  },
  308: {
    code: 308,
    name: "Permanent Redirect",
    description:
      "The resource has been permanently moved. Method must not change.",
    category: "3xx",
    useCase: "Similar to 301 but preserves the HTTP method.",
  },

  // Client Error (4xx)
  400: {
    code: 400,
    name: "Bad Request",
    description: "The request is malformed or invalid.",
    category: "4xx",
    useCase: "Used when the client sends invalid data or malformed request.",
  },
  401: {
    code: 401,
    name: "Unauthorized",
    description: "Authentication is required or has failed.",
    category: "4xx",
    useCase: "Used when authentication is required or credentials are invalid.",
  },
  403: {
    code: 403,
    name: "Forbidden",
    description: "The client does not have permission to access this resource.",
    category: "4xx",
    useCase: "Used when user is authenticated but lacks permission.",
  },
  404: {
    code: 404,
    name: "Not Found",
    description: "The requested resource could not be found.",
    category: "4xx",
    useCase: "Used when the requested resource doesn't exist.",
  },
  405: {
    code: 405,
    name: "Method Not Allowed",
    description: "The HTTP method is not allowed for this resource.",
    category: "4xx",
    useCase:
      "Used when method (GET, POST, etc.) is not supported for the endpoint.",
  },
  409: {
    code: 409,
    name: "Conflict",
    description:
      "The request conflicts with the current state of the resource.",
    category: "4xx",
    useCase: "Used for duplicate entries or version conflicts.",
  },
  422: {
    code: 422,
    name: "Unprocessable Entity",
    description: "The request is well-formed but contains semantic errors.",
    category: "4xx",
    useCase: "Used when validation fails (e.g., invalid email format).",
  },
  429: {
    code: 429,
    name: "Too Many Requests",
    description: "The client has sent too many requests in a given time.",
    category: "4xx",
    useCase: "Used for rate limiting.",
  },

  // Server Error (5xx)
  500: {
    code: 500,
    name: "Internal Server Error",
    description: "An unexpected error occurred on the server.",
    category: "5xx",
    useCase: "Generic server error for unexpected failures.",
  },
  501: {
    code: 501,
    name: "Not Implemented",
    description: "The server does not support the functionality required.",
    category: "5xx",
    useCase: "Used when the server doesn't support the requested feature.",
  },
  502: {
    code: 502,
    name: "Bad Gateway",
    description: "The server received an invalid response from upstream.",
    category: "5xx",
    useCase: "Used when acting as a gateway and receiving invalid response.",
  },
  503: {
    code: 503,
    name: "Service Unavailable",
    description: "The server is temporarily unavailable.",
    category: "5xx",
    useCase: "Used during maintenance or when server is overloaded.",
  },
  504: {
    code: 504,
    name: "Gateway Timeout",
    description: "The server did not receive a timely response from upstream.",
    category: "5xx",
    useCase: "Used when acting as a gateway and upstream times out.",
  },
};

/**
 * Common HTTP headers
 */
export const COMMON_HEADERS: CommonHeader[] = [
  {
    name: "Content-Type",
    description: "The media type of the resource",
    example: "application/json",
    category: "entity",
  },
  {
    name: "Authorization",
    description: "Authentication credentials",
    example: "Bearer token123",
    category: "request",
  },
  {
    name: "Accept",
    description: "Content types that are acceptable",
    example: "application/json",
    category: "request",
  },
  {
    name: "User-Agent",
    description: "The client application making the request",
    example: "Mozilla/5.0...",
    category: "request",
  },
  {
    name: "Cache-Control",
    description: "Directives for caching mechanisms",
    example: "no-cache",
    category: "general",
  },
  {
    name: "Cookie",
    description: "HTTP cookies previously sent by the server",
    example: "session=abc123",
    category: "request",
  },
  {
    name: "Set-Cookie",
    description: "Send cookies from server to client",
    example: "session=abc123; Path=/; HttpOnly",
    category: "response",
  },
  {
    name: "X-API-Key",
    description: "API key for authentication",
    example: "your-api-key",
    category: "request",
  },
  {
    name: "X-Requested-With",
    description: "Identifies AJAX requests",
    example: "XMLHttpRequest",
    category: "request",
  },
  {
    name: "Content-Length",
    description: "The size of the request/response body",
    example: "1024",
    category: "entity",
  },
];

