import { minify as terserMinify } from "terser";
import { js as beautifyJsLib } from "js-beautify";

/**
 * Comprehensive JavaScript utilities: beautifier, minifier, validator, and more
 */

export interface JsMinifyOptions {
  compress?: boolean | Record<string, unknown>;
  mangle?: boolean | Record<string, unknown>;
  keepClassNames?: boolean;
  keepFnNames?: boolean;
  output?: {
    comments?:
      | boolean
      | RegExp
      | ((node: unknown, comment: { value: string; type: string }) => boolean);
    beautify?: boolean;
  };
}

export interface JsBeautifyOptions {
  indent_size?: number;
  indent_char?: string;
  indent_level?: number;
  wrap_line_length?: number;
  space_after_anon_function?: boolean;
  space_after_named_function?: boolean;
  space_in_paren?: boolean;
  brace_style?:
    | "collapse"
    | "expand"
    | "end-expand"
    | "none"
    | "preserve-inline";
  end_with_newline?: boolean;
}

const defaultMinifyOptions: JsMinifyOptions = {
  compress: true,
  mangle: true,
  keepClassNames: false,
  keepFnNames: false,
};

/**
 * Validates JavaScript syntax by attempting to parse the code
 * @param code - The JavaScript code string to validate
 * @returns Validation result with errors and warnings
 */
export function validateJs(code: string): {
  isValid: boolean;
  error?: string;
  warnings?: string[];
} {
  const warnings: string[] = [];

  try {
    new Function(code);
    return { isValid: true, warnings };
  } catch (error) {
    const err = error as Error;
    let errorMessage = err.message;

    const lineMatch = errorMessage.match(/line (\d+)/);
    if (lineMatch) {
      warnings.push(`Syntax error at line ${lineMatch[1]}`);
    }

    return {
      isValid: false,
      error: errorMessage || "JavaScript syntax error",
      warnings,
    };
  }
}

/**
 * Beautifies JavaScript code with proper indentation and formatting
 * @param code - The JavaScript code string to beautify
 * @param options - Beautification options (indent size, brace style, etc.)
 * @returns Beautified JavaScript code string
 * @throws Error if beautification fails
 */
