/**
 * cURL Command Generator
 * Converts fetch/axios requests to cURL commands
 */

export interface HttpRequest {
  method?: string;
  url: string;
  headers?: Record<string, string>;
  body?: string | object;
  username?: string;
  password?: string;
}

/**
 * Generates cURL command from HTTP request details
 * @param request - HTTP request object with method, url, headers, body, and optional auth
 * @returns Complete cURL command string
 */
export function generateCurlCommand(request: HttpRequest): string {
  const method = (request.method || "GET").toUpperCase();
  const url = request.url;

  let curl = `curl -X ${method}`;

  curl += ` "${url}"`;

  if (request.username || request.password) {
    const user = request.username || "";
    const pass = request.password || "";
    curl += ` -u "${user}:${pass}"`;
  }

  if (request.headers) {
    for (const [key, value] of Object.entries(request.headers)) {
      const escapedValue = value.replace(/"/g, '\\"');
      curl += ` -H "${key}: ${escapedValue}"`;
    }
  }

  // Add body
  if (request.body && method !== "GET" && method !== "HEAD") {
    let bodyStr: string;
    if (typeof request.body === "string") {
      bodyStr = request.body;
    } else {
      bodyStr = JSON.stringify(request.body);
    }

    const escapedBody = bodyStr.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    curl += ` -d "${escapedBody}"`;
  }

  return curl;
}

/**
 * Generates cURL command with multi-line pretty formatting
 * @param request - HTTP request object with method, url, headers, body, and optional auth
 * @returns Multi-line formatted cURL command string
 */
export function generatePrettyCurlCommand(request: HttpRequest): string {
  const method = (request.method || "GET").toUpperCase();
  const url = request.url;

  let curl = `curl -X ${method} \\\n  "${url}"`;

  if (request.username || request.password) {
    const user = request.username || "";
    const pass = request.password || "";
    curl += ` \\\n  -u "${user}:${pass}"`;
  }

  if (request.headers) {
    for (const [key, value] of Object.entries(request.headers)) {
      const escapedValue = value.replace(/"/g, '\\"');
      curl += ` \\\n  -H "${key}: ${escapedValue}"`;
    }
  }

  // Add body
  if (request.body && method !== "GET" && method !== "HEAD") {
    let bodyStr: string;
    if (typeof request.body === "string") {
      bodyStr = request.body;
    } else {
      bodyStr = JSON.stringify(request.body, null, 2);
    }

    const escapedBody = bodyStr
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    curl += ` \\\n  -d "${escapedBody}"`;
  }

  return curl;
}

/**
 * Parses cURL command string back to HTTP request object
 * @param curl - cURL command string to parse
 * @returns HTTP request object with extracted method, url, headers, body, and auth
 */
export function parseCurlCommand(curl: string): HttpRequest {
  const request: HttpRequest = {
    method: "GET",
    url: "",
    headers: {},
  };

  const methodMatch = curl.match(/-X\s+(\w+)/i);
  if (methodMatch && methodMatch[1]) {
    request.method = methodMatch[1].toUpperCase();
  }

  const urlMatch = curl.match(/curl[^"]*"([^"]+)"/);
  if (urlMatch && urlMatch[1]) {
    request.url = urlMatch[1];
  }

  const headerMatches = curl.matchAll(/-H\s+"([^"]+):\s*([^"]+)"/g);
  for (const match of headerMatches) {
    if (match[1] && match[2]) {
      if (!request.headers) {
        request.headers = {};
      }
      request.headers[match[1]] = match[2];
    }
  }

  const authMatch = curl.match(/-u\s+"([^"]+):([^"]+)"/);
  if (authMatch && authMatch[1] && authMatch[2]) {
    request.username = authMatch[1];
    request.password = authMatch[2];
  }

  const bodyMatch = curl.match(/-d\s+"([^"]+)"/);
  if (bodyMatch && bodyMatch[1]) {
    request.body = bodyMatch[1]
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  return request;
}
