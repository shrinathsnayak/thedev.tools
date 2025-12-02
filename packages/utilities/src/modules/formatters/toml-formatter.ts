/**
 * TOML formatting utilities
 * Uses '@iarna/toml' package for TOML parsing and formatting
 */

// @ts-ignore - types may not be perfect
import * as TOML from "@iarna/toml";

export interface TomlFormatOptions {
  indent?: number;
  newline?: string;
  sortKeys?: boolean;
}

/**
 * Validates TOML syntax and returns parsed data if valid
 * @param tomlString - The TOML string to validate
 * @returns Validation result with parsed data if valid, or error if invalid
 */
export function validateToml(tomlString: string): {
  isValid: boolean;
  error?: string;
  data?: unknown;
} {
  try {
    const data = TOML.parse(tomlString);
    return {
      isValid: true,
      data,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Formats TOML string with consistent structure
 * @param tomlString - The TOML string to format
 * @param options - Formatting options (currently limited by library)
 * @returns Formatted TOML string
 * @throws Error if TOML is invalid or formatting fails
 */
export function formatToml(
  tomlString: string,
  options: TomlFormatOptions = {},
): string {
  const validation = validateToml(tomlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid TOML");
  }

  try {
    const data = validation.data;
    return TOML.stringify(data as any);
  } catch (error) {
    throw new Error(
      `Failed to format TOML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts TOML string to JSON format
 * @param tomlString - The TOML string to convert
 * @param indent - JSON indentation level (default: 2)
 * @returns JSON string representation of the TOML data
 * @throws Error if TOML is invalid
 */
export function tomlToJson(tomlString: string, indent: number = 2): string {
  const validation = validateToml(tomlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid TOML");
  }

  return JSON.stringify(validation.data, null, indent);
}

/**
 * Converts JSON string to TOML format
 * @param jsonString - The JSON string to convert
 * @returns TOML string representation of the JSON data
 * @throws Error if JSON is invalid or conversion fails
 */
export function jsonToToml(jsonString: string): string {
  try {
    const data = JSON.parse(jsonString);
    return TOML.stringify(data);
  } catch (error) {
    throw new Error(
      `Failed to convert JSON to TOML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Minifies TOML by removing comments and extra whitespace
 * @param tomlString - The TOML string to minify
 * @returns Minified TOML string
 * @throws Error if TOML is invalid
 */
export function minifyToml(tomlString: string): string {
  const validation = validateToml(tomlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid TOML");
  }

  const json = JSON.stringify(validation.data);
  return TOML.stringify(JSON.parse(json));
}

/**
 * Analyzes TOML structure and returns sections, keys, and depth information
 * @param tomlString - The TOML string to analyze
 * @returns Object containing section names, all keys, and structure depth
 * @throws Error if TOML is invalid
 */
export function getTomlStructure(tomlString: string): {
  sections: string[];
  keys: string[];
  depth: number;
} {
  const validation = validateToml(tomlString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid TOML");
  }

  const data = validation.data as Record<string, unknown>;
  const sections: string[] = [];
  const keys: string[] = [];

  function _traverse(
    obj: Record<string, unknown>,
    prefix = "",
    depth = 0,
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.push(fullKey);

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        sections.push(fullKey);
        _traverse(value as Record<string, unknown>, fullKey, depth + 1);
      }
    }
  }

  _traverse(data);

  return {
    sections,
    keys,
    depth: sections.length,
  };
}