export function beautifyJs(
  code: string,
  options: JsBeautifyOptions = {},
): string {
  const config: JsBeautifyOptions = {
    indent_size: 2,
    indent_char: " ",
    wrap_line_length: 0,
    space_after_anon_function: true,
    space_after_named_function: false,
    space_in_paren: false,
    brace_style: "collapse",
    end_with_newline: true,
    ...options,
  };

  try {
    return beautifyJsLib(code, config);
  } catch (error) {
    throw new Error(
      `Failed to beautify JavaScript: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Minifies JavaScript code by removing whitespace and optimizing
 * @param code - The JavaScript code string to minify
 * @param options - Minification options (compress, mangle, keep names, etc.)
 * @returns Promise that resolves to minified JavaScript code string
 * @throws Error if minification fails
 */
export async function minifyJs(
  code: string,
  options: JsMinifyOptions = {},
): Promise<string> {
  try {
    const config = { ...defaultMinifyOptions, ...options };

    const result = await terserMinify(code, {
      compress: config.compress
        ? typeof config.compress === "object"
          ? config.compress
          : {}
        : false,
      mangle: config.mangle
        ? typeof config.mangle === "object"
          ? config.mangle
          : {}
        : false,
      keep_classnames: config.keepClassNames,
      keep_fnames: config.keepFnNames,
      output: config.output,
    });

    if (!result.code) {
      throw new Error("Minification produced no output");
    }

    return result.code;
  } catch (error) {
    const err = error as Error & { line?: number; col?: number };
    throw new Error(
      `Failed to minify JavaScript${err.line ? ` at line ${err.line}, col ${err.col}` : ""}: ${err.message || "Unknown error"}`,
    );
  }
}

/**
 * Extracts all function declarations, arrow functions, and methods from JavaScript code
 * @param code - The JavaScript code string to analyze
 * @returns Array of function objects with name, type, and optional line number
 */
export function extractFunctions(code: string): Array<{
  name: string;
  type: "function" | "arrow" | "method";
  line?: number;
}> {
  const functions: Array<{
    name: string;
    type: "function" | "arrow" | "method";
    line?: number;
  }> = [];

  const funcRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  let match;
  let lineNumber = 1;

  while ((match = funcRegex.exec(code)) !== null) {
    if (match[1]) {
      const beforeMatch = code.substring(0, match.index || 0);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
      functions.push({ name: match[1], type: "function", line: lineNumber });
    }
  }

  const arrowRegex =
    /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\([^)]*\)\s*=>/g;
  while ((match = arrowRegex.exec(code)) !== null) {
    if (match[1]) {
      const beforeMatch = code.substring(0, match.index || 0);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
      functions.push({ name: match[1], type: "arrow", line: lineNumber });
    }
  }

  const methodRegex =
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function/g;
  while ((match = methodRegex.exec(code)) !== null) {
    if (match[1] && match[2]) {
      const beforeMatch = code.substring(0, match.index || 0);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
      functions.push({
        name: `${match[1]}.${match[2]}`,
        type: "method",
        line: lineNumber,
      });
    }
  }

  return functions;
}

/**
 * Extracts all variable declarations (const, let, var) from JavaScript code
 * @param code - The JavaScript code string to analyze
 * @returns Array of variable objects with name, type, and optional line number
 */
export function extractVariables(
  code: string,
): Array<{ name: string; type: "const" | "let" | "var"; line?: number }> {
  const variables: Array<{
    name: string;
    type: "const" | "let" | "var";
    line?: number;
  }> = [];

  for (const type of ["const", "let", "var"] as const) {
    const regex = new RegExp(`${type}\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*=`, "g");
    let match;

    while ((match = regex.exec(code)) !== null) {
      if (match[1]) {
        const beforeMatch = code.substring(0, match.index || 0);
        const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
        variables.push({ name: match[1], type, line: lineNumber });
      }
    }
  }

  return variables;
}

/**
 * Extracts all ES6 import statements from JavaScript code
 * @param code - The JavaScript code string to analyze
 * @returns Array of import objects with source, imports list, and type
 */
export function extractImports(code: string): Array<{
  source: string;
  imports: string[];
  type: "default" | "named" | "namespace";
}> {
  const imports: Array<{
    source: string;
    imports: string[];
    type: "default" | "named" | "namespace";
  }> = [];

  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = defaultImportRegex.exec(code)) !== null) {
    if (match[1] && match[2]) {
      imports.push({
        source: match[2],
        imports: [match[1]],
        type: "default",
      });
    }
  }

  const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = namedImportRegex.exec(code)) !== null) {
    if (match[1] && match[2]) {
      const importList = match[1]
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      imports.push({
        source: match[2],
        imports: importList,
        type: "named",
      });
    }
  }

  const namespaceImportRegex =
    /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = namespaceImportRegex.exec(code)) !== null) {
    if (match[1] && match[2]) {
      imports.push({
        source: match[2],
        imports: [match[1]],
        type: "namespace",
      });
    }
  }

  return imports;
}

/**
 * Analyzes JavaScript code and returns detailed statistics
 * @param code - The JavaScript code string to analyze
 * @returns Object containing function counts, variable counts, import counts, and file metrics
 */
export function getJsStats(code: string): {
  totalFunctions: number;
  totalVariables: number;
  totalImports: number;
  totalLines: number;
  totalComments: number;
  fileSize: number;
} {
  const functions = extractFunctions(code);
  const variables = extractVariables(code);
  const imports = extractImports(code);
  const lines = code.split("\n").length;
  const comments = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;

  return {
    totalFunctions: functions.length,
    totalVariables: variables.length,
    totalImports: imports.length,
    totalLines: lines,
    totalComments: comments,
    fileSize: new Blob([code]).size,
  };
}

/**
 * Calculates size statistics comparing original and minified JavaScript
 * @param original - Original JavaScript code string
 * @param minified - Minified JavaScript code string
 * @returns Object containing size comparison metrics
 */
export function getJsSizeStats(original: string, minified: string) {
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
