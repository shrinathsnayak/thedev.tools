import { js as beautify } from "js-beautify";
import { JSONPath } from "jsonpath-plus";
// @ts-ignore - no types available
import apply from "json-merge-patch";
// @ts-ignore - no types available
import { diff } from "json-diff";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { js2xml } from "xml-js";

/**
 * Comprehensive JSON utilities: beautifier, formatter, validator, transformer, and more
 */

export interface JsonFormatOptions {
  indent?: number | string;
  indentChar?: string;
  sortKeys?: boolean;
  quoteKeys?: boolean;
  trailingCommas?: boolean;
  escapeForwardSlashes?: boolean;
}

export interface JsonBeautifyOptions {
  indent_size?: number;
  indent_char?: string;
  indent_level?: number;
  wrap_line_length?: number;
  space_after_colon?: boolean;
  space_after_comma?: boolean;
}

const defaultFormatOptions: JsonFormatOptions = {
  indent: 2,
  indentChar: " ",
  sortKeys: false,
  quoteKeys: false,
  trailingCommas: false,
  escapeForwardSlashes: false,
};

/**
 * Validates JSON string and returns detailed error information if invalid
 * @param jsonString - The JSON string to validate
 * @returns Validation result with parsed data, size, or error details
 */
export function validateJson(jsonString: string): {
  isValid: boolean;
  error?: string;
  errorPosition?: number;
  data?: unknown;
  size?: number;
} {
  try {
    const data = JSON.parse(jsonString);
    return {
      isValid: true,
      data,
      size: new Blob([jsonString]).size,
    };
  } catch (error) {
    const err = error as Error;
    let errorPosition: number | undefined;

    const match = err.message.match(/position (\d+)/);
    if (match && match[1]) {
      errorPosition = parseInt(match[1], 10);
    }

    return {
      isValid: false,
      error: err.message,
      errorPosition,
    };
  }
}

/**
 * Beautifies JSON string using js-beautify library
 * @param jsonString - The JSON string to beautify
 * @param options - Beautification options (indent size, spacing, etc.)
 * @returns Beautified JSON string
 * @throws Error if JSON is invalid
 */
export function beautifyJson(
  jsonString: string,
  options: JsonBeautifyOptions = {},
): string {
  const validation = validateJson(jsonString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid JSON");
  }

  const config: JsonBeautifyOptions = {
    indent_size: 2,
    indent_char: " ",
    space_after_colon: true,
    space_after_comma: true,
    ...options,
  };

  const result = beautify(jsonString, config);
  return result || jsonString;
}

/**
 * Formats JSON string with customizable indentation and options
 * @param jsonString - The JSON string to format
 * @param options - Formatting options (indent, sort keys, etc.)
 * @returns Formatted JSON string
 * @throws Error if JSON is invalid
 */
export function formatJson(
  jsonString: string,
  options: JsonFormatOptions = {},
): string {
  const config = { ...defaultFormatOptions, ...options };
  const validation = validateJson(jsonString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid JSON");
  }

  let data = validation.data;

  if (config.sortKeys && typeof data === "object" && data !== null) {
    data = _sortObjectKeys(data);
  }

  const indent =
    typeof config.indent === "number"
      ? (config.indentChar || " ").repeat(config.indent)
      : config.indent;

  return JSON.stringify(data, null, indent);
}

/**
 * Minifies JSON by removing all whitespace
 * @param jsonString - The JSON string to minify
 * @returns Minified JSON string
 * @throws Error if JSON is invalid
 */
export function minifyJson(jsonString: string): string {
  const validation = validateJson(jsonString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid JSON");
  }

  return JSON.stringify(validation.data);
}

/**
 * Flattens a nested JSON object into a single-level object with dot-notation keys
 * @param obj - The nested object to flatten
 * @param prefix - Optional prefix for keys (used in recursion)
 * @param delimiter - Delimiter to use between nested keys (default: ".")
 * @returns Flattened object with dot-notation keys
 */
