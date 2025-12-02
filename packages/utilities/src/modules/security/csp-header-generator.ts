/**
 * Content Security Policy (CSP) Header Generator
 * Generates CSP headers based on W3C CSP specification
 */

export interface CspDirective {
  "default-src"?: string[];
  "script-src"?: string[];
  "style-src"?: string[];
  "img-src"?: string[];
  "font-src"?: string[];
  "connect-src"?: string[];
  "media-src"?: string[];
  "object-src"?: string[];
  "child-src"?: string[];
  "frame-src"?: string[];
  "worker-src"?: string[];
  "manifest-src"?: string[];
  "form-action"?: string[];
  "base-uri"?: string[];
  "frame-ancestors"?: string[];
  "upgrade-insecure-requests"?: boolean;
  "block-all-mixed-content"?: boolean;
  "require-sri-for"?: string[];
  "report-uri"?: string;
  "report-to"?: string;
}

export interface CspOptions {
  strict?: boolean; // Use stricter CSP settings
  allowInline?: boolean; // Allow inline scripts/styles (not recommended for production)
  selfOnly?: boolean; // Only allow same-origin resources
  reportOnly?: boolean; // Generate report-only header
  reportUri?: string; // URI for CSP violation reports
}

/**
 * Generates Content Security Policy header value from directives object
 * @param directives - CSP directives object
 * @param options - CSP generation options (strict, allowInline, selfOnly, reportOnly, reportUri)
 * @returns CSP header value string
 */
export function generateCspHeader(
  directives: CspDirective,
  options: CspOptions = {},
): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(directives)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (
      key === "upgrade-insecure-requests" ||
      key === "block-all-mixed-content"
    ) {
      if (value === true) {
        parts.push(key);
      }
    } else if (key === "report-uri" || key === "report-to") {
      if (typeof value === "string" && value) {
        parts.push(`${key} ${value}`);
      }
    } else {
      const arrayValue = value as string[] | undefined;
      if (
        Array.isArray(arrayValue) &&
        arrayValue.length > 0 &&
        typeof arrayValue[0] === "string"
      ) {
        parts.push(`${key} ${arrayValue.join(" ")}`);
      }
    }
  }

  return parts.join("; ");
}

/**
 * Generates a strict CSP header with secure default settings
 * @param options - CSP generation options
 * @returns Strict CSP header value string
 */
export function generateStrictCsp(options: CspOptions = {}): string {
  const directives: CspDirective = {
    "default-src": options.selfOnly ? ["'self'"] : ["'self'"],
    "script-src": options.allowInline
      ? ["'self'", "'unsafe-inline'"]
      : ["'self'", "'unsafe-eval'"],
    "style-src": options.allowInline
      ? ["'self'", "'unsafe-inline'"]
      : ["'self'"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": true,
  };

  if (options.reportUri) {
    directives["report-uri"] = options.reportUri;
  }

  return generateCspHeader(directives, options);
}

/**
 * Generates CSP header optimized for common web applications
 * @param options - CSP generation options
 * @returns Web app CSP header value string
 */
export function generateWebAppCsp(options: CspOptions = {}): string {
  const directives: CspDirective = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-eval'",
      "https://cdn.jsdelivr.net",
      "https://unpkg.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https:", "blob:"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "connect-src": ["'self'", "https://api.github.com"],
    "media-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": true,
  };

  if (options.reportUri) {
    directives["report-uri"] = options.reportUri;
  }

  return generateCspHeader(directives, options);
}

/**
 * Parses CSP header string back into directives object
 * @param header - CSP header value string
 * @returns CSP directives object
 */
export function parseCspHeader(header: string): CspDirective {
  const directives: CspDirective = {};
  const parts = header
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (
      part === "upgrade-insecure-requests" ||
      part === "block-all-mixed-content"
    ) {
      directives[part] = true;
      continue;
    }

    const spaceIndex = part.indexOf(" ");
    if (spaceIndex === -1) {
      continue;
    }

    const key = part.substring(0, spaceIndex).trim();
    const value = part.substring(spaceIndex + 1).trim();

    if (key === "report-uri" || key === "report-to") {
      directives[key] = value;
    } else {
      const arrayValue = value.split(/\s+/).filter(Boolean);
      (directives as Record<string, unknown>)[key] = arrayValue;
    }
  }

  return directives;
}

/**
 * Validates CSP header syntax and directive names
 * @param header - CSP header value string to validate
 * @returns Validation result with errors array
 */
export function validateCspHeader(header: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!header.trim()) {
    errors.push("CSP header is empty");
    return { valid: false, errors };
  }

  const parts = header.split(";");
  const seenDirectives = new Set<string>();

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim();
    if (!part) continue;

    const spaceIndex = part.indexOf(" ");
    const directive =
      spaceIndex === -1 ? part : part.substring(0, spaceIndex).trim();

    if (seenDirectives.has(directive)) {
      errors.push(`Duplicate directive: ${directive}`);
    }
    seenDirectives.add(directive);

    const validDirectives = [
      "default-src",
      "script-src",
      "style-src",
      "img-src",
      "font-src",
      "connect-src",
      "media-src",
      "object-src",
      "child-src",
      "frame-src",
      "worker-src",
      "manifest-src",
      "form-action",
      "base-uri",
      "frame-ancestors",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
      "require-sri-for",
      "report-uri",
      "report-to",
    ];

    if (!validDirectives.includes(directive)) {
      errors.push(`Unknown directive: ${directive}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
