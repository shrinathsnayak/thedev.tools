/**
 * INI/Properties file formatter
 * Handles .ini, .properties, and similar configuration file formats
 * Uses 'ini' package for parsing and formatting
 */

import { parse as parseIni, stringify as stringifyIni } from "ini";

export interface IniFileOptions {
  sort?: boolean;
  removeEmpty?: boolean;
  removeComments?: boolean;
  preserveComments?: boolean;
  sectionSeparator?: string;
}

export interface IniSection {
  name?: string;
  properties: Array<{
    key: string;
    value: string;
    comment?: string;
    line: number;
  }>;
}

export interface ParsedIniFile {
  sections: IniSection[];
  global: IniSection;
}

/**
 * Parses INI/Properties file content and returns structured data
 * @param content - The INI file content string to parse
 * @returns Parsed INI file with sections and global properties
 */
export function parseIniFile(content: string): ParsedIniFile {
  const lines = content.split("\n");
  const result: ParsedIniFile = {
    sections: [],
    global: { properties: [] },
  };

  let currentSection: IniSection = result.global;
  let currentComment: string | undefined;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineNumber = index + 1;

    if (!trimmed) {
      return;
    }

    if (trimmed.startsWith(";") || trimmed.startsWith("#")) {
      currentComment = trimmed.substring(1).trim();
      return;
    }

    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (sectionMatch && sectionMatch[1]) {
      const sectionName = sectionMatch[1].trim();
      currentSection = {
        name: sectionName,
        properties: [],
      };
      result.sections.push(currentSection);
      return;
    }

    const propertyMatch = trimmed.match(/^([^=#;]+?)=(.*)$/);
    if (propertyMatch && propertyMatch[1] && propertyMatch[2]) {
      const key = propertyMatch[1].trim();
      let value = propertyMatch[2].trim();

      const commentIndex = value.search(/[;#]/);
      if (commentIndex !== -1) {
        const inlineComment = value.substring(commentIndex + 1).trim();
        value = value.substring(0, commentIndex).trim();
        if (inlineComment) {
          currentComment = inlineComment;
        }
      }

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      currentSection.properties.push({
        key,
        value,
        comment: currentComment,
        line: lineNumber,
      });

      currentComment = undefined;
    }
  });

  return result;
}

/**
 * Formats INI/Properties file content with customizable options
 * @param content - The INI file content string to format
 * @param options - Formatting options (sort, remove empty, preserve comments, etc.)
 * @returns Formatted INI file content string
 */
export function formatIniFile(
  content: string,
  options: IniFileOptions = {},
): string {
  const parsed = parseIniFile(content);
  const lines: string[] = [];

  let globalProps = parsed.global.properties;
  if (options.removeEmpty) {
    globalProps = globalProps.filter((p) => p.value.trim() !== "");
  }
  if (options.removeComments) {
    globalProps = globalProps.map((p) => ({ ...p, comment: undefined }));
  }
  if (options.sort) {
    globalProps.sort((a, b) => a.key.localeCompare(b.key));
  }

  globalProps.forEach((prop) => {
    if (options.preserveComments && prop.comment) {
      lines.push(`; ${prop.comment}`);
    }
    const needsQuotes = /[\s=#;]/.test(prop.value);
    const formattedValue = needsQuotes ? `"${prop.value}"` : prop.value;
    lines.push(`${prop.key}=${formattedValue}`);
  });

  parsed.sections.forEach((section) => {
    if (lines.length > 0 && globalProps.length > 0) {
      lines.push("");
    }

    lines.push(`[${section.name}]`);

    let sectionProps = section.properties;
    if (options.removeEmpty) {
      sectionProps = sectionProps.filter((p) => p.value.trim() !== "");
    }
    if (options.removeComments) {
      sectionProps = sectionProps.map((p) => ({ ...p, comment: undefined }));
    }
    if (options.sort) {
      sectionProps.sort((a, b) => a.key.localeCompare(b.key));
    }

    sectionProps.forEach((prop) => {
      if (options.preserveComments && prop.comment) {
        lines.push(`; ${prop.comment}`);
      }
      const needsQuotes = /[\s=#;]/.test(prop.value);
      const formattedValue = needsQuotes ? `"${prop.value}"` : prop.value;
      lines.push(`${prop.key}=${formattedValue}`);
    });
  });

  return lines.join("\n");
}

/**
 * Converts INI file content to JSON format
 * @param content - The INI file content string to convert
 * @returns JSON object representation of the INI file
 */
export function iniToJson(content: string): Record<string, any> {
  try {
    return parseIni(content);
  } catch (error) {
    const parsed = parseIniFile(content);
    const json: Record<string, any> = {};

    parsed.global.properties.forEach((prop) => {
      json[prop.key] = prop.value;
    });

    parsed.sections.forEach((section) => {
      if (!section.name) return;

      const sectionObj: Record<string, string> = {};
      section.properties.forEach((prop) => {
        sectionObj[prop.key] = prop.value;
      });

      json[section.name] = sectionObj;
    });

    return json;
  }
}

/**
 * Converts JSON object to INI file format
 * @param json - The JSON object to convert
 * @param options - Formatting options (currently limited by library)
 * @returns INI file format string
 */
export function jsonToIni(
  json: Record<string, any>,
  options: IniFileOptions = {},
): string {
  try {
    return stringifyIni(json);
  } catch (error) {
    const lines: string[] = [];

    Object.entries(json).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        lines.push(`[${key}]`);
        Object.entries(value as Record<string, any>).forEach(
          ([propKey, propValue]) => {
            const needsQuotes = /[\s=#;]/.test(String(propValue));
            const formattedValue = needsQuotes
              ? `"${propValue}"`
              : String(propValue);
            lines.push(`${propKey}=${formattedValue}`);
          },
        );
      } else {
        const needsQuotes = /[\s=#;]/.test(String(value));
        const formattedValue = needsQuotes ? `"${value}"` : String(value);
        lines.push(`${key}=${formattedValue}`);
      }
    });

    return lines.join("\n");
  }
}

/**
 * Validates INI file content and checks for syntax errors
 * @param content - The INI file content string to validate
 * @returns Validation result with list of errors if invalid
 */
export function validateIniFile(content: string): {
  isValid: boolean;
  errors: Array<{
    line: number;
    message: string;
  }>;
} {
  const result = {
    isValid: true,
    errors: [],
  } as {
    isValid: boolean;
    errors: Array<{ line: number; message: string }>;
  };

  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineNumber = index + 1;

    if (!trimmed || trimmed.startsWith(";") || trimmed.startsWith("#")) {
      return;
    }

    if (trimmed.startsWith("[")) {
      if (!trimmed.endsWith("]")) {
        result.errors.push({
          line: lineNumber,
          message: "Invalid section header: missing closing bracket",
        });
        result.isValid = false;
      }
      return;
    }

    if (!trimmed.includes("=")) {
      result.errors.push({
        line: lineNumber,
        message: "Invalid line format: missing '=' separator",
      });
      result.isValid = false;
    }
  });

  return result;
}
