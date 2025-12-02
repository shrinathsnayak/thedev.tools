/**
 * package.json formatter and validator
 * Uses 'sort-package-json' package for sorting
 */

import sortPackageJson from "sort-package-json";

export interface PackageJsonFormatOptions {
  sortDependencies?: boolean;
  sortScripts?: boolean;
  indent?: number;
  removeComments?: boolean;
}

export interface PackageJsonValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Formats package.json content with sorting and indentation options
 * @param content - The package.json content as string or object
 * @param options - Formatting options (sort dependencies, sort scripts, indent)
 * @returns Formatted package.json string
 * @throws Error if content is invalid JSON
 */
export function formatPackageJson(
  content: string | object,
  options: PackageJsonFormatOptions = {},
): string {
  let packageJson: any;

  if (typeof content === "string") {
    try {
      packageJson = JSON.parse(content);
    } catch (error) {
      throw new Error(`Invalid JSON: ${(error as Error).message}`);
    }
  } else {
    packageJson = content;
  }

  if (options.sortDependencies || options.sortScripts) {
    packageJson = sortPackageJson(packageJson);
  }

  const indent = options.indent ?? 2;
  return JSON.stringify(packageJson, null, indent);
}

/**
 * Validates package.json structure and checks for common issues
 * @param content - The package.json content as string or object
 * @returns Validation result with errors and warnings
 */
export function validatePackageJson(
  content: string | object,
): PackageJsonValidationResult {
  const result: PackageJsonValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  let packageJson: any;

  if (typeof content === "string") {
    try {
      packageJson = JSON.parse(content);
    } catch (error) {
      result.isValid = false;
      result.errors.push({
        field: "root",
        message: `Invalid JSON: ${(error as Error).message}`,
      });
      return result;
    }
  } else {
    packageJson = content;
  }

  if (!packageJson.name) {
    result.errors.push({
      field: "name",
      message: "Missing required field: name",
    });
    result.isValid = false;
  } else if (typeof packageJson.name !== "string") {
    result.errors.push({
      field: "name",
      message: "Field 'name' must be a string",
    });
    result.isValid = false;
  }

  if (!packageJson.version) {
    result.errors.push({
      field: "version",
      message: "Missing required field: version",
    });
    result.isValid = false;
  } else if (!/^\d+\.\d+\.\d+/.test(packageJson.version)) {
    result.warnings.push({
      field: "version",
      message: "Version should follow semantic versioning (x.y.z)",
    });
  }

  if (
    packageJson.name &&
    !/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(
      packageJson.name,
    )
  ) {
    result.errors.push({
      field: "name",
      message: "Invalid package name format",
    });
    result.isValid = false;
  }

  const dependencyFields = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];

  dependencyFields.forEach((field) => {
    if (packageJson[field] && typeof packageJson[field] !== "object") {
      result.errors.push({
        field,
        message: `Field '${field}' must be an object`,
      });
      result.isValid = false;
    }
  });

  if (packageJson.main && packageJson.module) {
    result.warnings.push({
      field: "main",
      message:
        "Both 'main' and 'module' fields are present. Consider using 'exports' field instead.",
    });
  }

  if (packageJson.scripts) {
    const commonScripts = ["start", "test", "build"];
    const missingScripts = commonScripts.filter(
      (script) => !packageJson.scripts[script],
    );
    if (missingScripts.length > 0) {
      result.warnings.push({
        field: "scripts",
        message: `Common scripts missing: ${missingScripts.join(", ")}`,
      });
    }
  }

  return result;
}

/**
 * Sorts object keys alphabetically
 * @param obj - The object to sort
 * @returns New object with sorted keys
 */
function _sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

/**
 * Extracts all dependencies from package.json grouped by type
 * @param packageJson - The package.json content as string or object
 * @returns Object containing arrays of dependencies by type (dependencies, devDependencies, etc.)
 */
export function extractDependencies(packageJson: string | object): {
  dependencies: Array<{ name: string; version: string }>;
  devDependencies: Array<{ name: string; version: string }>;
  peerDependencies: Array<{ name: string; version: string }>;
  optionalDependencies: Array<{ name: string; version: string }>;
} {
  let pkg: any;

  if (typeof packageJson === "string") {
    pkg = JSON.parse(packageJson);
  } else {
    pkg = packageJson;
  }

  const _extract = (deps: Record<string, string> | undefined) => {
    if (!deps) return [];
    return Object.entries(deps).map(([name, version]) => ({
      name,
      version,
    }));
  };

  return {
    dependencies: _extract(pkg.dependencies),
    devDependencies: _extract(pkg.devDependencies),
    peerDependencies: _extract(pkg.peerDependencies),
    optionalDependencies: _extract(pkg.optionalDependencies),
  };
}

/**
 * Compares two package.json files and returns differences in dependencies
 * @param pkg1 - First package.json content as string or object
 * @param pkg2 - Second package.json content as string or object
 * @returns Object containing added, removed, and changed dependencies
 */
export function comparePackageJson(
  pkg1: string | object,
  pkg2: string | object,
): {
  added: Array<{ name: string; version: string; field: string }>;
  removed: Array<{ name: string; version: string; field: string }>;
  changed: Array<{
    name: string;
    oldVersion: string;
    newVersion: string;
    field: string;
  }>;
} {
  const _parse = (pkg: string | object): any => {
    return typeof pkg === "string" ? JSON.parse(pkg) : pkg;
  };

  const pkg1Parsed = _parse(pkg1);
  const pkg2Parsed = _parse(pkg2);

  const fields = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];

  const added: Array<{ name: string; version: string; field: string }> = [];
  const removed: Array<{ name: string; version: string; field: string }> = [];
  const changed: Array<{
    name: string;
    oldVersion: string;
    newVersion: string;
    field: string;
  }> = [];

  fields.forEach((field) => {
    const deps1 = pkg1Parsed[field] || {};
    const deps2 = pkg2Parsed[field] || {};

    const allKeys = new Set([...Object.keys(deps1), ...Object.keys(deps2)]);

    allKeys.forEach((key) => {
      const v1 = deps1[key];
      const v2 = deps2[key];

      if (v1 && !v2) {
        removed.push({ name: key, version: v1, field });
      } else if (!v1 && v2) {
        added.push({ name: key, version: v2, field });
      } else if (v1 && v2 && v1 !== v2) {
        changed.push({
          name: key,
          oldVersion: v1,
          newVersion: v2,
          field,
        });
      }
    });
  });

  return { added, removed, changed };
}
