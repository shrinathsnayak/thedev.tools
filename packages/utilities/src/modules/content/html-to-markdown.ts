/**
 * HTML to Markdown converter
 * Uses 'turndown' package for HTML to Markdown conversion
 */

import TurndownService from "turndown";

export interface HtmlToMarkdownOptions {
  headingStyle?: "setext" | "atx";
  hr?: string;
  bulletListMarker?: "-" | "+" | "*";
  codeBlockStyle?: "indented" | "fenced";
  fence?: "```" | "~~~";
  emDelimiter?: "_" | "*";
  strongDelimiter?: "**" | "__";
  linkStyle?: "inlined" | "referenced";
  linkReferenceStyle?: "full" | "collapsed" | "shortcut";
  preformattedCode?: boolean;
}

const defaultOptions: HtmlToMarkdownOptions = {
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full",
};

/**
 * Converts HTML string to Markdown format
 * @param html - HTML string to convert
 * @param options - Conversion options (headingStyle, hr, bulletListMarker, etc.)
 * @returns Converted Markdown string
 * @throws Error if conversion fails
 */
export function htmlToMarkdown(
  html: string,
  options: HtmlToMarkdownOptions = {},
): string {
  try {
    const config = { ...defaultOptions, ...options };
    const turndownService = new TurndownService({
      headingStyle: config.headingStyle,
      hr: config.hr,
      bulletListMarker: config.bulletListMarker,
      codeBlockStyle: config.codeBlockStyle,
      fence: config.fence,
      emDelimiter: config.emDelimiter,
      strongDelimiter: config.strongDelimiter,
      linkStyle: config.linkStyle,
      linkReferenceStyle: config.linkReferenceStyle,
    });

    return turndownService.turndown(html);
  } catch (error) {
    throw new Error(
      `Failed to convert HTML to Markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts HTML to Markdown with custom conversion rules
 * @param html - HTML string to convert
 * @param customRules - Optional object mapping selectors to custom rule functions
 * @returns Converted Markdown string
 * @throws Error if conversion fails
 */
export function htmlToMarkdownCustom(
  html: string,
  customRules?: Record<string, (node: unknown, options: unknown) => string>,
): string {
  try {
    const turndownService = new TurndownService();

    if (customRules) {
      for (const [selector, rule] of Object.entries(customRules)) {
        turndownService.addRule(selector, {
          filter: (node) => {
            if (typeof selector === "string") {
              return node.nodeName === selector.toUpperCase();
            }
            return false;
          },
          replacement: rule,
        });
      }
    }

    return turndownService.turndown(html);
  } catch (error) {
    throw new Error(
      `Failed to convert HTML to Markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts plain text from HTML while preserving basic structure
 * @param html - HTML string to convert
 * @returns Plain text string with basic formatting
 * @throws Error if conversion fails
 */
export function htmlToText(html: string): string {
  try {
    const turndownService = new TurndownService({
      headingStyle: "setext",
      codeBlockStyle: "indented",
    });

    return turndownService.turndown(html);
  } catch (error) {
    throw new Error(
      `Failed to convert HTML to text: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
