/**
 * .gitignore formatter and validator
 * Uses 'parse-gitignore' package for parsing
 */

import parseGitignore from "parse-gitignore";

export interface GitignoreFormatOptions {
  sort?: boolean;
  removeDuplicates?: boolean;
  removeEmpty?: boolean;
  groupByType?: boolean;
}

export interface GitignoreEntry {
  pattern: string;
  type: "pattern" | "comment" | "blank" | "negation";
  line: number;
}

/**
 * Parses .gitignore file content and returns structured entries
 * @param content - The .gitignore file content string to parse
 * @returns Array of gitignore entries with pattern, type, and line number
 */
export function parseGitignoreFile(content: string): GitignoreEntry[] {
  const lines = content.split("\n");
  const entries: GitignoreEntry[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineNumber = index + 1;

    if (!trimmed) {
      entries.push({
        pattern: "",
        type: "blank",
        line: lineNumber,
      });
      return;
    }

    if (trimmed.startsWith("#")) {
      entries.push({
        pattern: trimmed,
        type: "comment",
        line: lineNumber,
      });
      return;
    }

    if (trimmed.startsWith("!")) {
      entries.push({
        pattern: trimmed,
        type: "negation",
        line: lineNumber,
      });
      return;
    }

    entries.push({
      pattern: trimmed,
      type: "pattern",
      line: lineNumber,
    });
  });

  return entries;
}

/**
 * Formats .gitignore file content with customizable options
 * @param content - The .gitignore file content string to format
 * @param options - Formatting options (sort, remove duplicates, group by type, etc.)
 * @returns Formatted .gitignore file content string
 */
export function formatGitignore(
  content: string,
  options: GitignoreFormatOptions = {},
): string {
  let entries: GitignoreEntry[];
  try {
    const parsed = parseGitignore(content);
    entries = (Array.isArray(parsed) ? parsed : []).map(
      (line: string, index: number) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return { pattern: "", type: "blank" as const, line: index + 1 };
        }
        if (trimmed.startsWith("#")) {
          return {
            pattern: trimmed,
            type: "comment" as const,
            line: index + 1,
          };
        }
        if (trimmed.startsWith("!")) {
          return {
            pattern: trimmed,
            type: "negation" as const,
            line: index + 1,
          };
        }
        return { pattern: trimmed, type: "pattern" as const, line: index + 1 };
      },
    );
  } catch (error) {
    entries = content
      .split("\n")
      .map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          return {
            pattern: trimmed,
            type: "comment" as const,
            line: index + 1,
          };
        }
        if (trimmed.startsWith("!")) {
          return {
            pattern: trimmed,
            type: "negation" as const,
            line: index + 1,
          };
        }
        return { pattern: trimmed, type: "pattern" as const, line: index + 1 };
      })
      .filter((entry) => entry.pattern);
  }

  if (options.removeDuplicates) {
    const seen = new Set<string>();
    entries = entries.filter((entry) => {
      if (entry.type === "blank") return true;
      if (seen.has(entry.pattern)) {
        return false;
      }
      seen.add(entry.pattern);
      return true;
    });
  }

  if (options.removeEmpty) {
    entries = entries.filter((entry) => entry.type !== "blank");
  }

  if (options.sort) {
    entries.sort((a, b) => {
      if (a.type === "comment" && b.type !== "comment") return -1;
      if (a.type !== "comment" && b.type === "comment") return 1;

      const typeOrder = { comment: 0, pattern: 1, negation: 2, blank: 3 };
      const typeDiff = typeOrder[a.type] - typeOrder[b.type];
      if (typeDiff !== 0) return typeDiff;

      return a.pattern.localeCompare(b.pattern);
    });
  }

  if (options.groupByType) {
    const grouped: Record<string, GitignoreEntry[]> = {
      comments: [],
      patterns: [],
      negations: [],
      blanks: [],
    };

    entries.forEach((entry) => {
      if (entry.type === "comment") {
        grouped.comments?.push(entry);
      } else if (entry.type === "negation") {
        grouped.negations?.push(entry);
      } else if (entry.type === "pattern") {
        grouped.patterns?.push(entry);
      } else {
        grouped.blanks?.push(entry);
      }
    });

    const sections: string[] = [];
    if (grouped.comments && grouped.comments.length > 0) {
      sections.push(grouped.comments.map((e) => e.pattern).join("\n"));
    }
    if (grouped.patterns && grouped.patterns.length > 0) {
      sections.push(grouped.patterns.map((e) => e.pattern).join("\n"));
    }
    if (grouped.negations && grouped.negations.length > 0) {
      sections.push(grouped.negations.map((e) => e.pattern).join("\n"));
    }

    return sections.join("\n\n");
  }

  return entries.map((entry) => entry.pattern).join("\n");
}

/**
 * Validates .gitignore file content and checks for common pattern issues
 * @param content - The .gitignore file content string to validate
 * @returns Validation result with errors and warnings
 */
export function validateGitignore(content: string): {
  isValid: boolean;
  errors: Array<{
    line: number;
    pattern: string;
    message: string;
  }>;
  warnings: Array<{
    line: number;
    pattern: string;
    message: string;
  }>;
} {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
  } as {
    isValid: boolean;
    errors: Array<{ line: number; pattern: string; message: string }>;
    warnings: Array<{ line: number; pattern: string; message: string }>;
  };

  try {
    parseGitignore(content);
  } catch (error) {
    result.errors.push({
      line: 0,
      pattern: "",
      message: `Parse error: ${(error as Error).message}`,
    });
    result.isValid = false;
    return result;
  }

  const entries = parseGitignoreFile(content);
  const seen = new Set<string>();

  entries.forEach((entry) => {
    if (entry.type === "blank" || entry.type === "comment") {
      return;
    }

    const pattern = entry.pattern;

    if (seen.has(pattern)) {
      result.warnings.push({
        line: entry.line,
        pattern,
        message: "Duplicate pattern",
      });
    } else {
      seen.add(pattern);
    }

    if (pattern.startsWith("!") && pattern.length === 1) {
      result.errors.push({
        line: entry.line,
        pattern,
        message: "Invalid negation: pattern cannot be just '!'",
      });
      result.isValid = false;
    }

    if (pattern.includes("**") && pattern.includes("*") && pattern !== "**") {
      result.warnings.push({
        line: entry.line,
        pattern,
        message: "Double wildcard '**' may be redundant",
      });
    }

    if (
      pattern.endsWith("/") &&
      !pattern.includes("*") &&
      !pattern.includes("?")
    ) {
      result.warnings.push({
        line: entry.line,
        pattern,
        message:
          "Trailing slash typically indicates a directory, verify this is intentional",
      });
    }
  });

  return result;
}

/**
 * Generates common .gitignore patterns for different project types
 * @param type - Project type (node, python, java, go)
 * @returns .gitignore file content string with common patterns for the specified type
 */
export function generateGitignore(type: string): string {
  const templates: Record<string, string> = {
    node: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db`,

    python: `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db`,

    java: `# Compiled class files
*.class

# Build outputs
target/
build/
*.jar
*.war

# IDE
.idea/
*.iml
.vscode/

# OS
.DS_Store
Thumbs.db`,

    go: `# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary
*.test

# Output
/bin/
/dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db`,
  };

  const template = templates[type.toLowerCase()];
  return (template ?? templates.node) as string;
}
