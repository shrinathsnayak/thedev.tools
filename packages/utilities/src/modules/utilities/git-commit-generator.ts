/**
 * Git commit message generator utilities
 */

import type { CommitType, CommitMessage, CommitTemplate } from "@workspace/types/git";
import { COMMIT_TYPES } from "@workspace/constants/git";

// Re-export for backward compatibility
export type { CommitType, CommitMessage, CommitTemplate } from "@workspace/types/git";
export { COMMIT_TYPES } from "@workspace/constants/git";

/**
 * Generates conventional commit message
 * @param options - Commit message options
 * @returns Formatted commit message string
 */
export function generateCommitMessage(options: CommitMessage): string {
  const parts: string[] = [];

  // Type and scope
  let header = options.type;
  if (options.scope) {
    header += `(${options.scope})`;
  }
  if (options.breaking) {
    header += "!";
  }
  header += `: ${options.subject}`;
  parts.push(header);

  // Body
  if (options.body) {
    parts.push("");
    parts.push(options.body);
  }

  // Footer
  if (options.footer) {
    parts.push("");
    parts.push(options.footer);
  }

  if (options.breaking) {
    parts.push("");
    parts.push("BREAKING CHANGE: " + (options.body || options.subject));
  }

  return parts.join("\n");
}

/**
 * Validates commit message format
 * @param message - Commit message to validate
 * @returns Validation result
 */
export function validateCommitMessage(message: string): {
  isValid: boolean;
  error?: string;
  parsed?: CommitMessage;
} {
  const lines = message.trim().split("\n");
  const header = lines[0];

  if (!header) {
    return {
      isValid: false,
      error: "Invalid commit message format: missing header",
    };
  }

  // Check header format: type(scope): subject
  const headerMatch = header.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);

  if (!headerMatch || !headerMatch[1] || !headerMatch[4]) {
    return {
      isValid: false,
      error: "Invalid commit message format. Expected: type(scope): subject",
    };
  }

  const [, type, scope, breaking, subject] = headerMatch;

  // Validate type
  if (!type || !Object.keys(COMMIT_TYPES).includes(type)) {
    return {
      isValid: false,
      error: `Invalid commit type: ${type || "undefined"}`,
    };
  }

  // Parse body and footer
  let body: string | undefined;
  let footer: string | undefined;
  const bodyLines: string[] = [];
  const footerLines: string[] = [];
  let inFooter = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.trim() === "") {
      if (bodyLines.length > 0 && !inFooter) {
        inFooter = true;
      }
      continue;
    }

    if (inFooter || line.startsWith("BREAKING CHANGE:")) {
      footerLines.push(line);
    } else {
      bodyLines.push(line);
    }
  }

  if (bodyLines.length > 0) {
    body = bodyLines.join("\n");
  }

  if (footerLines.length > 0) {
    footer = footerLines.join("\n");
  }

  const parsed: CommitMessage = {
    type: type as CommitType,
    scope: scope || undefined,
    subject: subject || "",
    body,
    footer,
    breaking: !!breaking,
  };

  return {
    isValid: true,
    parsed,
  };
}

/**
 * Parses commit message into structured format
 * @param message - Commit message string
 * @returns Parsed commit message object
 */
export function parseCommitMessage(message: string): CommitMessage | null {
  const validation = validateCommitMessage(message);
  return validation.isValid ? validation.parsed || null : null;
}

/**
 * Gets suggested commit message based on git diff (simplified)
 * @param changes - Description of changes
 * @returns Suggested commit message
 */
export function suggestCommitMessage(changes: string): CommitMessage {
  const lowerChanges = changes.toLowerCase();

  // Simple heuristic-based suggestions
  let type: CommitType = "chore";
  let subject = "update code";

  if (
    lowerChanges.includes("fix") ||
    lowerChanges.includes("bug") ||
    lowerChanges.includes("error")
  ) {
    type = "fix";
    subject = "fix issue";
  } else if (
    lowerChanges.includes("feature") ||
    lowerChanges.includes("add") ||
    lowerChanges.includes("new")
  ) {
    type = "feat";
    subject = "add feature";
  } else if (
    lowerChanges.includes("refactor") ||
    lowerChanges.includes("restructure")
  ) {
    type = "refactor";
    subject = "refactor code";
  } else if (lowerChanges.includes("test") || lowerChanges.includes("spec")) {
    type = "test";
    subject = "add tests";
  } else if (lowerChanges.includes("doc") || lowerChanges.includes("readme")) {
    type = "docs";
    subject = "update documentation";
  } else if (
    lowerChanges.includes("style") ||
    lowerChanges.includes("format")
  ) {
    type = "style";
    subject = "format code";
  } else if (
    lowerChanges.includes("perf") ||
    lowerChanges.includes("performance") ||
    lowerChanges.includes("optimize")
  ) {
    type = "perf";
    subject = "improve performance";
  }

  return {
    type,
    subject,
  };
}

/**
 * Gets all available commit types
 * @returns Array of commit type templates
 */
export function getCommitTypes(): CommitTemplate[] {
  return Object.values(COMMIT_TYPES);
}
