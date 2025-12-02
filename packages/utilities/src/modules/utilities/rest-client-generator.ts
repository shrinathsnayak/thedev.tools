/**
 * REST client code generator utilities
 */

export type ClientLibrary =
  | "fetch"
  | "axios"
  | "node-fetch"
  | "curl"
  | "httpie"
  | "python-requests"
  | "go-http";

export interface HttpRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  query?: Record<string, string>;
}

/**
 * Generates JavaScript fetch API code
 * @param request - HTTP request object
 * @returns Generated fetch code string
 */
function _generateFetch(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  let finalUrl = url;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    finalUrl = `${url}?${params.toString()}`;
  }

  const headersCode =
    Object.keys(headers).length > 0
      ? JSON.stringify(headers, null, 2)
          .split("\n")
          .map((line, i) => (i === 0 ? line : "    " + line))
          .join("\n")
      : "{}";

  const bodyCode = body ? `,\n    body: ${JSON.stringify(body)}` : "";

  return `fetch('${finalUrl}', {
    method: '${method}',
    headers: ${headersCode}${bodyCode}
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));`;
}

/**
 * Generates Axios code
 * @param request - HTTP request object
 * @returns Generated Axios code string
 */
function _generateAxios(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  const config: string[] = [];
  if (Object.keys(headers).length > 0) {
    config.push(
      `headers: ${JSON.stringify(headers, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : "    " + line))
        .join("\n")}`,
    );
  }
  if (query && Object.keys(query).length > 0) {
    config.push(
      `params: ${JSON.stringify(query, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : "    " + line))
        .join("\n")}`,
    );
  }
  if (body) {
    config.push(
      `data: ${JSON.stringify(body, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : "    " + line))
        .join("\n")}`,
    );
  }

  const configCode =
    config.length > 0
      ? `,\n    {\n        ${config.join(",\n        ")}\n    }`
      : "";

  return `axios.${method.toLowerCase()}('${url}'${configCode})
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });`;
}

/**
 * Generates node-fetch code
 * @param request - HTTP request object
 * @returns Generated node-fetch code string
 */
function _generateNodeFetch(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  let finalUrl = url;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    finalUrl = `${url}?${params.toString()}`;
  }

  const headersCode =
    Object.keys(headers).length > 0
      ? JSON.stringify(headers, null, 2)
          .split("\n")
          .map((line, i) => (i === 0 ? line : "        " + line))
          .join("\n")
      : "{}";

  const bodyCode = body ? `,\n        body: ${JSON.stringify(body)}` : "";

  return `const fetch = require('node-fetch');

fetch('${finalUrl}', {
    method: '${method}',
    headers: ${headersCode}${bodyCode}
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));`;
}

/**
 * Generates cURL command
 * @param request - HTTP request object
 * @returns Generated cURL command string
 */
function _generateCurl(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  let finalUrl = url;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    finalUrl = `${url}?${params.toString()}`;
  }

  const parts: string[] = ["curl"];

  if (method !== "GET") {
    parts.push(`-X ${method}`);
  }

  Object.entries(headers).forEach(([key, value]) => {
    parts.push(`-H "${key}: ${value}"`);
  });

  if (body) {
    parts.push(`-d '${JSON.stringify(body)}'`);
  }

  parts.push(`"${finalUrl}"`);

  return parts.join(" \\\n  ");
}

/**
 * Generates HTTPie command
 * @param request - HTTP request object
 * @returns Generated HTTPie command string
 */
function _generateHttpie(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  let finalUrl = url;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    finalUrl = `${url}?${params.toString()}`;
  }

  const parts: string[] = [`http ${method.toUpperCase()} ${finalUrl}`];

  Object.entries(headers).forEach(([key, value]) => {
    parts.push(`${key}:${value}`);
  });

  if (body) {
    parts.push(`<<< '${JSON.stringify(body)}'`);
  }

  return parts.join(" \\\n    ");
}

/**
 * Generates Python requests library code
 * @param request - HTTP request object
 * @returns Generated Python requests code string
 */
function _generatePythonRequests(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  const imports = "import requests\nimport json\n\n";

  const paramsCode =
    query && Object.keys(query).length > 0
      ? `params = ${JSON.stringify(query, null, 2)}\n\n`
      : "";

  const headersCode =
    Object.keys(headers).length > 0
      ? `headers = ${JSON.stringify(headers, null, 2)}\n\n`
      : "";

  const dataCode = body
    ? `data = json.dumps(${JSON.stringify(body, null, 2)})\n\n`
    : "";

  const methodCall = method.toLowerCase();
  const args: string[] = [`'${url}'`];
  if (query && Object.keys(query).length > 0) args.push("params=params");
  if (Object.keys(headers).length > 0) args.push("headers=headers");
  if (body) args.push("data=data");

  const responseCode = `response = requests.${methodCall}(${args.join(", ")})\nprint(response.json())`;

  return imports + paramsCode + headersCode + dataCode + responseCode;
}

/**
 * Generates Go HTTP client code
 * @param request - HTTP request object
 * @returns Generated Go HTTP code string
 */
function _generateGoHttp(request: HttpRequest): string {
  const { method, url, headers = {}, body, query } = request;

  let finalUrl = url;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    finalUrl = `${url}?${params.toString()}`;
  }

  const parts: string[] = [
    "package main",
    "",
    "import (",
    '    "bytes"',
    '    "encoding/json"',
    '    "fmt"',
    '    "net/http"',
    ")",
    "",
    "func main() {",
  ];

  if (body) {
    parts.push(`    jsonData := ${JSON.stringify(body)}`);
    parts.push("    jsonValue, _ := json.Marshal(jsonData)");
    parts.push(
      '    req, _ := http.NewRequest("' +
        method +
        '", "' +
        finalUrl +
        '", bytes.NewBuffer(jsonValue))',
    );
  } else {
    parts.push(
      `    req, _ := http.NewRequest("${method}", "${finalUrl}", nil)`,
    );
  }

  if (Object.keys(headers).length > 0) {
    Object.entries(headers).forEach(([key, value]) => {
      parts.push(`    req.Header.Set("${key}", "${value}")`);
    });
  }

  parts.push("    client := &http.Client{}");
  parts.push("    resp, err := client.Do(req)");
  parts.push("    if err != nil {");
  parts.push("        panic(err)");
  parts.push("    }");
  parts.push("    defer resp.Body.Close()");
  parts.push("    fmt.Println(resp)");
  parts.push("}");

  return parts.join("\n");
}

/**
 * Generates REST client code for various HTTP client libraries
 * @param request - HTTP request object with method, url, headers, body, query
 * @param library - Target client library (fetch, axios, node-fetch, curl, etc.)
 * @returns Generated code string for the specified library
 * @throws Error if library is unsupported
 */
export function generateRestClientCode(
  request: HttpRequest,
  library: ClientLibrary,
): string {
  switch (library) {
    case "fetch":
      return _generateFetch(request);
    case "axios":
      return _generateAxios(request);
    case "node-fetch":
      return _generateNodeFetch(request);
    case "curl":
      return _generateCurl(request);
    case "httpie":
      return _generateHttpie(request);
    case "python-requests":
      return _generatePythonRequests(request);
    case "go-http":
      return _generateGoHttp(request);
    default:
      throw new Error(`Unsupported library: ${library}`);
  }
}

/**
 * Gets list of available client libraries for code generation
 * @returns Array of supported client library names
 */
export function getAvailableLibraries(): ClientLibrary[] {
  return [
    "fetch",
    "axios",
    "node-fetch",
    "curl",
    "httpie",
    "python-requests",
    "go-http",
  ];
}
