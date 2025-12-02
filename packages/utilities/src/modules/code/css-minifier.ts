import CleanCSS from "clean-css";
import { css as beautifyCssLib } from "js-beautify";

/**
 * Comprehensive CSS utilities: beautifier, minifier, validator, and more
 */

export interface CssMinifyOptions {
  level?: 0 | 1 | 2;
  compatibility?: "ie8" | "ie9" | "*";
  format?: "beautify" | "keep-breaks" | false;
  inline?: string[];
  rebase?: boolean;
}

export interface CssBeautifyOptions {
  indent_size?: number;
  indent_char?: string;
  wrap_line_length?: number;
  end_with_newline?: boolean;
}

const defaultMinifyOptions: CssMinifyOptions = {
  level: 2,
  compatibility: "*",
  format: false,
};

/**
 * Validates CSS syntax using CleanCSS parser
 * @param css - The CSS string to validate
 * @returns Validation result with errors and warnings
 */
export function validateCss(css: string): {
  isValid: boolean;
  error?: string;
  warnings?: string[];
} {
  const warnings: string[] = [];

  try {
    const cleanCss = new CleanCSS({ returnPromise: false });
    const result = cleanCss.minify(css);

    if (result.errors.length > 0) {
      return {
        isValid: false,
        error: result.errors.join(", "),
        warnings,
      };
    }

    if (result.warnings.length > 0) {
      warnings.push(...result.warnings);
    }

    return { isValid: true, warnings };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid CSS",
      warnings,
    };
  }
}

/**
 * Beautifies CSS with proper indentation and formatting
 * @param css - The CSS string to beautify
 * @param options - Beautification options (indent size, line length, etc.)
 * @returns Beautified CSS string
 */
export function beautifyCss(
  css: string,
  options: CssBeautifyOptions = {},
): string {
  const config: CssBeautifyOptions = {
    indent_size: 2,
    indent_char: " ",
    wrap_line_length: 0,
    end_with_newline: true,
    ...options,
  };

  try {
    return beautifyCssLib(css, config);
  } catch (error) {
    return _formatCssBasic(css, config);
  }
}

/**
 * Basic CSS formatter used as fallback when advanced formatting fails
 * @param css - The CSS string to format
 * @param options - Formatting options
 * @returns Formatted CSS string
 */
function _formatCssBasic(css: string, options: CssBeautifyOptions): string {
  const indent = (options.indent_char || " ").repeat(options.indent_size || 2);
  const lines = css.split(";");
  let formatted = "";
  let indentLevel = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.includes("}")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formatted += indent.repeat(indentLevel) + trimmed + ";\n";

    if (trimmed.includes("{")) {
      indentLevel++;
    }
  }

  return formatted.trim();
}

/**
 * Minifies CSS by removing whitespace and optimizing selectors
 * @param css - The CSS string to minify
 * @param options - Minification options (compression level, compatibility, etc.)
 * @returns Minified CSS string
 * @throws Error if minification fails
 */
export function minifyCss(css: string, options: CssMinifyOptions = {}): string {
  try {
    const config = { ...defaultMinifyOptions, ...options };

    const cleanCss = new CleanCSS({
      level: config.level,
      compatibility: config.compatibility,
      format:
        config.format === "beautify"
          ? "beautify"
          : config.format === "keep-breaks"
            ? "keep-breaks"
            : false,
      inline: config.inline,
      rebase: config.rebase,
      returnPromise: false,
    });

    const result = cleanCss.minify(css);

    if (result.errors.length > 0) {
      throw new Error(result.errors.join(", "));
    }

    return result.styles;
  } catch (error) {
    throw new Error(
      `Failed to minify CSS: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts all CSS selectors from a stylesheet
 * @param css - The CSS string to extract selectors from
 * @returns Array of unique CSS selectors
 */
export function extractSelectors(css: string): string[] {
  const selectorRegex = /([^{]+)\{/g;
  const selectors: string[] = [];
  let match;

  while ((match = selectorRegex.exec(css)) !== null) {
    const selector = match[1]?.trim();
    if (selector && !selector.startsWith("@")) {
      selector.split(",").forEach((s) => {
        const trimmed = s.trim();
        if (trimmed) {
          selectors.push(trimmed);
        }
      });
    }
  }

  return selectors;
}

/**
 * Extracts all unique CSS property names from a stylesheet
 * @param css - The CSS string to extract properties from
 * @returns Array of unique CSS property names
 */
export function extractProperties(css: string): string[] {
  const propertyRegex = /([a-z-]+)\s*:/gi;
  const properties: string[] = [];
  const propertySet = new Set<string>();
  let match;

  while ((match = propertyRegex.exec(css)) !== null) {
    const prop = match[1]?.toLowerCase();
    if (prop && !propertySet.has(prop)) {
      propertySet.add(prop);
      properties.push(prop);
    }
  }

  return properties;
}

/**
 * Extracts all CSS media queries from a stylesheet
 * @param css - The CSS string to extract media queries from
 * @returns Array of media query strings
 */
export function extractMediaQueries(css: string): string[] {
  const mediaRegex = /@media[^{]*\{[\s\S]*?\}/g;
  const queries: string[] = [];
  let match;

  while ((match = mediaRegex.exec(css)) !== null) {
    queries.push(match[0]);
  }

  return queries;
}

/**
 * Removes unused CSS rules (basic implementation - removes empty rules)
 * @param css - The CSS string to clean
 * @returns CSS string with empty rules removed
 */
export function removeUnusedCss(css: string): string {
  return css
    .replace(/[^{}]*\{\s*\}/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

/**
 * Analyzes CSS and returns detailed statistics about rules, selectors, and properties
 * @param css - The CSS string to analyze
 * @returns Object containing rule counts, selector counts, property counts, and file size
 */
export function getCssStats(css: string): {
  totalRules: number;
  totalSelectors: number;
  totalProperties: number;
  totalMediaQueries: number;
  totalComments: number;
  totalAtRules: number;
  fileSize: number;
} {
  const selectors = extractSelectors(css);
  const properties = extractProperties(css);
  const mediaQueries = extractMediaQueries(css);
  const comments = (css.match(/\/\*[\s\S]*?\*\//g) || []).length;
  const atRules = (css.match(/@[^{;]+/g) || []).length;
  const rules = (css.match(/[^{}]*\{[\s\S]*?\}/g) || []).length;

  return {
    totalRules: rules,
    totalSelectors: selectors.length,
    totalProperties: properties.length,
    totalMediaQueries: mediaQueries.length,
    totalComments: comments,
    totalAtRules: atRules,
    fileSize: new Blob([css]).size,
  };
}

/**
 * Calculates size statistics comparing original and minified CSS
 * @param original - Original CSS string
 * @param minified - Minified CSS string
 * @returns Object containing size comparison metrics
 */
export function getCssSizeStats(original: string, minified: string) {
  const originalSize = new Blob([original]).size;
  const minifiedSize = new Blob([minified]).size;
  const savings = originalSize - minifiedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(2);

  return {
    originalSize,
    minifiedSize,
    savings,
    savingsPercent: parseFloat(savingsPercent),
    compressionRatio: ((1 - minifiedSize / originalSize) * 100).toFixed(2),
  };
}
