/**
 * GraphQL formatting utilities
 * Uses 'graphql' package for GraphQL query formatting and validation
 */

import { parse, print, validate, buildSchema, GraphQLError } from "graphql";

export interface GraphQLFormatOptions {
  indent?: number;
  pretty?: boolean;
}

/**
 * Validates GraphQL query or mutation syntax and optionally validates against a schema
 * @param query - The GraphQL query or mutation string to validate
 * @param schemaString - Optional GraphQL schema string for full validation
 * @returns Validation result with errors if invalid
 */
export function validateGraphQL(
  query: string,
  schemaString?: string,
): {
  isValid: boolean;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
  }>;
} {
  try {
    const document = parse(query);
    const errors: GraphQLError[] = [];

    if (schemaString) {
      try {
        const schema = buildSchema(schemaString);
        const validationErrors = validate(schema, document);
        if (validationErrors.length > 0) {
          return {
            isValid: false,
            errors: validationErrors.map((err) => ({
              message: err.message,
              locations: err.locations?.map((loc) => ({
                line: loc.line,
                column: loc.column,
              })),
            })),
          };
        }
      } catch (schemaError) {
        return {
          isValid: false,
          errors: [
            {
              message: `Schema error: ${schemaError instanceof Error ? schemaError.message : "Unknown error"}`,
            },
          ],
        };
      }
    }

    return {
      isValid: true,
    };
  } catch (error) {
    if (error instanceof Error && "locations" in error) {
      const graphqlError = error as GraphQLError;
      return {
        isValid: false,
        errors: [
          {
            message: graphqlError.message,
            locations: graphqlError.locations?.map((loc) => ({
              line: loc.line,
              column: loc.column,
            })),
          },
        ],
      };
    }

    return {
      isValid: false,
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    };
  }
}

/**
 * Formats GraphQL query with proper indentation and line breaks
 * @param query - The GraphQL query string to format
 * @param options - Formatting options (indent, pretty mode)
 * @returns Formatted GraphQL query string
 * @throws Error if query syntax is invalid
 */
export function formatGraphQL(
  query: string,
  options: GraphQLFormatOptions = {},
): string {
  try {
    const document = parse(query);
    const formatted = print(document);

    if (options.pretty === false) {
      return formatted.replace(/\s+/g, " ").trim();
    }

    return formatted;
  } catch (error) {
    throw new Error(
      `Failed to format GraphQL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Minifies GraphQL query by removing all unnecessary whitespace
 * @param query - The GraphQL query string to minify
 * @returns Minified GraphQL query string
 * @throws Error if query syntax is invalid
 */
export function minifyGraphQL(query: string): string {
  try {
    const document = parse(query);
    return print(document)
      .replace(/\s+/g, " ")
      .replace(/\s*{\s*/g, "{")
      .replace(/\s*}\s*/g, "}")
      .replace(/\s*\(\s*/g, "(")
      .replace(/\s*\)\s*/g, ")")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ",")
      .trim();
  } catch (error) {
    throw new Error(
      `Failed to minify GraphQL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts the operation name from a GraphQL query or mutation
 * @param query - The GraphQL query string to analyze
 * @returns Operation name if found, null otherwise
 */
export function extractOperationName(query: string): string | null {
  try {
    const document = parse(query);
    const operations = document.definitions.filter(
      (def) => def.kind === "OperationDefinition" && "name" in def && def.name,
    );
    if (operations.length > 0) {
      const firstOp = operations[0];
      if (firstOp && "name" in firstOp && firstOp.name?.value) {
        return firstOp.name.value;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts all variable names from GraphQL query variable definitions
 * @param query - The GraphQL query string to analyze
 * @returns Array of variable names found in the query
 */
export function extractGraphQLVariables(query: string): string[] {
  try {
    const document = parse(query);
    const variables: string[] = [];

    document.definitions.forEach((def) => {
      if (
        def.kind === "OperationDefinition" &&
        "variableDefinitions" in def &&
        def.variableDefinitions
      ) {
        def.variableDefinitions.forEach((varDef) => {
          if (varDef.variable.name?.value) {
            variables.push(varDef.variable.name.value);
          }
        });
      }
    });

    return variables;
  } catch {
    return [];
  }
}

/**
 * Extracts all field names from a GraphQL query selection set
 * @param query - The GraphQL query string to analyze
 * @returns Array of unique field names found in the query
 */
export function extractFields(query: string): string[] {
  try {
    const document = parse(query);
    const fields: string[] = [];

    function _extractFromSelectionSet(selectionSet: any): void {
      if (!selectionSet || !selectionSet.selections) return;

      selectionSet.selections.forEach((selection: any) => {
      if (selection.kind === "Field" && selection.name?.value) {
        fields.push(selection.name.value);
        if (selection.selectionSet) {
          _extractFromSelectionSet(selection.selectionSet);
        }
      } else if (
        selection.kind === "InlineFragment" &&
        selection.selectionSet
      ) {
        _extractFromSelectionSet(selection.selectionSet);
      } else if (selection.kind === "FragmentSpread") {
      }
      });
    }

    document.definitions.forEach((def) => {
      if (def.kind === "OperationDefinition" && def.selectionSet) {
        _extractFromSelectionSet(def.selectionSet);
      }
    });

    return [...new Set(fields)];
  } catch {
    return [];
  }
}
