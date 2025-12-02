/**
 * Dependency analyzer utilities
 */

export interface DependencyInfo {
  name: string;
  version: string;
  latestVersion?: string;
  isOutdated: boolean;
  isDev: boolean;
  type:
    | "dependency"
    | "devDependency"
    | "peerDependency"
    | "optionalDependency";
}

export interface PackageJsonAnalysis {
  name: string;
  version: string;
  dependencies: DependencyInfo[];
  devDependencies: DependencyInfo[];
  peerDependencies: DependencyInfo[];
  optionalDependencies: DependencyInfo[];
  totalDependencies: number;
  outdatedCount: number;
  hasSecurityIssues?: boolean;
}

export interface PackageJsonData {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

/**
 * Analyzes package.json dependencies and provides detailed information
 * @param packageJson - Package.json object or JSON string
 * @returns Analysis results with dependency breakdown and statistics
 */
export function analyzeDependencies(
  packageJson: PackageJsonData | string,
): PackageJsonAnalysis {
  const data: PackageJsonData =
    typeof packageJson === "string" ? JSON.parse(packageJson) : packageJson;

  const dependencies = _parseDependencies(data.dependencies || {}, "dependency");
  const devDependencies = _parseDependencies(
    data.devDependencies || {},
    "devDependency",
  );
  const peerDependencies = _parseDependencies(
    data.peerDependencies || {},
    "peerDependency",
  );
  const optionalDependencies = _parseDependencies(
    data.optionalDependencies || {},
    "optionalDependency",
  );

  const allDependencies = [
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
    ...optionalDependencies,
  ];

  const outdatedCount = allDependencies.filter((d) => d.isOutdated).length;

  return {
    name: data.name || "unknown",
    version: data.version || "0.0.0",
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    totalDependencies: allDependencies.length,
    outdatedCount,
  };
}

/**
 * Parses dependency object into DependencyInfo array
 * @param deps - Dependency object mapping names to versions
 * @param type - Dependency type (dependency, devDependency, etc.)
 * @returns Array of DependencyInfo objects
 */
function _parseDependencies(
  deps: Record<string, string>,
  type: DependencyInfo["type"],
): DependencyInfo[] {
  return Object.entries(deps).map(([name, version]) => {
    const cleanVersion = version.replace(/^[\^~]/, "");
    const isOutdated = _checkIfOutdated(version);

    return {
      name,
      version: cleanVersion,
      isOutdated,
      isDev: type === "devDependency",
      type,
    };
  });
}

/**
 * Checks if version range indicates outdated dependency (simplified check)
 * @param version - Version string to check
 * @returns True if version uses range operators indicating potential updates
 */
function _checkIfOutdated(version: string): boolean {
  if (version.startsWith("^") || version.startsWith("~")) {
    return true;
  }
  if (version === "*" || version === "latest") {
    return true;
  }
  return false;
}

/**
 * Extracts unique dependency names across all dependency types
 * @param packageJson - Package.json object or JSON string
 * @returns Sorted array of unique dependency names
 */
export function getUniqueDependencies(
  packageJson: PackageJsonData | string,
): string[] {
  const data: PackageJsonData =
    typeof packageJson === "string" ? JSON.parse(packageJson) : packageJson;

  const allDeps = new Set<string>();

  Object.keys(data.dependencies || {}).forEach((dep) => allDeps.add(dep));
  Object.keys(data.devDependencies || {}).forEach((dep) => allDeps.add(dep));
  Object.keys(data.peerDependencies || {}).forEach((dep) => allDeps.add(dep));
  Object.keys(data.optionalDependencies || {}).forEach((dep) =>
    allDeps.add(dep),
  );

  return Array.from(allDeps).sort();
}

/**
 * Finds dependencies that appear in multiple dependency type sections
 * @param packageJson - Package.json object or JSON string
 * @returns Object mapping dependency names to arrays of their locations
 */
export function findDuplicateDependencies(
  packageJson: PackageJsonData | string,
): Record<string, string[]> {
  const data: PackageJsonData =
    typeof packageJson === "string" ? JSON.parse(packageJson) : packageJson;

  const locations: Record<string, string[]> = {};

  const checkDeps = (
    deps: Record<string, string> | undefined,
    type: string,
  ) => {
    if (!deps) return;
    Object.keys(deps).forEach((name) => {
      if (!locations[name]) {
        locations[name] = [];
      }
      locations[name].push(type);
    });
  };

  checkDeps(data.dependencies, "dependencies");
  checkDeps(data.devDependencies, "devDependencies");
  checkDeps(data.peerDependencies, "peerDependencies");
  checkDeps(data.optionalDependencies, "optionalDependencies");

  const duplicates: Record<string, string[]> = {};
  Object.entries(locations).forEach(([name, types]) => {
    if (types.length > 1) {
      duplicates[name] = types;
    }
  });

  return duplicates;
}

/**
 * Validates dependency version formats in package.json
 * @param packageJson - Package.json object or JSON string
 * @returns Validation result with errors for invalid version formats
 */
export function validateDependencyVersions(
  packageJson: PackageJsonData | string,
): {
  valid: boolean;
  errors: Array<{ name: string; version: string; error: string }>;
} {
  const data: PackageJsonData =
    typeof packageJson === "string" ? JSON.parse(packageJson) : packageJson;

  const errors: Array<{ name: string; version: string; error: string }> = [];

  const validateDeps = (deps: Record<string, string> | undefined) => {
    if (!deps) return;
    Object.entries(deps).forEach(([name, version]) => {
      if (
        version &&
        !version.match(/^[\^~]?[\d.x*+-]+|^latest$|^file:|^git:|^http/) &&
        version !== "*"
      ) {
        errors.push({
          name,
          version,
          error: "Invalid version format",
        });
      }
    });
  };

  validateDeps(data.dependencies);
  validateDeps(data.devDependencies);
  validateDeps(data.peerDependencies);
  validateDeps(data.optionalDependencies);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gets dependency statistics from package.json
 * @param packageJson - Package.json object or JSON string
 * @returns Statistics object with counts by dependency type
 */
export function getDependencyStats(packageJson: PackageJsonData | string): {
  total: number;
  dependencies: number;
  devDependencies: number;
  peerDependencies: number;
  optionalDependencies: number;
  byType: Record<string, number>;
} {
  const analysis = analyzeDependencies(packageJson);

  return {
    total: analysis.totalDependencies,
    dependencies: analysis.dependencies.length,
    devDependencies: analysis.devDependencies.length,
    peerDependencies: analysis.peerDependencies.length,
    optionalDependencies: analysis.optionalDependencies.length,
    byType: {
      dependencies: analysis.dependencies.length,
      devDependencies: analysis.devDependencies.length,
      peerDependencies: analysis.peerDependencies.length,
      optionalDependencies: analysis.optionalDependencies.length,
    },
  };
}
