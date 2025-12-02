/**
 * Regex testing and validation utilities
 */

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexTestResult {
  matches: RegexMatch[];
  isValid: boolean;
  error?: string;
  flags?: string;
}

/**
 * Tests a regex pattern against text and returns all matches with details
 * @param pattern - The regex pattern string to test
 * @param text - The text string to search
 * @param flags - Regex flags (default: "g" for global)
 * @returns Test result with matches, validity, and optional error
 */
export function testRegex(
  pattern: string,
  text: string,
  flags: string = "g",
): RegexTestResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match;

    if (!flags.includes("g")) {
      match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    } else {
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index ?? 0,
          groups: match.slice(1),
        });

        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    }

    return {
      matches,
      isValid: true,
      flags,
    };
  } catch (error) {
    return {
      matches: [],
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid regex pattern",
      flags,
    };
  }
}

/**
 * Validates regex pattern syntax by attempting to create a RegExp
 * @param pattern - The regex pattern string to validate
 * @returns Validation result with error message if invalid
 */
export function validateRegex(pattern: string): {
  valid: boolean;
  error?: string;
} {
  try {
    new RegExp(pattern);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid regex pattern",
    };
  }
}

/**
 * Escapes special regex characters in a string to make it safe for use in regex patterns
 * @param text - The text string to escape
 * @returns Escaped string safe for regex
 */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts all matching strings from text using a regex pattern
 * @param pattern - The regex pattern string
 * @param text - The text string to search
 * @param flags - Regex flags (default: "g" for global)
 * @returns Array of matched strings
 */
export function extractMatches(
  pattern: string,
  text: string,
  flags: string = "g",
): string[] {
  const result = testRegex(pattern, text, flags);
  return result.matches.map((m) => m.match);
}

/**
 * Replaces all matches in text using a regex pattern
 * @param pattern - The regex pattern string
 * @param text - The text string to process
 * @param replacement - Replacement string or function
 * @param flags - Regex flags (default: "g" for global)
 * @returns Text string with matches replaced
 * @throws Error if regex pattern is invalid
 */
export function replaceMatches(
  pattern: string,
  text: string,
  replacement: string | ((match: string, ...groups: string[]) => string),
  flags: string = "g",
): string {
  try {
    const regex = new RegExp(pattern, flags);

    if (typeof replacement === "function") {
      return text.replace(
        regex,
        replacement as (match: string, ...args: string[]) => string,
      );
    }

    return text.replace(regex, replacement);
  } catch (error) {
    throw new Error(
      `Failed to replace matches: ${error instanceof Error ? error.message : "Invalid regex"}`,
    );
  }
}

/**
 * Splits text into an array using a regex pattern as delimiter
 * @param pattern - The regex pattern string to use as delimiter
 * @param text - The text string to split
 * @param flags - Regex flags
 * @returns Array of split text segments
 * @throws Error if regex pattern is invalid
 */
export function splitByRegex(
  pattern: string,
  text: string,
  flags: string = "g",
): string[] {
  try {
    const regex = new RegExp(pattern, flags);
    return text.split(regex);
  } catch (error) {
    throw new Error(
      `Failed to split: ${error instanceof Error ? error.message : "Invalid regex"}`,
    );
  }
}

/**
 * Checks if text matches a regex pattern
 * @param pattern - The regex pattern string to test
 * @param text - The text string to check
 * @param flags - Regex flags
 * @returns True if text matches the pattern, false otherwise
 */
export function matchesRegex(
  pattern: string,
  text: string,
  flags: string = "",
): boolean {
  try {
    const regex = new RegExp(pattern, flags);
    return regex.test(text);
  } catch {
    return false;
  }
}

/**
 * Analyzes a regex pattern and returns information about its structure
 * @param pattern - The regex pattern string to analyze
 * @returns Object containing pattern information (flags, features, counts)
 */
export function getRegexInfo(pattern: string): {
  flags: string[];
  characterClass: boolean;
  anchors: boolean;
  quantifiers: boolean;
  groups: number;
  alternations: number;
} {
  const flags: string[] = [];
  if (pattern.includes("(?")) {
    const flagMatch = pattern.match(/\(\?([imsx]+)/);
    if (flagMatch && flagMatch[1]) {
      flags.push(...flagMatch[1].split(""));
    }
  }

  return {
    flags,
    characterClass: /\[/.test(pattern),
    anchors: /^|\$/.test(pattern),
    quantifiers: /[*+?{}]/.test(pattern),
    groups: (pattern.match(/\(/g) || []).length,
    alternations: (pattern.match(/\|/g) || []).length,
  };
}
