import { marked } from "marked";
import matter from "gray-matter";

/**
 * Comprehensive Markdown utilities: preview, beautifier, validator, frontmatter, and more
 */

export interface MarkdownOptions {
  breaks?: boolean;
  gfm?: boolean;
  headerIds?: boolean;
  mangle?: boolean;
  pedantic?: boolean;
  sanitize?: boolean;
  smartLists?: boolean;
  smartypants?: boolean;
}

export interface MarkdownFrontmatter {
  data: Record<string, unknown>;
  content: string;
  isEmpty: boolean;
}

const defaultOptions: MarkdownOptions = {
  breaks: false,
  gfm: true,
  headerIds: true,
  mangle: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
};

/**
 * Extracts frontmatter (YAML metadata) from Markdown document
 * @param markdown - Markdown string with optional frontmatter
 * @returns Frontmatter object with data, content, and isEmpty flag
 */
export function extractFrontmatter(markdown: string): MarkdownFrontmatter {
  try {
    const parsed = matter(markdown);
    return {
      data: parsed.data as Record<string, unknown>,
      content: parsed.content,
      isEmpty: Object.keys(parsed.data).length === 0,
    };
  } catch (error) {
    return {
      data: {},
      content: markdown,
      isEmpty: true,
    };
  }
}

/**
 * Validates Markdown structure with basic syntax checks
 * @param markdown - Markdown string to validate
 * @returns Validation result with isValid flag and optional errors/warnings arrays
 */
