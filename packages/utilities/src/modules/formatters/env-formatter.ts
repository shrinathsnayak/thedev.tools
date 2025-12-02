/**
 * Environment variable file (.env) formatter and validator
 * Uses 'envfile' package for parsing and formatting
 */

import { parse as parseEnvFile, stringify as stringifyEnvFile } from "envfile";

export interface EnvFileOptions {
  sort?: boolean;
  removeEmpty?: boolean;
  removeComments?: boolean;
  removeDuplicates?: boolean;
  preserveComments?: boolean;
}

export interface EnvVariable {
  key: string;
  value: string;
  comment?: string;
  line: number;
}

export interface EnvValidationResult {
  isValid: boolean;
  errors: Array<{
    line: number;
    message: string;
    key?: string;
  }>;
  warnings: Array<{
    line: number;
    message: string;
    key?: string;
  }>;
}

/**
 * Parses .env file content and returns array of environment variables with metadata
 * @param content - The .env file content string to parse
 * @returns Array of environment variable objects with key, value, comment, and line number
 */
export function parseEnvFileContent(content: string): EnvVariable[] {
  try {
    const parsed = parseEnvFile(content);
    const lines = content.split("\n");
    const variables: EnvVariable[] = [];
    let currentComment: string | undefined;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return;
      }

      if (trimmed.startsWith("#")) {
        currentComment = trimmed.substring(1).trim();
        return;
      }

      const match = trimmed.match(/^([^=#]+?)=(.*)$/);
      if (match && match[1]) {
        const key = match[1].trim();
        if (parsed[key]) {
          variables.push({
            key,
            value: parsed[key],
            comment: currentComment,
            line: index + 1,
          });
          currentComment = undefined;
        }
      }
    });

    return variables;
  } catch (error) {
    return _parseEnvFileManual(content);
  }
}

/**
 * Manual parsing fallback when envfile package fails
 * @param content - The .env file content string to parse
 * @returns Array of environment variable objects
 */
function _parseEnvFileManual(content: string): EnvVariable[] {
  const lines = content.split("\n");
  const variables: EnvVariable[] = [];
  let currentComment: string | undefined;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return;
    }

    if (trimmed.startsWith("#")) {
      currentComment = trimmed.substring(1).trim();
      return;
    }

    const match = trimmed.match(/^([^=#]+?)=(.*)$/);
    if (match && match[1] && match[2]) {
      const key = match[1].trim();
      let value = match[2].trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      variables.push({
        key,
        value,
        comment: currentComment,
        line: index + 1,
      });

      currentComment = undefined;
    }
  });

  return variables;
}

/**
 * Formats .env file content with customizable options
 * @param content - The .env file content string to format
 * @param options - Formatting options (sort, remove empty, preserve comments, etc.)
 * @returns Formatted .env file content string
 */
export function formatEnvFile(
  content: string,
  options: EnvFileOptions = {},
): string {
  let variables = parseEnvFileContent(content);

  if (options.removeDuplicates) {
    const seen = new Set<string>();
    variables = variables.filter((v) => {
      if (seen.has(v.key)) {
        return false;
      }
      seen.add(v.key);
      return true;
    });
  }

  if (options.removeEmpty) {
    variables = variables.filter((v) => v.value.trim() !== "");
  }

  if (options.removeComments) {
    variables = variables.map((v) => ({ ...v, comment: undefined }));
  }

  if (options.sort) {
    variables.sort((a, b) => a.key.localeCompare(b.key));
  }

  const envObject: Record<string, string> = {};
  const commentMap = new Map<string, string>();

  variables.forEach((variable) => {
    envObject[variable.key] = variable.value;
    if (options.preserveComments && variable.comment) {
      commentMap.set(variable.key, variable.comment);
    }
  });

  const formatted = stringifyEnvFile(envObject);

  if (!options.preserveComments || commentMap.size === 0) {
    return formatted;
  }

  const lines: string[] = [];
  const formattedLines = formatted.split("\n");

  formattedLines.forEach((line) => {
    const match = line.match(/^([^=]+)=/);
    if (match && match[1]) {
      const key = match[1].trim();
      const comment = commentMap.get(key);
      if (comment) {
        lines.push(`# ${comment}`);
      }
    }
    lines.push(line);
  });

  return lines.join("\n");
}

/**
 * Validates .env file content and checks for common issues
 * @param content - The .env file content string to validate
 * @returns Validation result with errors and warnings
 */
export function validateEnvFile(content: string): EnvValidationResult {
  const result: EnvValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    parseEnvFile(content);
  } catch (error) {
    result.errors.push({
      line: 0,
      message: `Parse error: ${(error as Error).message}`,
    });
    result.isValid = false;
    return result;
  }

  const lines = content.split("\n");
  const seenKeys = new Map<string, number>();

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineNumber = index + 1;

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    if (!trimmed.includes("=")) {
      result.errors.push({
        line: lineNumber,
        message: "Missing '=' separator",
      });
      result.isValid = false;
      return;
    }

    const match = trimmed.match(/^([^=#]+?)=(.*)$/);
    if (!match) {
      result.errors.push({
        line: lineNumber,
        message: "Invalid format",
      });
      result.isValid = false;
      return;
    }

    const key = match[1]?.trim() || "";
    const value = match[2]?.trim() || "";

    if (!key) {
      result.errors.push({
        line: lineNumber,
        message: "Empty key",
      });
      result.isValid = false;
      return;
    }

    if (!/^[A-Z_][A-Z0-9_]*$/i.test(key)) {
      result.warnings.push({
        line: lineNumber,
        key,
        message:
          "Key should follow ENV_VAR naming convention (uppercase with underscores)",
      });
    }

    if (seenKeys.has(key)) {
      result.errors.push({
        line: lineNumber,
        key,
        message: `Duplicate key: ${key} (first seen at line ${seenKeys.get(key)})`,
      });
      result.isValid = false;
    } else {
      seenKeys.set(key, lineNumber);
    }

    if (
      value.includes(" ") &&
      !value.startsWith('"') &&
      !value.startsWith("'")
    ) {
      result.warnings.push({
        line: lineNumber,
        key,
        message: "Value contains spaces but is not quoted",
      });
    }
  });

  return result;
}

/**
 * Converts .env file content to JSON format
 * @param content - The .env file content string to convert
 * @returns JSON object mapping environment variable keys to values
 */
export function envToJson(content: string): Record<string, string> {
  try {
    return parseEnvFile(content);
  } catch (error) {
    const variables = parseEnvFileContent(content);
    const json: Record<string, string> = {};
    variables.forEach((variable) => {
      json[variable.key] = variable.value;
    });
    return json;
  }
}

/**
 * Converts JSON object to .env file format
 * @param json - The JSON object mapping keys to values
 * @returns .env file format string
 */
export function jsonToEnv(json: Record<string, string>): string {
  return stringifyEnvFile(json);
}
