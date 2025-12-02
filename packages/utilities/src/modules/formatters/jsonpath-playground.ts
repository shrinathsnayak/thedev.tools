/**
 * JSONPath Playground
 * Enhanced JSONPath utilities for querying and manipulating JSON
 */

import { JSONPath } from "jsonpath-plus";

export interface JsonPathQuery {
  path: string;
  data: unknown;
  result: unknown[];
  error?: string;
}

/**
 * Executes a JSONPath query on JSON data and returns results
 * @param jsonData - The JSON data to query
 * @param path - The JSONPath expression string
 * @returns Query result object with path, data, results, and optional error
 */
export function queryJsonPath(jsonData: unknown, path: string): JsonPathQuery {
  try {
    const serializableData = JSON.parse(JSON.stringify(jsonData)) as
      | string
      | number
      | boolean
      | object
      | any[]
      | null;
    const result = JSONPath({
      path,
      json: serializableData,
    });

    return {
      path,
      data: jsonData,
      result: Array.isArray(result) ? result : [result],
    };
  } catch (error) {
    return {
      path,
      data: jsonData,
      result: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extracts all possible JSONPath paths from JSON data structure
 * @param jsonData - The JSON data to analyze
 * @param maxDepth - Maximum recursion depth (default: 10)
 * @returns Array of all possible JSONPath expressions for the data
 */
export function getAllPaths(
  jsonData: unknown,
  maxDepth: number = 10,
): string[] {
  const paths: string[] = [];
  const stack: Array<{ obj: unknown; path: string; depth: number }> = [
    { obj: jsonData, path: "$", depth: 0 },
  ];

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item || item.depth > maxDepth) continue;

    const { obj, path, depth } = item;

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        const elementPath = `${path}[${i}]`;
        paths.push(elementPath);

        if (
          element !== null &&
          (typeof element === "object" || Array.isArray(element))
        ) {
          stack.push({ obj: element, path: elementPath, depth: depth + 1 });
        }
      }
    } else if (obj !== null && typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        const keyPath = `${path}.${key}`;
        paths.push(keyPath);

        if (
          value !== null &&
          (typeof value === "object" || Array.isArray(value))
        ) {
          stack.push({ obj: value, path: keyPath, depth: depth + 1 });
        }
      }
    }
  }

  return paths;
}

/**
 * Validates a JSONPath expression syntax
 * @param path - The JSONPath expression string to validate
 * @returns Validation result with error message if invalid
 */
export function validateJsonPath(path: string): {
  valid: boolean;
  error?: string;
} {
  try {
    JSONPath({
      path,
      json: {},
    });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : "Invalid JSONPath expression",
    };
  }
}

/**
 * Common JSONPath expressions
 */
export const JSONPATH_EXAMPLES: Record<
  string,
  { path: string; description: string }
> = {
  Root: {
    path: "$",
    description: "Selects the root element",
  },
  "All values": {
    path: "$..*",
    description: "Selects all values recursively",
  },
  "All keys": {
    path: "$..*",
    description: "Selects all keys recursively",
  },
  "All items in array": {
    path: "$[*]",
    description: "Selects all items in an array",
  },
  "First item": {
    path: "$[0]",
    description: "Selects the first item in an array",
  },
  "Last item": {
    path: "$[-1]",
    description: "Selects the last item in an array",
  },
  "Filter by property": {
    path: "$[?(@.property == 'value')]",
    description: "Filters array items by property value",
  },
  "Filter by condition": {
    path: "$[?(@.age > 18)]",
    description: "Filters array items by condition",
  },
  "Nested property": {
    path: "$.parent.child",
    description: "Selects nested property",
  },
  "Multiple properties": {
    path: "$['prop1', 'prop2']",
    description: "Selects multiple properties",
  },
  "Array slice": {
    path: "$[1:3]",
    description: "Selects array slice (items 1 to 3)",
  },
  Wildcard: {
    path: "$.*",
    description: "Selects all properties",
  },
};

/**
 * Returns array of example JSONPath expressions with descriptions
 * @returns Array of example objects with name, path, and description
 */
export function getJsonPathExamples(): Array<{
  name: string;
  path: string;
  description: string;
}> {
  return Object.entries(JSONPATH_EXAMPLES).map(
    ([name, { path, description }]) => ({
      name,
      path,
      description,
    }),
  );
}

/**
 * Formats JSONPath query results as a JSON string for display
 * @param result - Array of query results
 * @returns Formatted JSON string or "No results found" message
 */
export function formatJsonPathResult(result: unknown[]): string {
  if (result.length === 0) {
    return "No results found";
  }

  if (result.length === 1) {
    return JSON.stringify(result[0], null, 2);
  }

  return JSON.stringify(result, null, 2);
}

/**
 * Counts the number of matches in a JSONPath query result
 * @param result - Array of query results
 * @returns Number of matches found
 */
export function countJsonPathMatches(result: unknown[]): number {
  return result.length;
}

/**
 * Extracts unique values from a JSONPath query result by removing duplicates
 * @param result - Array of query results
 * @returns Array of unique values
 */
export function extractUniqueValues(result: unknown[]): unknown[] {
  const seen = new Set<string>();
  const unique: unknown[] = [];

  for (const item of result) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique;
}
