/**
 * Text case conversion utilities
 * Uses 'change-case' package for comprehensive case conversion
 */

import {
  camelCase,
  capitalCase,
  constantCase,
  kebabCase,
  noCase,
  pascalCase,
  sentenceCase,
  snakeCase,
} from "change-case";

export type CaseType =
  | "lowercase"
  | "uppercase"
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "CONSTANT_CASE"
  | "Title Case"
  | "Sentence case";

/**
 * Converts text to lowercase
 * @param text - The text string to convert
 * @returns Lowercase text string
 */
export function toLowercase(text: string): string {
  return text.toLowerCase();
}

/**
 * Converts text to uppercase
 * @param text - The text string to convert
 * @returns Uppercase text string
 */
export function toUppercase(text: string): string {
  return text.toUpperCase();
}

/**
 * Converts text to camelCase format
 * @param text - The text string to convert
 * @returns camelCase text string
 */
export function toCamelCase(text: string): string {
  return camelCase(text);
}

/**
 * Converts text to PascalCase format
 * @param text - The text string to convert
 * @returns PascalCase text string
 */
export function toPascalCase(text: string): string {
  return pascalCase(text);
}

/**
 * Converts text to snake_case format
 * @param text - The text string to convert
 * @returns snake_case text string
 */
export function toSnakeCase(text: string): string {
  return snakeCase(text);
}

/**
 * Converts text to kebab-case format
 * @param text - The text string to convert
 * @returns kebab-case text string
 */
export function toKebabCase(text: string): string {
  return kebabCase(text);
}

/**
 * Converts text to CONSTANT_CASE format
 * @param text - The text string to convert
 * @returns CONSTANT_CASE text string
 */
export function toConstantCase(text: string): string {
  return constantCase(text);
}

/**
 * Converts text to Title Case format
 * @param text - The text string to convert
 * @returns Title Case text string
 */
export function toTitleCase(text: string): string {
  return capitalCase(text);
}

/**
 * Converts text to Sentence case format
 * @param text - The text string to convert
 * @returns Sentence case text string
 */
export function toSentenceCase(text: string): string {
  return sentenceCase(text);
}

/**
 * Converts text to the specified case type
 * @param text - The text string to convert
 * @param caseType - Target case type
 * @returns Converted text string in the specified case
 */
export function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case "lowercase":
      return toLowercase(text);
    case "uppercase":
      return toUppercase(text);
    case "camelCase":
      return toCamelCase(text);
    case "PascalCase":
      return toPascalCase(text);
    case "snake_case":
      return toSnakeCase(text);
    case "kebab-case":
      return toKebabCase(text);
    case "CONSTANT_CASE":
      return toConstantCase(text);
    case "Title Case":
      return toTitleCase(text);
    case "Sentence case":
      return toSentenceCase(text);
    default:
      return text;
  }
}

/**
 * Detects the case type of text by analyzing its pattern
 * @param text - The text string to analyze
 * @returns Detected case type or "unknown" if cannot be determined
 */
export function detectCase(text: string): CaseType | "unknown" {
  if (!text.trim()) {
    return "unknown";
  }

  if (/^[A-Z_]+$/.test(text)) {
    return "CONSTANT_CASE";
  }

  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(text)) {
    return "kebab-case";
  }

  if (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(text)) {
    return "snake_case";
  }

  if (/^[a-z][a-zA-Z0-9]*$/.test(text)) {
    return "camelCase";
  }

  if (/^[A-Z][a-zA-Z0-9]*$/.test(text)) {
    return "PascalCase";
  }

  if (text === text.toLowerCase()) {
    return "lowercase";
  }

  if (text === text.toUpperCase()) {
    return "uppercase";
  }

  return "unknown";
}

/**
 * Converts text to all supported case types and returns a record
 * @param text - The text string to convert
 * @returns Record mapping each case type to its converted string
 */
export function convertToAllCases(text: string): Record<CaseType, string> {
  return {
    lowercase: toLowercase(text),
    uppercase: toUppercase(text),
    camelCase: toCamelCase(text),
    PascalCase: toPascalCase(text),
    snake_case: toSnakeCase(text),
    "kebab-case": toKebabCase(text),
    CONSTANT_CASE: toConstantCase(text),
    "Title Case": toTitleCase(text),
    "Sentence case": toSentenceCase(text),
  };
}