export function flattenJson(
  obj: Record<string, unknown>,
  prefix: string = "",
  delimiter: string = ".",
): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0
    ) {
      Object.assign(
        flattened,
        flattenJson(value as Record<string, unknown>, newKey, delimiter),
      );
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

/**
 * Unflattens a dot-notation object back into a nested structure
 * @param obj - The flat object with dot-notation keys
 * @param delimiter - Delimiter used in keys (default: ".")
 * @returns Nested object structure
 */
export function unflattenJson(
  obj: Record<string, unknown>,
  delimiter: string = ".",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(delimiter);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i] || "";
      if (
        !(k in current) ||
        typeof current[k] !== "object" ||
        Array.isArray(current[k])
      ) {
        current[k] = {};
      }
      current = current[k] as Record<string, unknown>;
    }

    current[keys[keys.length - 1] || ""] = value;
  }

  return result;
}

/**
 * Merges two JSON objects using JSON Merge Patch algorithm
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns Merged object
 */
export function mergeJson(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  return apply(target, source) as Record<string, unknown>;
}

/**
 * Deep merges multiple JSON objects sequentially
 * @param objects - Variable number of objects to merge
 * @returns Deeply merged object
 */
export function deepMergeJson(
  ...objects: Record<string, unknown>[]
): Record<string, unknown> {
  if (objects.length === 0) {
    return {};
  }

  if (objects.length === 1) {
    return objects[0] || {};
  }

  let result = objects[0] || {};

  for (let i = 1; i < objects.length; i++) {
    const obj = objects[i];
    if (obj && typeof obj === "object") {
      result = mergeJson(result, obj);
    }
  }

  return result;
}

/**
 * Computes the difference between two JSON objects
 * @param obj1 - First object to compare
 * @param obj2 - Second object to compare
 * @returns Object containing added, deleted, and modified properties
 * @throws Error if diff computation fails
 */
