/**
 * JSONPath-related constants
 */

import type { JSONPathExpression } from "@workspace/types/jsonpath";

/**
 * Common JSONPath expressions
 */
export const COMMON_JSONPATH_EXPRESSIONS: Record<string, JSONPathExpression> = {
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

