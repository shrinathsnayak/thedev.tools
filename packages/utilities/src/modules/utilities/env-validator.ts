/**
 * Environment variable validator utilities
 */

export interface EnvVariable {
  key: string;
  value: string;
  comment?: string;
  required?: boolean;
}

export interface EnvValidationResult {
  valid: boolean;
  errors: Array<{ key?: string; line?: number; error: string }>;
  warnings: Array<{ key?: string; line?: number; warning: string }>;
  variables: EnvVariable[];
}

/**
 * Validates .env file content
 * @param content - .env file content
 * @returns Validation result
 */
export function validateEnvFile(content: string): EnvValidationResult {
  const lines = content.split("\n");
  const variables: EnvVariable[] = [];
  const errors: Array<{ key?: string; line?: number; error: string }> = [];
  const warnings: Array<{ key?: string; line?: number; warning: string }> = [];
  const seenKeys = new Set<string>();

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    if (!trimmed.includes("=")) {
      errors.push({
        line: lineNum,
        error: "Missing equals sign",
      });
      return;
    }

    const equalIndex = trimmed.indexOf("=");
    const key = trimmed.substring(0, equalIndex).trim();
    const value = trimmed.substring(equalIndex + 1).trim();

    if (!key) {
      errors.push({
        line: lineNum,
        error: "Empty key",
      });
      return;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      errors.push({
        key,
        line: lineNum,
        error:
          "Invalid key format (must start with letter/underscore, contain only alphanumeric and underscore)",
      });
      return;
    }

    if (seenKeys.has(key)) {
      warnings.push({
        key,
        line: lineNum,
        warning: "Duplicate key",
      });
    }
    seenKeys.add(key);

    if (!value && value !== "") {
      warnings.push({
        key,
        line: lineNum,
        warning: "Empty value",
      });
    }

    let comment: string | undefined;
    let actualValue = value;

    if (value.includes("#")) {
      const commentIndex = value.indexOf("#");
      actualValue = value.substring(0, commentIndex).trim();
      comment = value.substring(commentIndex + 1).trim();
    }

    variables.push({
      key,
      value: actualValue,
      comment,
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    variables,
  };
}

/**
 * Parses .env file content and extracts environment variables
 * @param content - .env file content string
 * @returns Array of parsed environment variable objects
 */
export function parseEnvFile(content: string): EnvVariable[] {
  const result = validateEnvFile(content);
  return result.variables;
}

/**
 * Formats environment variables array to .env file format string
 * @param variables - Array of environment variable objects
 * @returns .env file content string
 */
export function formatEnvFile(variables: EnvVariable[]): string {
  const lines: string[] = [];

  variables.forEach((variable) => {
    let line = `${variable.key}=${variable.value}`;
    if (variable.comment) {
      line += ` # ${variable.comment}`;
    }
    lines.push(line);
  });

  return lines.join("\n");
}

/**
 * Validates environment variable name format
 * @param name - Variable name to validate
 * @returns True if name follows valid env var naming convention
 */
export function validateEnvName(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

/**
 * Finds required environment variables that are missing from .env content
 * @param envContent - Current .env file content string
 * @param requiredKeys - Array of required variable key names
 * @returns Array of missing variable keys
 */
export function findMissingVariables(
  envContent: string,
  requiredKeys: string[],
): string[] {
  const variables = parseEnvFile(envContent);
  const presentKeys = new Set(variables.map((v) => v.key));
  return requiredKeys.filter((key) => !presentKeys.has(key));
}

/**
 * Finds duplicate environment variable keys in .env file content
 * @param content - .env file content string
 * @returns Array of duplicate key names
 */
export function findDuplicateKeys(content: string): string[] {
  const variables = parseEnvFile(content);
  const keyCount = new Map<string, number>();

  variables.forEach((variable) => {
    keyCount.set(variable.key, (keyCount.get(variable.key) || 0) + 1);
  });

  return Array.from(keyCount.entries())
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
}

/**
 * Validates environment variable values against provided patterns or functions
 * @param variables - Array of environment variable objects to validate
 * @param patterns - Object mapping variable keys to RegExp patterns or validation functions
 * @returns Validation result with errors for values that don't match patterns
 */
export function validateEnvValues(
  variables: EnvVariable[],
  patterns: Record<string, RegExp | ((value: string) => boolean)>,
): {
  valid: boolean;
  errors: Array<{ key: string; error: string }>;
} {
  const errors: Array<{ key: string; error: string }> = [];

  variables.forEach((variable) => {
    const pattern = patterns[variable.key];
    if (!pattern) return;

    let isValid = false;
    if (pattern instanceof RegExp) {
      isValid = pattern.test(variable.value);
    } else if (typeof pattern === "function") {
      isValid = pattern(variable.value);
    }

    if (!isValid) {
      errors.push({
        key: variable.key,
        error: `Value does not match required pattern`,
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extracts environment variables from shell script content
 * @param script - Shell script content string
 * @returns Array of environment variable objects extracted from export statements
 */
export function extractEnvFromShell(script: string): EnvVariable[] {
  const variables: EnvVariable[] = [];
  const lines = script.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^(?:export\s+)?([A-Z_][A-Z0-9_]*)=(.+)$/);
    if (match && match[1] && match[2]) {
      const [, key, value] = match;
      variables.push({
        key,
        value: value.trim().replace(/^["']|["']$/g, ""),
      });
    }
  });

  return variables;
}