export function diffJson(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): {
  added?: Record<string, unknown>;
  deleted?: Record<string, unknown>;
  modified?: Record<string, { old: unknown; new: unknown }>;
} {
  try {
    const differences = diff(obj1, obj2);
    return differences as {
      added?: Record<string, unknown>;
      deleted?: Record<string, unknown>;
      modified?: Record<string, { old: unknown; new: unknown }>;
    };
  } catch (error) {
    throw new Error(
      `Failed to compute diff: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Queries JSON data using a JSONPath expression
 * @param jsonString - The JSON string to query
 * @param path - JSONPath expression (e.g., "$.users[*].name")
 * @returns Array of matching values
 * @throws Error if JSON is invalid or query fails
 */
export function queryJson(jsonString: string, path: string): unknown[] {
  const validation = validateJson(jsonString);

  if (!validation.isValid || !validation.data) {
    throw new Error("Invalid JSON");
  }

  try {
    return JSONPath({
      path,
      json: validation.data,
      resultType: "value",
    }) as unknown[];
  } catch (error) {
    throw new Error(
      `JSONPath query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts JSON string to YAML format
 * @param jsonString - The JSON string to convert
 * @param options - Conversion options (indent level)
 * @returns YAML string
 * @throws Error if JSON is invalid or conversion fails
 */
export function jsonToYaml(
  jsonString: string,
  options: { indent?: number } = {},
): string {
  const validation = validateJson(jsonString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid JSON");
  }

  try {
    return stringifyYaml(validation.data, { indent: options.indent || 2 });
  } catch (error) {
    throw new Error(
      `Failed to convert JSON to YAML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts YAML string to JSON format
 * @param yamlString - The YAML string to convert
 * @param options - Conversion options (indent level)
 * @returns JSON string
 * @throws Error if YAML is invalid or conversion fails
 */
export function yamlToJson(
  yamlString: string,
  options: { indent?: number } = {},
): string {
  try {
    const data = parseYaml(yamlString);
    return JSON.stringify(data, null, options.indent || 2);
  } catch (error) {
    throw new Error(
      `Failed to convert YAML to JSON: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts JSON string to XML format
 * @param jsonString - The JSON string to convert
 * @param options - Conversion options (compact mode, spacing)
 * @returns XML string
 * @throws Error if JSON is invalid or conversion fails
 */
export function jsonToXml(
  jsonString: string,
  options: { compact?: boolean; spaces?: number } = {},
): string {
  const validation = validateJson(jsonString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid JSON");
  }

  try {
    return js2xml(validation.data, {
      compact: options.compact ?? true,
      spaces: options.spaces ?? 2,
      ignoreAttributes: false,
      textKey: "_",
      attributesKey: "$",
    });
  } catch (error) {
    throw new Error(
      `Failed to convert JSON to XML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Transforms JSON data using a custom transformer function
 * @param jsonString - The JSON string to transform
 * @param transformer - Function to transform the parsed data
 * @returns Transformed data of type T
 * @throws Error if JSON is invalid
 */
export function transformJson<T = unknown>(
  jsonString: string,
  transformer: (data: unknown) => T,
): T {
  const validation = validateJson(jsonString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid JSON");
  }

  return transformer(validation.data);
}

/**
 * Analyzes and returns type information about JSON structure
 * @param jsonString - The JSON string to analyze
 * @returns Object containing type, structure, and depth information
 * @throws Error if JSON is invalid
 */
export function getJsonTypeInfo(jsonString: string): {
  type: string;
  isArray: boolean;
  isObject: boolean;
  isEmpty: boolean;
  keys?: string[];
  arrayLength?: number;
  depth: number;
} {
  const validation = validateJson(jsonString);

  if (!validation.isValid || !validation.data) {
    throw new Error(validation.error || "Invalid JSON");
  }

  const data = validation.data;
  const type = Array.isArray(data) ? "array" : typeof data;
  const isArray = Array.isArray(data);
  const isObject = typeof data === "object" && data !== null && !isArray;

  let keys: string[] | undefined;
  if (isObject) {
    keys = Object.keys(data as Record<string, unknown>);
  }

  const isEmpty =
    (isArray && (data as unknown[]).length === 0) ||
    (isObject && keys?.length === 0) ||
    data === null ||
    data === undefined;

  const depth = _calculateDepth(data);

  return {
    type,
    isArray,
    isObject,
    isEmpty,
    keys,
    arrayLength: isArray ? (data as unknown[]).length : undefined,
    depth,
  };
}

/**
 * Calculates the maximum nesting depth of a JSON structure
 * @param obj - The object to analyze
 * @param currentDepth - Current depth level (used in recursion)
 * @returns Maximum nesting depth
 */
function _calculateDepth(obj: unknown, currentDepth: number = 0): number {
  if (obj === null || typeof obj !== "object") {
    return currentDepth;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return currentDepth;
    }
    return Math.max(
      ...obj.map((item) => _calculateDepth(item, currentDepth + 1)),
    );
  }

  const values = Object.values(obj);
  if (values.length === 0) {
    return currentDepth;
  }

  return Math.max(
    ...values.map((value) => _calculateDepth(value, currentDepth + 1)),
  );
}

/**
 * Recursively sorts object keys alphabetically throughout the structure
 * @param obj - The object or array to sort
 * @returns New object/array with sorted keys
 */
function _sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => _sortObjectKeys(item));
  }

  if (typeof obj === "object" && obj !== null) {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      sorted[key] = _sortObjectKeys((obj as Record<string, unknown>)[key]);
    }

    return sorted;
  }

  return obj;
}

/**
 * Calculates size statistics comparing original and formatted JSON
 * @param original - Original JSON string
 * @param formatted - Formatted JSON string
 * @returns Object containing size comparison metrics
 */
export function getJsonSizeStats(original: string, formatted: string) {
  const originalSize = new Blob([original]).size;
  const formattedSize = new Blob([formatted]).size;
  const diff = formattedSize - originalSize;
  const savingsPercent = ((Math.abs(diff) / originalSize) * 100).toFixed(2);

  return {
    originalSize,
    formattedSize,
    diff,
    isLarger: diff > 0,
    savingsPercent: parseFloat(savingsPercent),
    compressionRatio: ((1 - formattedSize / originalSize) * 100).toFixed(2),
  };
}

/**
 * Escapes JSON string for safe embedding in HTML or script tags
 * @param jsonString - The JSON string to escape
 * @returns HTML-escaped JSON string
 */
export function escapeJsonForHtml(jsonString: string): string {
  return jsonString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Recursively removes all null values from a JSON object or array
 * @param obj - The object or array to process
 * @returns New object/array with null values removed
 */
export function removeNulls(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeNulls(item)).filter((item) => item !== null);
  }

  if (typeof obj === "object" && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null) {
        result[key] = removeNulls(value);
      }
    }
    return result;
  }

  return obj;
}
