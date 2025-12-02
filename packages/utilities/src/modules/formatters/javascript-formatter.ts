/**
 * JavaScript/TypeScript formatting utilities
 * Format, beautify, and minify JavaScript/TypeScript code
 */

import { js as beautifyJs } from "js-beautify";
import { minify } from "terser";

export interface JavaScriptFormatOptions {
  indent_size?: number;
  indent_char?: string;
  indent_with_tabs?: boolean;
  eol?: string;
  preserve_newlines?: boolean;
  max_preserve_newlines?: number;
  wrap_line_length?: number;
  brace_style?:
    | "collapse"
    | "expand"
    | "end-expand"
    | "none"
    | "preserve-inline";
  space_before_conditional?: boolean;
  space_in_paren?: boolean;
  space_in_empty_paren?: boolean;
  jslint_happy?: boolean;
  indent_scripts?: "keep" | "separate" | "normal";
  keep_array_indentation?: boolean;
  keep_function_indentation?: boolean;
  eval_code?: boolean;
  unindent_chained_methods?: boolean;
  break_chained_methods?: boolean;
  end_with_newline?: boolean;
  wrap_attributes?:
    | "auto"
    | "force"
    | "force-aligned"
    | "force-expand-multiline"
    | "aligned-multiple"
    | "preserve"
    | "preserve-aligned";
  wrap_attributes_indent_size?: number;
  unescape_strings?: boolean;
}

export interface JavaScriptMinifyOptions {
  compress?: boolean | object;
  mangle?: boolean | object;
  format?: {
    comments?:
      | boolean
      | "all"
      | "some"
      | RegExp
      | ((node: any, comment: any) => boolean);
    beautify?: boolean;
    semicolons?: boolean;
  };
}

/**
 * Formats and beautifies JavaScript/TypeScript code with customizable options
 * @param code - The JavaScript/TypeScript code string to format
 * @param options - Formatting options (indent size, brace style, etc.)
 * @returns Formatted JavaScript code string
 */
export function formatJavaScript(
  code: string,
  options: JavaScriptFormatOptions = {},
): string {
  const defaultOptions: JavaScriptFormatOptions = {
    indent_size: 2,
    indent_char: " ",
    preserve_newlines: true,
    max_preserve_newlines: 2,
    brace_style: "collapse",
    space_before_conditional: true,
    end_with_newline: true,
    ...options,
  };

  return beautifyJs(code, defaultOptions);
}

/**
 * Minifies JavaScript/TypeScript code by removing whitespace and optimizing
 * @param code - The JavaScript/TypeScript code string to minify
 * @param options - Minification options (compress, mangle, format)
 * @returns Promise that resolves to minified JavaScript code string
 * @throws Error if minification fails
 */
export async function minifyJavaScript(
  code: string,
  options: JavaScriptMinifyOptions = {},
): Promise<string> {
  const result = await minify(code, {
    compress: options.compress ?? true,
    mangle: options.mangle ?? true,
    format: options.format ?? {
      comments: false,
    },
    ...options,
  });

  if (!result.code) {
    throw new Error("Minification failed: No output generated");
  }

  return result.code;
}

/**
 * Validates JavaScript/TypeScript syntax by attempting to parse the code
 * @param code - The JavaScript/TypeScript code string to validate
 * @returns Validation result with error details and line/column if invalid
 */
export function validateJavaScript(code: string): {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
} {
  try {
    new Function(code);
    return { isValid: true };
  } catch (error) {
    const err = error as Error;
    const lineMatch = err.message.match(/line (\d+)/i);
    const columnMatch = err.message.match(/column (\d+)/i);

    return {
      isValid: false,
      error: err.message,
      line: lineMatch && lineMatch[1] ? parseInt(lineMatch[1], 10) : undefined,
      column:
        columnMatch && columnMatch[1]
          ? parseInt(columnMatch[1], 10)
          : undefined,
    };
  }
}

/**
 * Extracts all import statements from JavaScript/TypeScript code
 * Supports ES6 imports, CommonJS requires, and dynamic imports
 * @param code - The JavaScript/TypeScript code string to analyze
 * @returns Object containing array of import information with type, source, and line numbers
 */
