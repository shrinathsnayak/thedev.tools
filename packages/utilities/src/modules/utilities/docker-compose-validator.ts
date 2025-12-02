/**
 * Docker Compose validator utilities
 */

export interface DockerComposeValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  warnings: Array<{ path: string; message: string }>;
  services: string[];
  version?: string;
}

/**
 * Validates Docker Compose file structure and content
 * @param compose - Docker Compose YAML/JSON object or string
 * @returns Validation result with errors, warnings, services, and version
 */
export function validateDockerCompose(
  compose: object | string,
): DockerComposeValidationResult {
  const composeObj = typeof compose === "string" ? _parseYAML(compose) : compose;
  const errors: Array<{ path: string; message: string }> = [];
  const warnings: Array<{ path: string; message: string }> = [];
  const services: string[] = [];

  let version: string | undefined;
  if ("version" in composeObj && typeof composeObj.version === "string") {
    version = composeObj.version;
  } else if ("version" in composeObj === false) {
    warnings.push({
      path: "version",
      message: "Version field is optional in Docker Compose v3.0+",
    });
  }

  if (!("services" in composeObj) || typeof composeObj.services !== "object") {
    errors.push({
      path: "services",
      message: "Missing required field: services",
    });
    return {
      valid: false,
      errors,
      warnings,
      services: [],
      version,
    };
  }

  Object.entries(composeObj.services).forEach(
    ([serviceName, service]: [string, any]) => {
      services.push(serviceName);

      if (!service || typeof service !== "object") {
        errors.push({
          path: `services.${serviceName}`,
          message: "Invalid service definition",
        });
        return;
      }

      if (!service.image && !service.build) {
        errors.push({
          path: `services.${serviceName}`,
          message: "Service must have either 'image' or 'build' field",
        });
      }

      if (service.ports && Array.isArray(service.ports)) {
        service.ports.forEach((port: any, index: number) => {
          if (typeof port === "string") {
            if (!/^\d+:\d+$|^\d+$/.test(port)) {
              errors.push({
                path: `services.${serviceName}.ports[${index}]`,
                message: "Invalid port format",
              });
            }
          } else if (typeof port === "object") {
            if (!port.target && !port.published) {
              errors.push({
                path: `services.${serviceName}.ports[${index}]`,
                message: "Port object must have 'target' or 'published' field",
              });
            }
          }
        });
      }

      if (service.environment) {
        if (
          typeof service.environment === "object" &&
          !Array.isArray(service.environment)
        ) {
        } else if (Array.isArray(service.environment)) {
          service.environment.forEach((env: any, index: number) => {
            if (typeof env !== "string" || !env.includes("=")) {
              errors.push({
                path: `services.${serviceName}.environment[${index}]`,
                message: "Environment variable must be in KEY=VALUE format",
              });
            }
          });
        } else {
          errors.push({
            path: `services.${serviceName}.environment`,
            message: "Environment must be an object or array",
          });
        }
      }

      // Validate volumes
      if (service.volumes && Array.isArray(service.volumes)) {
        service.volumes.forEach((volume: any, index: number) => {
          if (typeof volume === "string") {
            if (!volume.includes(":")) {
              warnings.push({
                path: `services.${serviceName}.volumes[${index}]`,
                message:
                  "Volume format should be 'host:container' or named volume",
              });
            }
          } else if (typeof volume === "object") {
            if (!volume.target && !volume.source) {
              errors.push({
                path: `services.${serviceName}.volumes[${index}]`,
                message: "Volume object must have 'target' or 'source' field",
              });
            }
          }
        });
      }
    },
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    services,
    version,
  };
}

/**
 * Parses YAML string to object (simplified implementation)
 * @param yaml - YAML string to parse
 * @returns Parsed object or empty object if parsing fails
 */
function _parseYAML(yaml: string): any {
  try {
    return JSON.parse(yaml);
  } catch {
    return {};
  }
}

/**
 * Extracts service names from Docker Compose file
 * @param compose - Docker Compose object or YAML string
 * @returns Array of service name strings
 */
export function extractServices(compose: object | string): string[] {
  const composeObj = typeof compose === "string" ? _parseYAML(compose) : compose;

  if (!("services" in composeObj) || typeof composeObj.services !== "object") {
    return [];
  }

  return Object.keys(composeObj.services);
}

/**
 * Validates Docker Compose file format version string
 * @param version - Version string to validate
 * @returns True if version is a valid Docker Compose format version
 */
export function validateDockerComposeVersion(version: string): boolean {
  const validVersions = [
    "1",
    "1.0",
    "2",
    "2.0",
    "2.1",
    "2.2",
    "2.3",
    "2.4",
    "3",
    "3.0",
    "3.1",
    "3.2",
    "3.3",
    "3.4",
    "3.5",
    "3.6",
    "3.7",
    "3.8",
    "3.9",
  ];

  return validVersions.includes(version);
}
