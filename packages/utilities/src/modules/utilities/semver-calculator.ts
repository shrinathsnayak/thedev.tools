/**
 * Semantic version (semver) calculation and comparison utilities
 */

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
}

export interface VersionComparison {
  version1: string;
  version2: string;
  result: "greater" | "equal" | "less";
  difference: string;
}

/**
 * Parses semantic version string
 * @param version - Version string (e.g., "1.2.3", "1.2.3-alpha.1", "1.2.3+build.1")
 * @returns Parsed version object
 */
export function parseSemVer(version: string): SemVer | null {
  const cleanVersion = version.replace(/^v/i, "").trim();

  const match = cleanVersion.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?(?:\+([\w.-]+))?$/,
  );

  if (!match) {
    return null;
  }

  if (!match[1] || !match[2] || !match[3]) {
    return null;
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || undefined,
    build: match[5] || undefined,
  };
}

/**
 * Validates semantic version string
 * @param version - Version string to validate
 * @returns True if valid semver
 */
export function isValidSemVer(version: string): boolean {
  return parseSemVer(version) !== null;
}

/**
 * Compares two semantic versions
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison result: 1 if v1 > v2, 0 if equal, -1 if v1 < v2
 */
export function compareSemVer(version1: string, version2: string): number {
  const v1 = parseSemVer(version1);
  const v2 = parseSemVer(version2);

  if (!v1 || !v2) {
    throw new Error("Invalid semantic version");
  }

  if (v1.major !== v2.major) {
    return v1.major > v2.major ? 1 : -1;
  }

  if (v1.minor !== v2.minor) {
    return v1.minor > v2.minor ? 1 : -1;
  }

  if (v1.patch !== v2.patch) {
    return v1.patch > v2.patch ? 1 : -1;
  }

  if (!v1.prerelease && !v2.prerelease) {
    return 0;
  }
  if (!v1.prerelease) {
    return 1;
  }
  if (!v2.prerelease) {
    return -1;
  }

  if (v1.prerelease < v2.prerelease) return -1;
  if (v1.prerelease > v2.prerelease) return 1;

  return 0;
}

/**
 * Gets detailed version comparison
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison details
 */
export function compareVersions(
  version1: string,
  version2: string,
): VersionComparison {
  const comparison = compareSemVer(version1, version2);

  let result: "greater" | "equal" | "less";
  let difference: string;

  if (comparison > 0) {
    result = "greater";
    difference = `${version1} is newer than ${version2}`;
  } else if (comparison < 0) {
    result = "less";
    difference = `${version1} is older than ${version2}`;
  } else {
    result = "equal";
    difference = `${version1} and ${version2} are the same version`;
  }

  return {
    version1,
    version2,
    result,
    difference,
  };
}

/**
 * Calculates next version
 * @param currentVersion - Current version string
 * @param type - Bump type: "major", "minor", or "patch"
 * @returns Next version string
 */
export function calculateNextVersion(
  currentVersion: string,
  type: "major" | "minor" | "patch",
): string {
  const version = parseSemVer(currentVersion);
  if (!version) {
    throw new Error("Invalid semantic version");
  }

  let nextVersion: SemVer;

  switch (type) {
    case "major":
      nextVersion = {
        major: version.major + 1,
        minor: 0,
        patch: 0,
      };
      break;
    case "minor":
      nextVersion = {
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
      };
      break;
    case "patch":
      nextVersion = {
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
      };
      break;
  }

  return formatSemVer(nextVersion);
}

/**
 * Formats SemVer object to string
 * @param version - SemVer object
 * @returns Version string
 */
export function formatSemVer(version: SemVer): string {
  let result = `${version.major}.${version.minor}.${version.patch}`;

  if (version.prerelease) {
    result += `-${version.prerelease}`;
  }

  if (version.build) {
    result += `+${version.build}`;
  }

  return result;
}

/**
 * Checks if version satisfies a range (simplified - supports basic operators)
 * @param version - Version to check
 * @param range - Version range (e.g., ">=1.2.0", "^1.2.0", "~1.2.0")
 * @returns True if version satisfies range
 */
export function satisfiesVersion(version: string, range: string): boolean {
  const v = parseSemVer(version);
  if (!v) return false;

  const cleanRange = range.trim();

  if (cleanRange === version) return true;

  if (cleanRange.startsWith(">=")) {
    const minVersion = cleanRange.substring(2).trim();
    return compareSemVer(version, minVersion) >= 0;
  }

  if (cleanRange.startsWith("<=")) {
    const maxVersion = cleanRange.substring(2).trim();
    return compareSemVer(version, maxVersion) <= 0;
  }

  if (cleanRange.startsWith(">")) {
    const minVersion = cleanRange.substring(1).trim();
    return compareSemVer(version, minVersion) > 0;
  }

  if (cleanRange.startsWith("<")) {
    const maxVersion = cleanRange.substring(1).trim();
    return compareSemVer(version, maxVersion) < 0;
  }

  if (cleanRange.startsWith("^")) {
    const baseVersion = parseSemVer(cleanRange.substring(1).trim());
    if (!baseVersion) return false;

    return (
      v.major === baseVersion.major &&
      compareSemVer(version, formatSemVer(baseVersion)) >= 0
    );
  }

  if (cleanRange.startsWith("~")) {
    const baseVersion = parseSemVer(cleanRange.substring(1).trim());
    if (!baseVersion) return false;

    return (
      v.major === baseVersion.major &&
      v.minor === baseVersion.minor &&
      compareSemVer(version, formatSemVer(baseVersion)) >= 0
    );
  }

  return version === cleanRange;
}

/**
 * Gets version difference description
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Human-readable difference description
 */
export function getVersionDifference(
  version1: string,
  version2: string,
): string {
  const v1 = parseSemVer(version1);
  const v2 = parseSemVer(version2);

  if (!v1 || !v2) {
    return "Invalid version(s)";
  }

  if (v1.major !== v2.major) {
    return `Major version difference: ${v1.major} → ${v2.major}`;
  }
  if (v1.minor !== v2.minor) {
    return `Minor version difference: ${v1.minor} → ${v2.minor}`;
  }
  if (v1.patch !== v2.patch) {
    return `Patch version difference: ${v1.patch} → ${v2.patch}`;
  }

  if (v1.prerelease !== v2.prerelease) {
    return `Prerelease difference: ${v1.prerelease || "stable"} → ${v2.prerelease || "stable"}`;
  }

  return "No difference";
}