export function extractImports(code: string): {
  imports: Array<{
    type: "import" | "require" | "dynamic";
    source: string;
    default?: string;
    named?: string[];
    namespace?: string;
    line: number;
  }>;
} {
  const imports: Array<{
    type: "import" | "require" | "dynamic";
    source: string;
    default?: string;
    named?: string[];
    namespace?: string;
    line: number;
  }> = [];

  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const es6ImportMatch = line.match(
      /^import\s+(?:(?:(?:\*\s+as\s+(\w+))|(\w+)|(\{[^}]*\}))\s+from\s+)?["']([^"']+)["']/i,
    );
    if (es6ImportMatch) {
      const namespace = es6ImportMatch[1];
      const defaultImport = es6ImportMatch[2];
      const namedImports = es6ImportMatch[3];
      const source = es6ImportMatch[4];

      if (source) {
        imports.push({
          type: "import",
          source,
          default: defaultImport,
          named: namedImports
            ? namedImports
                .replace(/[{}]/g, "")
                .split(",")
                .map((i) =>
                  i
                    .trim()
                    .split(/\s+as\s+/)[0]
                    ?.trim(),
                )
                .filter((i): i is string => Boolean(i))
            : undefined,
          namespace,
          line: index + 1,
        });
      }
    }

    const requireMatch = line.match(
      /const\s+(\w+)\s*=\s*require\(["']([^"']+)["']\)/i,
    );
    if (requireMatch && requireMatch[1] && requireMatch[2]) {
      imports.push({
        type: "require",
        source: requireMatch[2],
        default: requireMatch[1],
        line: index + 1,
      });
    }

    const dynamicMatch = line.match(/import\(["']([^"']+)["']\)/i);
    if (dynamicMatch && dynamicMatch[1]) {
      imports.push({
        type: "dynamic",
        source: dynamicMatch[1],
        line: index + 1,
      });
    }
  });

  return { imports };
}

/**
 * Converts CommonJS module syntax to ES Module syntax
 * @param code - The JavaScript code string to convert
 * @returns Converted code using ES Module syntax
 */
export function convertToESM(code: string): string {
  let converted = code;

  converted = converted.replace(
    /const\s+(\w+)\s*=\s*require\(["']([^"']+)["']\)/g,
    (match, name, source) => {
      return `import ${name} from "${source}";`;
    },
  );

  converted = converted.replace(
    /module\.exports\s*=\s*(\w+);?/g,
    (match, name) => {
      return `export default ${name};`;
    },
  );

  converted = converted.replace(
    /module\.exports\s*=\s*\{([^}]+)\};?/g,
    (match, exports) => {
      const exportsList = exports
        .split(",")
        .map((e: string) => e.trim())
        .filter(Boolean);
      const exportStatements = exportsList
        .map((e: string) => `export { ${e} };`)
        .join("\n");
      return exportStatements;
    },
  );

  converted = converted.replace(/exports\.(\w+)\s*=/g, (match, name) => {
    return `export const ${name} =`;
  });

  return converted;
}

/**
 * Converts ES Module syntax to CommonJS module syntax
 * @param code - The JavaScript code string to convert
 * @returns Converted code using CommonJS syntax
 */
export function convertToCommonJS(code: string): string {
  let converted = code;

  converted = converted.replace(
    /import\s+(\w+)\s+from\s+["']([^"']+)["']/g,
    (match, name, source) => {
      return `const ${name} = require("${source}");`;
    },
  );

  converted = converted.replace(
    /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g,
    (match, imports, source) => {
      const importsList = imports
        .split(",")
        .map((i: string) =>
          i
            .trim()
            .split(/\s+as\s+/)[0]
            ?.trim(),
        )
        .filter(Boolean);
      const requires = importsList
        .map((i: string) => `const ${i} = require("${source}").${i};`)
        .join("\n");
      return requires;
    },
  );

  converted = converted.replace(
    /export\s+default\s+(\w+);?/g,
    (match, name) => {
      return `module.exports = ${name};`;
    },
  );

  converted = converted.replace(/export\s+const\s+(\w+)/g, (match, name) => {
    return `const ${name}`;
  });
  converted = converted.replace(/export\s+\{([^}]+)\};?/g, (match, exports) => {
    const exportsList = exports
      .split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);
    return `module.exports = { ${exportsList.join(", ")} };`;
  });

  return converted;
}
