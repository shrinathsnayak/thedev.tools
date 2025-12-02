/**
 * OpenAPI/Swagger validator utilities
 */

export type OpenAPIVersion = "2.0" | "3.0" | "3.1";

export interface OpenAPIValidationResult {
  valid: boolean;
  version?: OpenAPIVersion;
  errors: Array<{ path: string; message: string }>;
  warnings: Array<{ path: string; message: string }>;
}

/**
 * Validates OpenAPI/Swagger specification
 * @param spec - OpenAPI spec object or JSON string
 * @returns Validation result
 */
export function validateOpenAPI(
  spec: object | string,
): OpenAPIValidationResult {
  const specObj = typeof spec === "string" ? JSON.parse(spec) : spec;
  const errors: Array<{ path: string; message: string }> = [];
  const warnings: Array<{ path: string; message: string }> = [];

  let version: OpenAPIVersion | undefined;
  if ("openapi" in specObj) {
    const openapiVersion = specObj.openapi as string;
    if (openapiVersion.startsWith("3.1")) {
      version = "3.1";
    } else if (openapiVersion.startsWith("3.0")) {
      version = "3.0";
    }
  } else if ("swagger" in specObj) {
    const swaggerVersion = specObj.swagger as string;
    if (swaggerVersion.startsWith("2.0")) {
      version = "2.0";
    }
  }

  if (!version) {
    errors.push({
      path: "",
      message: "Unable to determine OpenAPI/Swagger version",
    });
    return {
      valid: false,
      errors,
      warnings,
    };
  }

  if (version === "2.0") {
    _validateSwagger2(specObj, errors, warnings);
  } else {
    _validateOpenAPI3(specObj, errors, warnings, version);
  }

  return {
    valid: errors.length === 0,
    version,
    errors,
    warnings,
  };
}

/**
 * Validates Swagger 2.0 specification structure
 * @param spec - Swagger 2.0 spec object
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateSwagger2(
  spec: any,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  // Required fields
  if (!spec.info) {
    errors.push({ path: "info", message: "Missing required field: info" });
  } else {
    if (!spec.info.title) {
      errors.push({
        path: "info.title",
        message: "Missing required field: info.title",
      });
    }
    if (!spec.info.version) {
      errors.push({
        path: "info.version",
        message: "Missing required field: info.version",
      });
    }
  }

  if (!spec.paths || typeof spec.paths !== "object") {
    errors.push({ path: "paths", message: "Missing or invalid field: paths" });
  } else {
    // Validate paths
    Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
      if (!pathItem || typeof pathItem !== "object") {
        errors.push({ path: `paths.${path}`, message: "Invalid path item" });
        return;
      }

      const methods = [
        "get",
        "post",
        "put",
        "delete",
        "patch",
        "head",
        "options",
      ];
      methods.forEach((method) => {
        if (pathItem[method]) {
          const operation = pathItem[method];
          if (!operation.responses || typeof operation.responses !== "object") {
            errors.push({
              path: `paths.${path}.${method}.responses`,
              message: "Missing or invalid responses",
            });
          }
        }
      });
    });
  }
}

/**
 * Validates OpenAPI 3.x specification structure
 * @param spec - OpenAPI 3.x spec object
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 * @param version - OpenAPI version (3.0 or 3.1)
 */
function _validateOpenAPI3(
  spec: any,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
  version: OpenAPIVersion,
): void {
  // Required fields
  if (!spec.info) {
    errors.push({ path: "info", message: "Missing required field: info" });
  } else {
    if (!spec.info.title) {
      errors.push({
        path: "info.title",
        message: "Missing required field: info.title",
      });
    }
    if (!spec.info.version) {
      errors.push({
        path: "info.version",
        message: "Missing required field: info.version",
      });
    }
  }

  if (!spec.paths || typeof spec.paths !== "object") {
    errors.push({ path: "paths", message: "Missing or invalid field: paths" });
  } else {
    // Validate paths
    Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
      if (!pathItem || typeof pathItem !== "object") {
        errors.push({ path: `paths.${path}`, message: "Invalid path item" });
        return;
      }

      const methods = [
        "get",
        "post",
        "put",
        "delete",
        "patch",
        "head",
        "options",
        "trace",
      ];
      methods.forEach((method) => {
        if (pathItem[method]) {
          const operation = pathItem[method];
          if (!operation.responses || typeof operation.responses !== "object") {
            errors.push({
              path: `paths.${path}.${method}.responses`,
              message: "Missing or invalid responses",
            });
          }
        }
      });
    });
  }

  if (
    !spec.servers ||
    !Array.isArray(spec.servers) ||
    spec.servers.length === 0
  ) {
    warnings.push({
      path: "servers",
      message: "No servers defined (required for OpenAPI 3.0+)",
    });
  }
}

/**
 * Extracts API endpoints from OpenAPI specification
 * @param spec - OpenAPI spec object or JSON string
 * @returns Array of endpoint objects with path, method, summary, and operationId
 */
export function extractEndpoints(spec: object | string): Array<{
  path: string;
  method: string;
  summary?: string;
  operationId?: string;
}> {
  const specObj = typeof spec === "string" ? JSON.parse(spec) : spec;
  const endpoints: Array<{
    path: string;
    method: string;
    summary?: string;
    operationId?: string;
  }> = [];

  if (!specObj.paths) {
    return endpoints;
  }

  const methods = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "head",
    "options",
    "trace",
  ];

  Object.entries(specObj.paths).forEach(([path, pathItem]: [string, any]) => {
    if (!pathItem || typeof pathItem !== "object") return;

    methods.forEach((method) => {
      if (pathItem[method]) {
        const operation = pathItem[method];
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary,
          operationId: operation.operationId,
        });
      }
    });
  });

  return endpoints;
}

/**
 * Gets OpenAPI/Swagger version from specification
 * @param spec - OpenAPI spec object or JSON string
 * @returns Detected version (2.0, 3.0, 3.1) or null if not found
 */
export function getOpenAPIVersion(
  spec: object | string,
): OpenAPIVersion | null {
  const specObj = typeof spec === "string" ? JSON.parse(spec) : spec;

  if ("openapi" in specObj) {
    const version = specObj.openapi as string;
    if (version.startsWith("3.1")) return "3.1";
    if (version.startsWith("3.0")) return "3.0";
  }

  if ("swagger" in specObj) {
    const version = specObj.swagger as string;
    if (version.startsWith("2.0")) return "2.0";
  }

  return null;
}
