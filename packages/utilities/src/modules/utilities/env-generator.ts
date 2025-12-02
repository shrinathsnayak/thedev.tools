/**
 * Environment Variable Generator
 * Generates .env files with common templates
 */

import type { EnvVariable, EnvTemplate } from "@workspace/types/env";
import { ENV_TEMPLATES } from "@workspace/constants/env";

// Re-export for backward compatibility
export type { EnvVariable, EnvTemplate } from "@workspace/types/env";
export { ENV_TEMPLATES } from "@workspace/constants/env";

/**
 * Generates .env file content from variables
 */
export function generateEnvFile(
  variables: EnvVariable[],
  includeComments: boolean = true,
): string {
  const lines: string[] = [];

  for (const variable of variables) {
    if (includeComments && variable.comment) {
      lines.push(`# ${variable.comment}`);
    }

    const value = variable.value || (variable.required ? "<REQUIRED>" : "");
    lines.push(`${variable.key}=${value}`);
    lines.push(""); // Empty line
  }

  return lines.join("\n").trim();
}

/**
 * Gets template by name
 */
export function getEnvTemplate(name: string): EnvTemplate | null {
  return ENV_TEMPLATES[name] || null;
}

/**
 * Gets all available templates
 */
export function getAllEnvTemplates(): EnvTemplate[] {
  return Object.values(ENV_TEMPLATES);
}

/**
 * Parses .env file content
 */
export function parseEnvFile(content: string): EnvVariable[] {
  const variables: EnvVariable[] = [];
  const lines = content.split("\n");
  let currentComment: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Comment line
    if (trimmed.startsWith("#")) {
      currentComment = trimmed.slice(1).trim();
      continue;
    }

    // Variable line
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match && match[1] && match[2] !== undefined) {
      variables.push({
        key: match[1].trim(),
        value: match[2].trim(),
        comment: currentComment,
      });
      currentComment = undefined;
    }
  }

  return variables;
}

/**
 * Validates .env file format
 */
export function validateEnvFile(content: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const lines = content.split("\n");
  const keys = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() || "";
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^([^=]+)=(.*)$/);
    if (!match) {
      errors.push(`Line ${i + 1}: Invalid format`);
      continue;
    }

    const key = match[1]?.trim();
    if (!key) {
      errors.push(`Line ${i + 1}: Empty key`);
      continue;
    }

    if (keys.has(key)) {
      errors.push(`Line ${i + 1}: Duplicate key '${key}'`);
    }
    keys.add(key);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