export function validateMarkdown(markdown: string): {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const codeBlockOpen = (markdown.match(/```/g) || []).length;
  if (codeBlockOpen % 2 !== 0) {
    errors.push("Unmatched code block markers (```)");
  }

  const headers = markdown.match(/^#+\s+/gm) || [];
  for (let i = 1; i < headers.length; i++) {
    const prevMatch = headers[i - 1]?.match(/^#+/);
    const currMatch = headers[i]?.match(/^#+/);
    const prevLevel = prevMatch?.[0]?.length || 0;
    const currLevel = currMatch?.[0]?.length || 0;
    if (currLevel > prevLevel + 1) {
      warnings.push(`Header level jumps from h${prevLevel} to h${currLevel}`);
    }
  }

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(markdown)) !== null) {
    const url = match[2];
    const text = match[1];
    if (!url || url.trim() === "") {
      warnings.push(`Empty link URL for: "${text || "unknown"}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Converts Markdown to HTML asynchronously
 * @param markdown - Markdown string to convert
 * @param options - Markdown parsing options
 * @returns Promise resolving to HTML string
 * @throws Error if parsing fails
 */
export async function markdownToHtml(
  markdown: string,
  options: MarkdownOptions = {},
): Promise<string> {
  try {
    const config = { ...defaultOptions, ...options };

    marked.setOptions({
      breaks: config.breaks,
      gfm: config.gfm,
    });

    const html = await marked.parse(markdown);
    return typeof html === "string" ? html : String(html);
  } catch (error) {
    throw new Error(
      `Failed to parse markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts Markdown to HTML synchronously
 * @param markdown - Markdown string to convert
 * @param options - Markdown parsing options
 * @returns HTML string
 * @throws Error if parsing fails
 */
export function markdownToHtmlSync(
  markdown: string,
  options: MarkdownOptions = {},
): string {
  try {
    const config = { ...defaultOptions, ...options };

    marked.setOptions({
      breaks: config.breaks,
      gfm: config.gfm,
    });

    const html = marked.parse(markdown);
    return typeof html === "string" ? html : String(html);
  } catch (error) {
    throw new Error(
      `Failed to parse markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts table of contents from Markdown headers
 * @param markdown - Markdown string to extract TOC from
 * @returns Array of TOC entries with level, text, id, and line number
 */
export function extractTableOfContents(
  markdown: string,
): Array<{ level: number; text: string; id: string; line: number }> {
  const toc: Array<{ level: number; text: string; id: string; line: number }> =
    [];
  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch && headerMatch[1] && headerMatch[2]) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      if (id && text) {
        toc.push({ level, text, id, line: i + 1 });
      }
    }
  }

  return toc;
}

/**
 * Extracts code blocks from Markdown document
 * @param markdown - Markdown string to extract code blocks from
 * @returns Array of code block objects with language, code, and line number
 */
export function extractCodeBlocks(
  markdown: string,
): Array<{ language?: string; code: string; line: number }> {
  const codeBlocks: Array<{ language?: string; code: string; line: number }> =
    [];
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let match;
  let lineNumber = 1;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    if (match[2]) {
      const beforeMatch = markdown.substring(0, match.index || 0);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

      codeBlocks.push({
        language: match[1] || undefined,
        code: match[2].trim(),
        line: lineNumber,
      });
    }
  }

  return codeBlocks;
}

/**
 * Extracts links from Markdown document
 * @param markdown - Markdown string to extract links from
 * @returns Array of link objects with text, url, and optional line number
 */
export function extractLinks(
  markdown: string,
): Array<{ text: string; url: string; line?: number }> {
  const links: Array<{ text: string; url: string; line?: number }> = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let lineNumber = 1;

  while ((match = linkRegex.exec(markdown)) !== null) {
    if (match[1] && match[2]) {
      const beforeMatch = markdown.substring(0, match.index || 0);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

      links.push({
        text: match[1],
        url: match[2],
        line: lineNumber,
      });
    }
  }

  return links;
}

/**
 * Extracts images from Markdown document
 * @param markdown - Markdown string to extract images from
 * @returns Array of image objects with alt, url, optional title, and line number
 */
export function extractImages(
  markdown: string,
): Array<{ alt: string; url: string; title?: string; line?: number }> {
  const images: Array<{
    alt: string;
    url: string;
    title?: string;
    line?: number;
  }> = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]+)")?\)/g;
  let match;
  let lineNumber = 1;

  while ((match = imageRegex.exec(markdown)) !== null) {
    if (match[2]) {
      const beforeMatch = markdown.substring(0, match.index || 0);
      lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

      images.push({
        alt: match[1] || "",
        url: match[2],
        title: match[3],
        line: lineNumber,
      });
    }
  }

  return images;
}

/**
 * Gets comprehensive statistics from Markdown document
 * @param markdown - Markdown string to analyze
 * @returns Statistics object with words, characters, paragraphs, headers, links, etc.
 */
export function getMarkdownStats(markdown: string): {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  lines: number;
  headers: number;
  links: number;
  images: number;
  codeBlocks: number;
  lists: number;
} {
  const plainText = stripMarkdown(markdown);
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const characters = plainText.length;
  const charactersNoSpaces = plainText.replace(/\s/g, "").length;
  const paragraphs = markdown.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = markdown.split("\n").length;
  const headers = (markdown.match(/^#+\s+/gm) || []).length;
  const links = extractLinks(markdown).length;
  const images = extractImages(markdown).length;
  const codeBlocks = extractCodeBlocks(markdown).length;
  const lists = (markdown.match(/^[-*+]\s+|^\d+\.\s+/gm) || []).length;

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    lines,
    headers,
    links,
    images,
    codeBlocks,
    lists,
  };
}

/**
 * Strips Markdown syntax to extract plain text content
 * @param markdown - Markdown string to strip
 * @returns Plain text string with Markdown syntax removed
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/^\|.+\|/gm, "")
    .replace(/^---+$/gm, "")
    .trim();
}

/**
 * Beautifies Markdown by formatting with consistent spacing
 * @param markdown - Markdown string to beautify
 * @returns Beautified Markdown string with normalized spacing
 */
export function beautifyMarkdown(markdown: string): string {
  let beautified = markdown;

  beautified = beautified.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  beautified = beautified.replace(/(\n)(#{1,6}\s+[^\n]+)(\n)/g, "$1\n$2\n\n");

  beautified = beautified.replace(/(\n)(```[\s\S]*?```)(\n)/g, "$1\n$2\n\n");

  beautified = beautified.replace(/\n{3,}/g, "\n\n");

  beautified = beautified
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  return beautified.trim();
}
