/**
 * YAML formatting and validation utilities
 */

import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export interface YamlFormatOptions {
  indent?: number;
  lineWidth?: number;
  defaultStringType?: "PLAIN" | "QUOTE_DOUBLE" | "QUOTE_SINGLE";
  nullStr?: string;
}

const defaultOptions: YamlFormatOptions = {
  indent: 2,
  lineWidth: 80,
  defaultStringType: "PLAIN",
};

/**
 * Validates YAML string and returns parsed data if valid
 * @param yamlString - The YAML string to validate
 * @returns Validation result with parsed data if valid, or error if invalid
 */
export function validateYaml(yamlString: string): {
  isValid: boolean;
  error?: string;
  data?: unknown;
} {
  try {
    const data = parseYaml(yamlString);
    return { isValid: true, data };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid YAML",
    };
  }
}

/**
 * Formats YAML string with customizable indentation and options
 * @param yamlString - The YAML string to format
 * @param options - Formatting options (indent, line width, string type)
 * @returns Formatted YAML string
 * @throws Error if YAML is invalid or formatting fails
 */
export function formatYaml(
  yamlString: string,
  options: YamlFormatOptions = {},
): string {
  const config = { ...defaultOptions, ...options };
  const validation = validateYaml(yamlString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid YAML");
  }

  try {
    return stringifyYaml(validation.data, {
      indent: config.indent,
      lineWidth: config.lineWidth,
      defaultStringType: config.defaultStringType as
        | "PLAIN"
        | "QUOTE_DOUBLE"
        | "QUOTE_SINGLE",
      nullStr: config.nullStr,
    });
  } catch (error) {
    throw new Error(
      `Failed to format YAML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Minifies YAML by converting to compact format with minimal spacing
 * @param yamlString - The YAML string to minify
 * @returns Minified YAML string
 * @throws Error if YAML is invalid
 */
export function minifyYaml(yamlString: string): string {
  const validation = validateYaml(yamlString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid YAML");
  }

  return stringifyYaml(validation.data, {
    indent: 0,
    lineWidth: 0,
  });
}

/**
 * Converts YAML string to JSON format
 * @param yamlString - The YAML string to convert
 * @param options - Conversion options (indent level)
 * @returns JSON string representation of the YAML
 * @throws Error if YAML is invalid
 */
export function yamlToJsonString(
  yamlString: string,
  options: { indent?: number } = {},
): string {
  const validation = validateYaml(yamlString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid YAML");
  }

  return JSON.stringify(validation.data, null, options.indent || 2);
}

/**
 * Analyzes YAML structure and returns type and hierarchy information
 * @param yamlString - The YAML string to analyze
 * @returns Object containing type, structure, and depth information
 * @throws Error if YAML is invalid
 */
export function getYamlStructure(yamlString: string): {
  type: string;
  isArray: boolean;
  isObject: boolean;
  keys?: string[];
  arrayLength?: number;
  depth: number;
} {
  const validation = validateYaml(yamlString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid YAML");
  }

  const data = validation.data;
  const type = Array.isArray(data) ? "array" : typeof data;
  const isArray = Array.isArray(data);
  const isObject = typeof data === "object" && data !== null && !isArray;

  let keys: string[] | undefined;
  if (isObject) {
    keys = Object.keys(data as Record<string, unknown>);
  }

  const depth = _calculateYamlDepth(data);

  return {
    type,
    isArray,
    isObject,
    keys,
    arrayLength: isArray ? (data as unknown[]).length : undefined,
    depth,
  };
}

/**
 * Calculates the maximum nesting depth of a YAML structure
 * @param obj - The object or array to analyze
 * @param currentDepth - Current depth level (used in recursion)
 * @returns Maximum nesting depth
 */
function _calculateYamlDepth(obj: unknown, currentDepth: number = 0): number {
  if (obj === null || typeof obj !== "object") {
    return currentDepth;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return currentDepth;
    }
    return Math.max(
      ...obj.map((item) => _calculateYamlDepth(item, currentDepth + 1)),
    );
  }

  const values = Object.values(obj);
  if (values.length === 0) {
    return currentDepth;
  }

  return Math.max(
    ...values.map((value) => _calculateYamlDepth(value, currentDepth + 1)),
  );
}

/**
 * Beautifies YAML with consistent formatting style
 * @param yamlString - The YAML string to beautify
 * @param options - Beautification options
 * @returns Beautified YAML string
 */
export function beautifyYaml(
  yamlString: string,
  options: YamlFormatOptions = {},
): string {
  return formatYaml(yamlString, {
    indent: 2,
    lineWidth: 80,
    ...options,
  });
}
