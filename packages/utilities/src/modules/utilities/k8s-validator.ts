/**
 * Kubernetes YAML validator utilities
 */

export type KubernetesResourceType =
  | "Deployment"
  | "Service"
  | "ConfigMap"
  | "Secret"
  | "Ingress"
  | "Namespace"
  | "Pod"
  | "StatefulSet"
  | "DaemonSet"
  | "Job"
  | "CronJob";

export interface KubernetesValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  warnings: Array<{ path: string; message: string }>;
  resources: Array<{ kind: string; name?: string; namespace?: string }>;
}

/**
 * Validates Kubernetes manifest
 * @param manifest - Kubernetes YAML/JSON object or string
 * @returns Validation result
 */
export function validateKubernetesManifest(
  manifest: object | string,
): KubernetesValidationResult {
  const manifestObj =
    typeof manifest === "string" ? _parseYAML(manifest) : manifest;
  const errors: Array<{ path: string; message: string }> = [];
  const warnings: Array<{ path: string; message: string }> = [];
  const resources: Array<{ kind: string; name?: string; namespace?: string }> =
    [];

  const manifests = Array.isArray(manifestObj) ? manifestObj : [manifestObj];

  manifests.forEach((resource, index) => {
    const prefix = Array.isArray(manifestObj) ? `[${index}]` : "";

    if (!resource.apiVersion || typeof resource.apiVersion !== "string") {
      errors.push({
        path: `${prefix}.apiVersion`,
        message: "Missing required field: apiVersion",
      });
    }

    if (!resource.kind || typeof resource.kind !== "string") {
      errors.push({
        path: `${prefix}.kind`,
        message: "Missing required field: kind",
      });
    } else {
      resources.push({
        kind: resource.kind,
        name: resource.metadata?.name,
        namespace: resource.metadata?.namespace,
      });
    }

    if (!resource.metadata || typeof resource.metadata !== "object") {
      errors.push({
        path: `${prefix}.metadata`,
        message: "Missing required field: metadata",
      });
    } else {
      if (
        !resource.metadata.name ||
        typeof resource.metadata.name !== "string"
      ) {
        errors.push({
          path: `${prefix}.metadata.name`,
          message: "Missing required field: metadata.name",
        });
      }
    }

    // Validate specific resource types
    if (resource.kind) {
      _validateResourceType(resource, resource.kind, prefix, errors, warnings);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    resources,
  };
}

/**
 * Validates specific Kubernetes resource type
 * @param resource - Resource object to validate
 * @param kind - Resource kind (Deployment, Service, etc.)
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateResourceType(
  resource: any,
  kind: string,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  switch (kind) {
    case "Deployment":
      _validateDeployment(resource, prefix, errors, warnings);
      break;
    case "Service":
      _validateService(resource, prefix, errors, warnings);
      break;
    case "ConfigMap":
      _validateConfigMap(resource, prefix, errors, warnings);
      break;
    case "Secret":
      _validateSecret(resource, prefix, errors, warnings);
      break;
    case "Ingress":
      _validateIngress(resource, prefix, errors, warnings);
      break;
    case "Pod":
      _validatePod(resource, prefix, errors, warnings);
      break;
  }
}

/**
 * Validates Kubernetes Deployment resource
 * @param resource - Deployment resource object
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateDeployment(
  resource: any,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  if (!resource.spec) {
    errors.push({
      path: `${prefix}.spec`,
      message: "Deployment must have spec",
    });
    return;
  }

  if (!resource.spec.replicas || resource.spec.replicas < 0) {
    warnings.push({
      path: `${prefix}.spec.replicas`,
      message: "Replicas should be specified and >= 0",
    });
  }

  if (!resource.spec.template) {
    errors.push({
      path: `${prefix}.spec.template`,
      message: "Deployment must have spec.template",
    });
  } else {
    if (!resource.spec.template.spec) {
      errors.push({
        path: `${prefix}.spec.template.spec`,
        message: "Pod template must have spec",
      });
    } else {
      if (
        !resource.spec.template.spec.containers ||
        !Array.isArray(resource.spec.template.spec.containers)
      ) {
        errors.push({
          path: `${prefix}.spec.template.spec.containers`,
          message: "Pod spec must have containers array",
        });
      }
    }
  }
}

/**
 * Validates Kubernetes Service resource
 * @param resource - Service resource object
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateService(
  resource: any,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  if (!resource.spec) {
    errors.push({ path: `${prefix}.spec`, message: "Service must have spec" });
    return;
  }

  if (!resource.spec.selector || typeof resource.spec.selector !== "object") {
    errors.push({
      path: `${prefix}.spec.selector`,
      message: "Service must have selector",
    });
  }

  if (!resource.spec.ports || !Array.isArray(resource.spec.ports)) {
    errors.push({
      path: `${prefix}.spec.ports`,
      message: "Service must have ports array",
    });
  }
}

/**
 * Validates Kubernetes ConfigMap resource
 * @param resource - ConfigMap resource object
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateConfigMap(
  resource: any,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  if (!resource.data && !resource.binaryData) {
    warnings.push({
      path: `${prefix}`,
      message: "ConfigMap should have data or binaryData",
    });
  }
}

/**
 * Validates Kubernetes Secret resource
 * @param resource - Secret resource object
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateSecret(
  resource: any,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  if (!resource.data && !resource.stringData) {
    warnings.push({
      path: `${prefix}`,
      message: "Secret should have data or stringData",
    });
  }
}

/**
 * Validates Kubernetes Ingress resource
 * @param resource - Ingress resource object
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validateIngress(
  resource: any,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  if (!resource.spec) {
    errors.push({ path: `${prefix}.spec`, message: "Ingress must have spec" });
    return;
  }

  if (
    !resource.spec.rules ||
    !Array.isArray(resource.spec.rules) ||
    resource.spec.rules.length === 0
  ) {
    errors.push({
      path: `${prefix}.spec.rules`,
      message: "Ingress must have at least one rule",
    });
  }
}

/**
 * Validates Kubernetes Pod resource
 * @param resource - Pod resource object
 * @param prefix - Path prefix for error messages
 * @param errors - Array to collect validation errors
 * @param warnings - Array to collect validation warnings
 */
function _validatePod(
  resource: any,
  prefix: string,
  errors: Array<{ path: string; message: string }>,
  warnings: Array<{ path: string; message: string }>,
): void {
  if (!resource.spec) {
    errors.push({ path: `${prefix}.spec`, message: "Pod must have spec" });
    return;
  }

  if (
    !resource.spec.containers ||
    !Array.isArray(resource.spec.containers) ||
    resource.spec.containers.length === 0
  ) {
    errors.push({
      path: `${prefix}.spec.containers`,
      message: "Pod must have at least one container",
    });
  }
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
 * Extracts unique resource types (kinds) from Kubernetes manifest
 * @param manifest - Kubernetes manifest object or YAML string
 * @returns Array of unique resource kind strings
 */
export function extractResourceTypes(manifest: object | string): string[] {
  const manifestObj =
    typeof manifest === "string" ? _parseYAML(manifest) : manifest;
  const manifests = Array.isArray(manifestObj) ? manifestObj : [manifestObj];
  const types = new Set<string>();

  manifests.forEach((resource) => {
    if (resource.kind) {
      types.add(resource.kind);
    }
  });

  return Array.from(types);
}
