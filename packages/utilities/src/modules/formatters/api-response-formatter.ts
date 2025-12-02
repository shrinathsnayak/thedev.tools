/**
 * API Response Formatter
 * Formats API responses in various styles
 */

import { escapeXml } from "../../utils/escape";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
  };
}

export interface ResponseFormatOptions {
  style?: "standard" | "minimal" | "verbose" | "custom";
  includeTimestamp?: boolean;
  includeMeta?: boolean;
}

/**
 * Formats a successful API response with customizable style options
 * @param data - The data to include in the response
 * @param options - Formatting options (style, include timestamp, include meta)
 * @returns Formatted API response object
 */
export function formatSuccessResponse<T>(
  data: T,
  options: ResponseFormatOptions = {},
): ApiResponse<T> {
  const {
    style = "standard",
    includeTimestamp = true,
    includeMeta = true,
  } = options;

  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (includeTimestamp) {
    response.meta = {
      ...response.meta,
      timestamp: new Date().toISOString(),
    };
  }

  if (style === "minimal") {
    return { success: true, data };
  }

  if (style === "verbose" && includeMeta) {
    (response.meta as Record<string, unknown>) = {
      ...response.meta,
      version: "1.0",
      status: "success",
    };
  }

  return response;
}

/**
 * Formats an error API response with customizable style options
 * @param error - Error message string or error object with code, message, and optional details
 * @param options - Formatting options (style, include timestamp)
 * @returns Formatted error API response object
 */
export function formatErrorResponse(
  error: string | { code: string; message: string; details?: unknown },
  options: ResponseFormatOptions = {},
): ApiResponse {
  const { style = "standard", includeTimestamp = true } = options;

  const errorObj =
    typeof error === "string" ? { code: "ERROR", message: error } : error;

  const response: ApiResponse = {
    success: false,
    error: errorObj,
  };

  if (includeTimestamp) {
    response.meta = {
      timestamp: new Date().toISOString(),
    };
  }

  if (options.style === "minimal") {
    return {
      success: false,
      error: errorObj,
    };
  }

  return response;
}

/**
 * Formats a paginated API response with pagination metadata
 * @param data - Array of data items for the current page
 * @param page - Current page number (1-based)
 * @param limit - Number of items per page
 * @param total - Total number of items across all pages
 * @param options - Formatting options
 * @returns Formatted paginated API response object with pagination metadata
 */
export function formatPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  options: ResponseFormatOptions = {},
): ApiResponse<T[]> {
  const response = formatSuccessResponse(data, {
    ...options,
    includeMeta: true,
  });

  (response.meta as Record<string, unknown>) = {
    ...response.meta,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };

  return response;
}

/**
 * Converts an API response object to different serialization formats
 * @param response - The API response object to convert
 * @param targetFormat - Target format (json, xml, or yaml)
 * @returns Serialized response string in the specified format
 */
export function convertResponseFormat<T>(
  response: ApiResponse<T>,
  targetFormat: "json" | "xml" | "yaml",
): string {
  switch (targetFormat) {
    case "xml":
      return _toXmlFormat(response);

    case "yaml":
      return _toYamlFormat(response);

    case "json":
    default:
      return JSON.stringify(response, null, 2);
  }
}

/**
 * Converts an API response object to XML format
 * @param response - The API response object to convert
 * @returns XML string representation of the response
 */
function _toXmlFormat<T>(response: ApiResponse<T>): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += "<response>\n";
  xml += `  <success>${response.success}</success>\n`;

  if (response.data) {
    xml += "  <data>\n";
    xml += _formatDataAsXml(response.data, "    ");
    xml += "  </data>\n";
  }

  if (response.error) {
    xml += "  <error>\n";
    xml += `    <code>${escapeXml(response.error.code)}</code>\n`;
    xml += `    <message>${escapeXml(response.error.message)}</message>\n`;
    if (response.error.details) {
      xml += `    <details>${escapeXml(JSON.stringify(response.error.details))}</details>\n`;
    }
    xml += "  </error>\n";
  }

  if (response.meta) {
    xml += "  <meta>\n";
    for (const [key, value] of Object.entries(response.meta)) {
      xml += `    <${key}>${escapeXml(String(value))}</${key}>\n`;
    }
    xml += "  </meta>\n";
  }

  xml += "</response>";
  return xml;
}

/**
 * Recursively formats data as XML with proper indentation
 * @param data - The data to format (can be any type)
 * @param indent - Current indentation string
 * @returns XML string representation of the data
 */
function _formatDataAsXml(data: unknown, indent: string): string {
  if (data === null || data === undefined) {
    return "";
  }

  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return `${indent}${escapeXml(String(data))}\n`;
  }

  if (Array.isArray(data)) {
    let xml = "";
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      xml += `${indent}<item>\n`;
      xml += _formatDataAsXml(item, indent + "  ");
      xml += `${indent}</item>\n`;
    }
    return xml;
  }

  if (typeof data === "object") {
    let xml = "";
    for (const [key, value] of Object.entries(data)) {
      xml += `${indent}<${key}>\n`;
      xml += _formatDataAsXml(value, indent + "  ");
      xml += `${indent}</${key}>\n`;
    }
    return xml;
  }

  return "";
}


/**
 * Converts an API response object to YAML format
 * @param response - The API response object to convert
 * @returns YAML string representation of the response
 */
function _toYamlFormat<T>(response: ApiResponse<T>): string {
  const lines: string[] = [];

  lines.push(`success: ${response.success}`);

  if (response.data) {
    lines.push(`data:`);
    lines.push(_formatDataAsYaml(response.data, "  "));
  }

  if (response.error) {
    lines.push(`error:`);
    lines.push(`  code: ${response.error.code}`);
    lines.push(`  message: ${response.error.message}`);
    if (response.error.details) {
      lines.push(`  details: ${JSON.stringify(response.error.details)}`);
    }
  }

  if (response.meta) {
    lines.push(`meta:`);
    for (const [key, value] of Object.entries(response.meta)) {
      lines.push(`  ${key}: ${value}`);
    }
  }

  return lines.join("\n");
}

/**
 * Recursively formats data as YAML with proper indentation
 * @param data - The data to format (can be any type)
 * @param indent - Current indentation string
 * @returns YAML string representation of the data
 */
function _formatDataAsYaml(data: unknown, indent: string): string {
  if (data === null || data === undefined) {
    return "";
  }

  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return `${indent}${String(data)}`;
  }

  if (Array.isArray(data)) {
    const lines: string[] = [];
    for (const item of data) {
      if (typeof item === "object" && item !== null) {
        lines.push(`${indent}-`);
        lines.push(_formatDataAsYaml(item, indent + "  "));
      } else {
        lines.push(`${indent}- ${item}`);
      }
    }
    return lines.join("\n");
  }

  if (typeof data === "object") {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null) {
        lines.push(`${indent}${key}:`);
        lines.push(_formatDataAsYaml(value, indent + "  "));
      } else {
        lines.push(`${indent}${key}: ${value}`);
      }
    }
    return lines.join("\n");
  }

  return "";
}
