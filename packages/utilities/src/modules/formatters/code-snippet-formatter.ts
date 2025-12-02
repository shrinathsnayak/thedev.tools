/**
 * Code Snippet Formatter
 * Formats code snippets with syntax highlighting metadata
 */

import { SUPPORTED_LANGUAGES } from "@workspace/constants/code";

export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
  lineNumbers?: boolean;
  highlightLines?: number[];
}

// Re-export for backward compatibility
export { SUPPORTED_LANGUAGES } from "@workspace/constants/code";

/**
 * Formats code snippet for various platforms
 */
export function formatCodeSnippet(
  snippet: CodeSnippet,
  platform: "github" | "gist" | "pastebin" | "codeblock" = "codeblock",
): string {
  const { language, code, filename } = snippet;

  switch (platform) {
    case "github":
      return formatForGitHub(snippet);

    case "gist":
      return formatForGist(snippet);

    case "pastebin":
      return formatForPastebin(snippet);

    case "codeblock":
    default:
      return formatCodeBlock(language, code, filename);
  }
}

/**
 * Formats for GitHub markdown code blocks
 */
function formatForGitHub(snippet: CodeSnippet): string {
  const { language, code, filename, lineNumbers } = snippet;
  let block = `\`\`\`${language}\n${code}\n\`\`\``;

  if (filename) {
    block = `<!-- File: ${filename} -->\n${block}`;
  }

  return block;
}

/**
 * Formats for GitHub Gist
 */
function formatForGist(snippet: CodeSnippet): string {
  const { language, code, filename } = snippet;
  // Gist format (just the code, language and filename are metadata)
  return code;
}

/**
 * Formats for Pastebin
 */
function formatForPastebin(snippet: CodeSnippet): string {
  // Pastebin format (just the code)
  return snippet.code;
}

/**
 * Formats as code block
 */
function formatCodeBlock(
  language: string,
  code: string,
  filename?: string,
): string {
  let block = `\`\`\`${language}\n${code}\n\`\`\``;

  if (filename) {
    block = `${filename}\n${block}`;
  }

  return block;
}

/**
 * Extracts code from markdown code blocks
 */
export function extractCodeFromMarkdown(markdown: string): CodeSnippet[] {
  const codeBlocks: CodeSnippet[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] || "text";
    const code = match[2] || "";

    codeBlocks.push({
      language,
      code: code.trim(),
    });
  }

  return codeBlocks;
}

/**
 * Validates code snippet
 */
export function validateCodeSnippet(snippet: CodeSnippet): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!snippet.code || snippet.code.trim().length === 0) {
    errors.push("Code cannot be empty");
  }

  if (
    snippet.language &&
    !SUPPORTED_LANGUAGES.includes(snippet.language.toLowerCase())
  ) {
    errors.push(
      `Unsupported language: ${snippet.language}. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`,
    );
  }

  if (snippet.highlightLines) {
    for (const lineNum of snippet.highlightLines) {
      const totalLines = snippet.code.split("\n").length;
      if (lineNum < 1 || lineNum > totalLines) {
        errors.push(
          `Highlight line ${lineNum} is out of range (1-${totalLines})`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Minifies code snippet (removes comments and whitespace)
 */
export function minifyCodeSnippet(
  snippet: CodeSnippet,
  language: string,
): string {
  // Basic minification - remove empty lines and trim
  if (
    language === "javascript" ||
    language === "typescript" ||
    language === "jsx" ||
    language === "tsx"
  ) {
    // Use terser would be ideal but for basic, just trim
    return snippet.code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
  }

  if (language === "css" || language === "scss") {
    return snippet.code.replace(/\s+/g, " ").trim();
  }

  if (language === "html") {
    return snippet.code.replace(/>\s+</g, "><").trim();
  }

  return snippet.code;
}

/**
 * Adds line numbers to code
 */
export function addLineNumbers(code: string, start: number = 1): string {
  const lines = code.split("\n");
  const maxDigits = String(lines.length).length;

  return lines
    .map((line, index) => {
      const lineNum = start + index;
      return `${String(lineNum).padStart(maxDigits, " ")} | ${line}`;
    })
    .join("\n");
}
