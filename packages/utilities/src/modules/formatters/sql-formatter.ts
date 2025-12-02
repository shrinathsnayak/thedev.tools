/**
 * SQL formatting utilities
 * Uses 'sql-formatter' package for SQL query formatting
 */

import { format as formatSql } from "sql-formatter";
import type { FormatOptionsWithLanguage } from "sql-formatter";

export interface SqlFormatOptions {
  language?: "sql" | "n1ql" | "db2" | "pl/sql" | "redshift" | "spark";
  indent?: string;
  uppercase?: boolean;
  linesBetweenQueries?: number;
  keywordCase?: "preserve" | "upper" | "lower";
  functionCase?: "preserve" | "upper" | "lower";
  identifierCase?: "preserve" | "upper" | "lower";
  dataTypeCase?: "preserve" | "upper" | "lower";
}

/**
 * Formats SQL query with proper indentation, line breaks, and keyword casing
 * @param sql - The SQL query string to format
 * @param options - Formatting options (language, indent, case, etc.)
 * @returns Formatted SQL query string
 * @throws Error if formatting fails
 */
export function formatSqlQuery(
  sql: string,
  options: SqlFormatOptions = {},
): string {
  try {
    const config: FormatOptionsWithLanguage = {
      language: (options.language || "sql") as "sql",
      linesBetweenQueries: options.linesBetweenQueries ?? 2,
      keywordCase: options.keywordCase || "preserve",
      functionCase: options.functionCase || "preserve",
      identifierCase: options.identifierCase || "preserve",
      dataTypeCase: options.dataTypeCase || "preserve",
    };

    return formatSql(sql, config);
  } catch (error) {
    throw new Error(
      `Failed to format SQL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validates basic SQL syntax (simplified validation - full validation requires SQL parser)
 * @param sql - The SQL query string to validate
 * @returns Validation result with list of errors if invalid
 */
export function validateSql(sql: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!sql.trim()) {
    errors.push("SQL query is empty");
    return { valid: false, errors };
  }

  const openParens = (sql.match(/\(/g) || []).length;
  const closeParens = (sql.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push("Unbalanced parentheses");
  }

  const singleQuotes = (sql.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    errors.push("Unbalanced single quotes");
  }

  const doubleQuotes = (sql.match(/"/g) || []).length;
  if (doubleQuotes % 2 !== 0) {
    errors.push("Unbalanced double quotes");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Minifies SQL query by removing unnecessary whitespace and line breaks
 * @param sql - The SQL query string to minify
 * @returns Minified SQL query string
 * @throws Error if minification fails
 */
export function minifySql(sql: string): string {
  try {
    return formatSql(sql, {
      language: "sql",
      linesBetweenQueries: 0,
    } as FormatOptionsWithLanguage)
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    throw new Error(
      `Failed to minify SQL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
