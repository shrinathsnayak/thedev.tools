/**
 * User Agent Parser
 * Uses 'ua-parser-js' package to parse user agent strings
 */

import { UAParser } from "ua-parser-js";

export interface ParsedUserAgent {
  browser: {
    name?: string;
    version?: string;
    major?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  device: {
    vendor?: string;
    model?: string;
    type?: string;
  };
  cpu: {
    architecture?: string;
  };
}

/**
 * Parses a user agent string and returns structured data about browser, OS, device, etc.
 * @param userAgent - Optional user agent string (uses navigator.userAgent if not provided)
 * @returns Parsed user agent object with browser, engine, OS, device, and CPU information
 */
export function parseUserAgent(userAgent?: string): ParsedUserAgent {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: {
      name: result.browser.name,
      version: result.browser.version,
      major: result.browser.major,
    },
    engine: {
      name: result.engine.name,
      version: result.engine.version,
    },
    os: {
      name: result.os.name,
      version: result.os.version,
    },
    device: {
      vendor: result.device.vendor,
      model: result.device.model,
      type: result.device.type,
    },
    cpu: {
      architecture: result.cpu.architecture,
    },
  };
}

/**
 * Detects the current browser from navigator.userAgent (client-side only)
 * @returns Parsed user agent object, or empty object if navigator is not available
 */
export function detectCurrentBrowser(): ParsedUserAgent {
  if (typeof navigator === "undefined" || !navigator.userAgent) {
    return {
      browser: {},
      engine: {},
      os: {},
      device: {},
      cpu: {},
    };
  }

  return parseUserAgent(navigator.userAgent);
}

/**
 * Checks if a user agent string represents a mobile device
 * @param userAgent - Optional user agent string to check
 * @returns True if the user agent is a mobile device or tablet
 */
export function isMobileDevice(userAgent?: string): boolean {
  const parsed = parseUserAgent(userAgent);
  return parsed.device.type === "mobile" || parsed.device.type === "tablet";
}

/**
 * Checks if a user agent string represents a bot or crawler
 * @param userAgent - Optional user agent string to check
 * @returns True if the user agent matches common bot patterns
 */
export function isBot(userAgent?: string): boolean {
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /scrape/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /node/i,
    /go-http/i,
    /okhttp/i,
  ];

  return botPatterns.some((pattern) => pattern.test(ua));
}

/**
 * Gets the simplified browser name from a user agent string
 * @param userAgent - Optional user agent string to parse
 * @returns Browser name or "Unknown" if not detected
 */
export function getBrowserName(userAgent?: string): string {
  const parsed = parseUserAgent(userAgent);
  return parsed.browser.name || "Unknown";
}

/**
 * Gets the simplified OS name from a user agent string
 * @param userAgent - Optional user agent string to parse
 * @returns OS name or "Unknown" if not detected
 */
export function getOSName(userAgent?: string): string {
  const parsed = parseUserAgent(userAgent);
  return parsed.os.name || "Unknown";
}
