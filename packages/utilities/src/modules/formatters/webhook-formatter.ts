/**
 * Webhook Payload Formatter
 * Formats and validates webhook payloads
 */

export interface WebhookPayload {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string>;
}

/**
 * Formats a webhook payload as a cURL command string
 * @param payload - The webhook payload object to format
 * @returns cURL command string
 */
export function formatWebhookAsCurl(payload: WebhookPayload): string {
  let curl = `curl -X ${payload.method}`;

  if (payload.headers) {
    for (const [key, value] of Object.entries(payload.headers)) {
      curl += ` \\\n  -H "${key}: ${value}"`;
    }
  }

  let url = payload.url;
  if (payload.queryParams && Object.keys(payload.queryParams).length > 0) {
    const params = new URLSearchParams(payload.queryParams);
    url += `?${params.toString()}`;
  }

  curl += ` \\\n  "${url}"`;

  if (
    payload.body &&
    (payload.method === "POST" ||
      payload.method === "PUT" ||
      payload.method === "PATCH")
  ) {
    const bodyStr =
      typeof payload.body === "string"
        ? payload.body
        : JSON.stringify(payload.body, null, 2);
    curl += ` \\\n  -d '${bodyStr.replace(/'/g, "'\\''")}'`;
  }

  return curl;
}

/**
 * Formats a webhook payload as JavaScript/TypeScript fetch API code
 * @param payload - The webhook payload object to format
 * @param language - Target language (javascript or typescript)
 * @returns Generated fetch API code string
 */
export function formatWebhookAsFetch(
  payload: WebhookPayload,
  language: "javascript" | "typescript" = "javascript",
): string {
  let code = "";

  let url = payload.url;
  if (payload.queryParams && Object.keys(payload.queryParams).length > 0) {
    const params = new URLSearchParams(payload.queryParams);
    url += `?${params.toString()}`;
  }

  const headers: Record<string, string> = {
    ...payload.headers,
  };

  const hasBody =
    payload.body &&
    (payload.method === "POST" ||
      payload.method === "PUT" ||
      payload.method === "PATCH");

  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  code += `const response = await fetch("${url}", {\n`;
  code += `  method: "${payload.method}",\n`;

  if (Object.keys(headers).length > 0) {
    code += `  headers: {\n`;
    for (const [key, value] of Object.entries(headers)) {
      code += `    "${key}": "${value}",\n`;
    }
    code += `  },\n`;
  }

  if (hasBody) {
    const bodyStr =
      typeof payload.body === "string"
        ? payload.body
        : JSON.stringify(payload.body, null, 2);
    code += `  body: JSON.stringify(${bodyStr}),\n`;
  }

  code += `});\n\n`;
  code += `const data = await response.json();`;

  return code;
}

/**
 * Formats a webhook payload as JavaScript/TypeScript axios code
 * @param payload - The webhook payload object to format
 * @param language - Target language (javascript or typescript)
 * @returns Generated axios code string
 */
export function formatWebhookAsAxios(
  payload: WebhookPayload,
  language: "javascript" | "typescript" = "javascript",
): string {
  let code = "";

  let url = payload.url;
  const params = payload.queryParams || {};

  const headers = { ...payload.headers };

  const hasBody =
    payload.body &&
    (payload.method === "POST" ||
      payload.method === "PUT" ||
      payload.method === "PATCH");

  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  code += `const response = await axios.${payload.method.toLowerCase()}(`;
  code += `"${url}",\n`;

  if (hasBody) {
    const bodyStr =
      typeof payload.body === "string"
        ? payload.body
        : JSON.stringify(payload.body, null, 2);
    code += `  ${bodyStr},\n`;
  }

  if (Object.keys(params).length > 0 || Object.keys(headers).length > 0) {
    code += `  {\n`;
    if (Object.keys(params).length > 0) {
      code += `    params: {\n`;
      for (const [key, value] of Object.entries(params)) {
        code += `      ${key}: "${value}",\n`;
      }
      code += `    },\n`;
    }
    if (Object.keys(headers).length > 0) {
      code += `    headers: {\n`;
      for (const [key, value] of Object.entries(headers)) {
        code += `      ${key}: "${value}",\n`;
      }
      code += `    },\n`;
    }
    code += `  }\n`;
  }

  code += `);\n\n`;
  code += `console.log(response.data);`;

  return code;
}

/**
 * Validates a webhook payload and checks for common issues
 * @param payload - The webhook payload object to validate
 * @returns Validation result with errors if invalid
 */
export function validateWebhookPayload(payload: Partial<WebhookPayload>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payload.method) {
    errors.push("Method is required");
  } else if (
    !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(payload.method)
  ) {
    errors.push(`Invalid method: ${payload.method}`);
  }

  if (!payload.url) {
    errors.push("URL is required");
  } else {
    try {
      new URL(payload.url);
    } catch {
      errors.push("Invalid URL format");
    }
  }

  if (
    payload.body &&
    (payload.method === "GET" || payload.method === "DELETE")
  ) {
    errors.push("GET and DELETE requests should not have a body");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parses a webhook payload from various input formats (JSON, cURL command)
 * @param input - The input string to parse (JSON or cURL command)
 * @returns Parsed webhook payload object or null if parsing fails
 */
export function parseWebhookPayload(input: string): WebhookPayload | null {
  try {
    const parsed = JSON.parse(input);
    if (parsed.method && parsed.url) {
      return parsed as WebhookPayload;
    }
  } catch {
  }

  const curlMatch = input.match(/curl\s+-X\s+(\w+)\s+(.+)/);
  if (curlMatch) {
    const method = curlMatch[1] as WebhookPayload["method"];
    const rest = curlMatch[2] || "";

    const urlMatch = rest.match(/"([^"]+)"/);
    if (urlMatch) {
      return {
        method,
        url: urlMatch[1] || "",
      };
    }
  }

  return null;
}
