/**
 * Changelog generator utilities
 */

export type ChangelogEntryType =
  | "added"
  | "changed"
  | "deprecated"
  | "removed"
  | "fixed"
  | "security";

export interface ChangelogEntry {
  type: ChangelogEntryType;
  description: string;
  scope?: string;
  breaking?: boolean;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  entries: ChangelogEntry[];
  yanked?: boolean;
}

export interface ChangelogOptions {
  title?: string;
  description?: string;
  versions?: ChangelogVersion[];
  format?: "keepachangelog" | "simple";
}

/**
 * Generates changelog content in Keep a Changelog format
 * @param options - Changelog options (title, description, versions, format)
 * @returns Complete changelog markdown content
 */
export function generateChangelog(options: ChangelogOptions = {}): string {
  const {
    title = "Changelog",
    description = "All notable changes to this project will be documented in this file.",
    versions = [],
    format = "keepachangelog",
  } = options;

  const sections: string[] = [];

  sections.push(`# ${title}`);
  sections.push("");
  sections.push(description);
  sections.push("");
  sections.push(
    "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),",
  );
  sections.push(
    "and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
  );
  sections.push("");

  if (versions.length === 0) {
    sections.push("## [Unreleased]");
    sections.push("");
    sections.push("### Added");
    sections.push("- Initial release");
    sections.push("");
    return sections.join("\n");
  }

  versions.forEach((version, index) => {
    const isLatest = index === 0;
    const versionHeader = version.yanked
      ? `## [${version.version}] - ${version.date} [YANKED]`
      : `## [${version.version}] - ${version.date}`;

    sections.push(versionHeader);
    sections.push("");

    const grouped = _groupEntriesByType(version.entries);

    if (grouped.added.length > 0) {
      sections.push("### Added");
      grouped.added.forEach((entry) => {
        const breaking = entry.breaking ? " **[BREAKING]**" : "";
        const scope = entry.scope ? ` **${entry.scope}:**` : "";
        sections.push(`-${scope} ${entry.description}${breaking}`);
      });
      sections.push("");
    }

    if (grouped.changed.length > 0) {
      sections.push("### Changed");
      grouped.changed.forEach((entry) => {
        const breaking = entry.breaking ? " **[BREAKING]**" : "";
        const scope = entry.scope ? ` **${entry.scope}:**` : "";
        sections.push(`-${scope} ${entry.description}${breaking}`);
      });
      sections.push("");
    }

    if (grouped.deprecated.length > 0) {
      sections.push("### Deprecated");
      grouped.deprecated.forEach((entry) => {
        const scope = entry.scope ? ` **${entry.scope}:**` : "";
        sections.push(`-${scope} ${entry.description}`);
      });
      sections.push("");
    }

    if (grouped.removed.length > 0) {
      sections.push("### Removed");
      grouped.removed.forEach((entry) => {
        const breaking = entry.breaking ? " **[BREAKING]**" : "";
        const scope = entry.scope ? ` **${entry.scope}:**` : "";
        sections.push(`-${scope} ${entry.description}${breaking}`);
      });
      sections.push("");
    }

    if (grouped.fixed.length > 0) {
      sections.push("### Fixed");
      grouped.fixed.forEach((entry) => {
        const scope = entry.scope ? ` **${entry.scope}:**` : "";
        sections.push(`-${scope} ${entry.description}`);
      });
      sections.push("");
    }

    if (grouped.security.length > 0) {
      sections.push("### Security");
      grouped.security.forEach((entry) => {
        const scope = entry.scope ? ` **${entry.scope}:**` : "";
        sections.push(`-${scope} ${entry.description}`);
      });
      sections.push("");
    }
  });

  sections.push("## [Unreleased]");
  sections.push("");
  sections.push("### Added");
  sections.push("");
  sections.push("### Changed");
  sections.push("");
  sections.push("### Fixed");
  sections.push("");

  if (versions.length > 0) {
    sections.push(
      "[Unreleased]: https://github.com/yourusername/yourrepo/compare/v1.0.0...HEAD",
    );
    versions.forEach((version, index) => {
      const previousVersion = versions[index + 1];
      if (previousVersion) {
        sections.push(
          `[${version.version}]: https://github.com/yourusername/yourrepo/compare/v${previousVersion.version}...v${version.version}`,
        );
      } else {
        sections.push(
          `[${version.version}]: https://github.com/yourusername/yourrepo/releases/tag/v${version.version}`,
        );
      }
    });
  }

  return sections.join("\n");
}

/**
 * Groups changelog entries by their type
 * @param entries - Array of changelog entries
 * @returns Object mapping entry types to arrays of entries
 */
function _groupEntriesByType(
  entries: ChangelogEntry[],
): Record<ChangelogEntryType, ChangelogEntry[]> {
  return {
    added: entries.filter((e) => e.type === "added"),
    changed: entries.filter((e) => e.type === "changed"),
    deprecated: entries.filter((e) => e.type === "deprecated"),
    removed: entries.filter((e) => e.type === "removed"),
    fixed: entries.filter((e) => e.type === "fixed"),
    security: entries.filter((e) => e.type === "security"),
  };
}

/**
 * Parses conventional commit messages into changelog entries
 * @param commitMessages - Array of conventional commit message strings
 * @returns Array of changelog entry objects
 */
export function parseCommitsToChangelog(
  commitMessages: string[],
): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];

  commitMessages.forEach((message) => {
    const match = message.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);

    if (!match) return;

    const [, type, scope, breaking, description] = match;

    let changelogType: ChangelogEntryType = "added";
    if (!type) {
      changelogType = "changed";
    } else {
      switch (type.toLowerCase()) {
        case "feat":
          changelogType = "added";
          break;
        case "fix":
          changelogType = "fixed";
          break;
        case "perf":
        case "refactor":
          changelogType = "changed";
          break;
        case "deprecate":
          changelogType = "deprecated";
          break;
        case "remove":
          changelogType = "removed";
          break;
        case "security":
          changelogType = "security";
          break;
      }
    }

    entries.push({
      type: changelogType,
      description: description || "",
      scope: scope || undefined,
      breaking: !!breaking,
    });
  });

  return entries;
}

/**
 * Creates changelog version object from version string and entries
 * @param version - Version string (e.g., "1.0.0")
 * @param entries - Array of changelog entries
 * @param date - Release date string (defaults to today's date in ISO format)
 * @returns Changelog version object
 */
export function createChangelogVersion(
  version: string,
  entries: ChangelogEntry[],
  date?: string,
): ChangelogVersion {
  return {
    version: version || "0.0.0",
    date: date ?? new Date().toISOString().split("T")[0] ?? "",
    entries,
  };
}
