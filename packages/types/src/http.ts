/**
 * HTTP-related type definitions
 */

export interface HttpStatus {
  code: number;
  name: string;
  description: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  useCase: string;
  related?: number[];
}

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface HttpHeader {
  name: string;
  value: string;
}

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  headers: HttpHeader[];
  body?: string;
}

export interface CommonHeader {
  name: string;
  description: string;
  example: string;
  category: "general" | "request" | "response" | "entity";
}

