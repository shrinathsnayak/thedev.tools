/**
 * JSON Schema Validator
 * Uses 'ajv' package for JSON schema validation
 */

import Ajv from "ajv";
import type { ErrorObject } from "ajv";
import addFormats from "ajv-formats";

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    data?: unknown;
  }>;
}

/**
 * Validates JSON data against a JSON Schema using Ajv
 * @param data - The data to validate
 * @param schema - The JSON Schema object to validate against
 * @returns Validation result with errors if validation fails
 */
export function validateJsonSchema(
  data: unknown,
  schema: object,
): ValidationResult {
  try {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(ajv);

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (valid) {
      return {
        valid: true,
        errors: [],
      };
    }

    return {
      valid: false,
      errors: (validate.errors || []).map((error: ErrorObject) => ({
        path: error.instancePath || error.schemaPath || "/",
        message: error.message || "Validation error",
        data: error.params,
      })),
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          path: "/",
          message:
            error instanceof Error ? error.message : "Unknown validation error",
        },
      ],
    };
  }
}

/**
 * Creates a reusable validator function for a specific JSON Schema
 * @param schema - The JSON Schema object to compile
 * @returns A validator function that can be reused to validate data against the schema
 * @throws Error if schema compilation fails
 */
export function createValidator(
  schema: object,
): (data: unknown) => ValidationResult {
  try {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    return (data: unknown) => {
      const valid = validate(data);

      if (valid) {
        return {
          valid: true,
          errors: [],
        };
      }

      return {
        valid: false,
        errors: (validate.errors || []).map((error: ErrorObject) => ({
          path: error.instancePath || error.schemaPath || "/",
          message: error.message || "Validation error",
          data: error.params,
        })),
      };
    };
  } catch (error) {
    throw new Error(
      `Failed to create validator: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validates a JSON Schema itself using meta-validation
 * @param schema - The JSON Schema object to validate
 * @returns Validation result indicating if the schema is valid
 */
export function validateSchema(schema: unknown): ValidationResult {
  try {
    const metaSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
    };

    return validateJsonSchema(schema, metaSchema);
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          path: "/",
          message:
            error instanceof Error ? error.message : "Schema validation failed",
        },
      ],
    };
  }
}
