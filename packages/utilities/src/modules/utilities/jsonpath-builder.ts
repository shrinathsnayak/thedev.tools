/**
 * JSONPath expression builder utilities
 * Complements jsonpath-playground
 */

import type { JSONPathExpression } from "@workspace/types/jsonpath";
import { COMMON_JSONPATH_EXPRESSIONS } from "@workspace/constants/jsonpath";

// Re-export for backward compatibility
export type { JSONPathExpression } from "@workspace/types/jsonpath";
export { COMMON_JSONPATH_EXPRESSIONS } from "@workspace/constants/jsonpath";

// Legacy constant for backward compatibility (will be removed)
const _COMMON_JSONPATH_EXPRESSIONS: Record<string, JSONPathExpression> = {
  "all-properties": {
    expression: "$.*",
    description: "Select all properties of root object",
  },
  "all-array-items": {
    expression: "$[*]",
    description: "Select all items in root array",
  },
  "nested-property": {
    expression: "$.property.subproperty",
    description: "Select nested property",
  },
  "array-by-index": {
    expression: "$[0]",
    description: "Select first item in array",
  },
  "array-by-indices": {
    expression: "$[0,2,4]",
    description: "Select multiple items by index",
  },
  "array-slice": {
    expression: "$[0:3]",
    description: "Select array slice (first 3 items)",
  },
  "filter-by-value": {
    expression: "$..[?(@.status == 'active')]",
    description: "Filter objects by property value",
  },
  "filter-by-type": {
    expression: "$..[?(@.type == 'user')]",
    description: "Filter objects by type",
  },
  "greater-than": {
    expression: "$..[?(@.age > 18)]",
    description: "Filter by numeric comparison",
  },
  "property-exists": {
    expression: "$..[?(@.email)]",
    description: "Filter objects that have a property",
  },
};

/**
 * Builds JSONPath expression from components
 * @param components - Expression components
 * @returns JSONPath expression string
 */
export function buildJSONPathExpression(components: {
  root?: string;
  path?: string[];
  filter?: string;
  index?: number | number[];
  slice?: { start?: number; end?: number };
}): string {
  let expression = components.root || "$";

  if (components.path && components.path.length > 0) {
    expression += "." + components.path.join(".");
  }

  if (components.filter) {
    expression += `[?(${components.filter})]`;
  }

  if (components.index !== undefined) {
    if (Array.isArray(components.index)) {
      expression += `[${components.index.join(",")}]`;
    } else {
      expression += `[${components.index}]`;
    }
  }

  if (components.slice) {
    const start = components.slice.start ?? 0;
    const end = components.slice.end ?? "";
    expression += `[${start}:${end}]`;
  }

  return expression;
}

/**
 * Validates JSONPath expression syntax
 * @param expression - JSONPath expression
 * @returns Validation result
 */
export function validateJSONPath(expression: string): {
  valid: boolean;
  error?: string;
} {
  if (!expression || expression.trim() === "") {
    return { valid: false, error: "Expression cannot be empty" };
  }

  if (!expression.startsWith("$")) {
    return { valid: false, error: "Expression must start with $" };
  }

  // Basic syntax validation
  try {
    // Check for balanced brackets
    const brackets = expression.match(/\[/g)?.length || 0;
    const closeBrackets = expression.match(/\]/g)?.length || 0;
    if (brackets !== closeBrackets) {
      return { valid: false, error: "Unbalanced brackets" };
    }

    // Check for balanced parentheses in filters
    const parens = expression.match(/\(/g)?.length || 0;
    const closeParens = expression.match(/\)/g)?.length || 0;
    if (parens !== closeParens) {
      return { valid: false, error: "Unbalanced parentheses" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid expression syntax" };
  }
}

/**
 * Gets common JSONPath expressions
 * @returns Array of common expressions
 */
export function getCommonExpressions(): JSONPathExpression[] {
  return Object.values(COMMON_JSONPATH_EXPRESSIONS);
}
