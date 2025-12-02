import { minify as htmlMinify } from "html-minifier-terser";
import { html as beautifyHtmlLib } from "js-beautify";

/**
 * Comprehensive HTML utilities: beautifier, minifier, validator, and extractors
 */

export interface HtmlMinifyOptions {
  removeComments?: boolean;
  collapseWhitespace?: boolean;
  removeAttributeQuotes?: boolean;
  removeEmptyAttributes?: boolean;
  minifyCSS?: boolean;
  minifyJS?: boolean;
  removeOptionalTags?: boolean;
  removeRedundantAttributes?: boolean;
  removeScriptTypeAttributes?: boolean;
  removeStyleLinkTypeAttributes?: boolean;
  useShortDoctype?: boolean;
}

export interface HtmlBeautifyOptions {
  indent_size?: number;
  indent_char?: string;
  indent_inner_html?: boolean;
  wrap_line_length?: number;
  wrap_attributes?:
    | "auto"
    | "force"
    | "force-aligned"
    | "force-expand-multiline"
    | "aligned-multiple"
    | "preserve"
    | "preserve-aligned";
  end_with_newline?: boolean;
  extra_liners?: string[];
}

const defaultMinifyOptions: HtmlMinifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  removeOptionalTags: false,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
};

/**
 * Validates HTML structure and checks for common issues
 * @param html - The HTML string to validate
 * @returns Validation result with errors and warnings
 */
export function validateHtml(html: string): {
  isValid: boolean;
  error?: string;
  warnings?: string[];
} {
  const warnings: string[] = [];

  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const parseErrors = doc.querySelectorAll("parsererror");
      if (parseErrors.length > 0) {
        return {
          isValid: false,
          error: Array.from(parseErrors)
            .map((el) => el.textContent || "Parse error")
            .join(", "),
          warnings,
        };
      }

      const allTags = html.match(/<[^>]+>/g) || [];
      const openTags: string[] = [];

      for (const tag of allTags) {
        if (tag.startsWith("</")) {
          const tagName = tag.match(/<\/(\w+)/)?.[1];
          const lastOpen = openTags.pop();
          if (lastOpen !== tagName) {
            warnings.push(
              `Potential mismatched tag: expected </${lastOpen}>, found ${tag}`,
            );
          }
        } else if (
          !tag.endsWith("/>") &&
          !tag.match(
            /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i,
          )
        ) {
          const tagName = tag.match(/<(\w+)/)?.[1];
          if (tagName) {
            openTags.push(tagName);
          }
        }
      }

      if (openTags.length > 0) {
        warnings.push(`Unclosed tags: ${openTags.join(", ")}`);
      }

      return { isValid: true, warnings };
    }

    return _validateHtmlBasic(html, warnings);
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid HTML",
      warnings,
    };
  }
}

/**
 * Basic HTML validation fallback when DOMParser is unavailable
 * @param html - The HTML string to validate
 * @param warnings - Array to collect warnings
 * @returns Validation result
 */
function _validateHtmlBasic(
  html: string,
  warnings: string[],
): {
  isValid: boolean;
  error?: string;
  warnings?: string[];
} {
  const openTags = (html.match(/<[^\/][^>]*>/g) || []).length;
    const closeTags = (html.match(/<\/[^>]+>/g) || []).length;

    if (openTags !== closeTags) {
      return {
        isValid: false,
        error: "Mismatched HTML tags",
        warnings,
      };
    }

    return { isValid: true, warnings };
}

/**
 * Beautifies HTML with proper indentation and formatting
 * @param html - The HTML string to beautify
 * @param options - Beautification options (indent size, wrapping, etc.)
 * @returns Beautified HTML string
 * @throws Error if beautification fails
 */
export function beautifyHtml(
  html: string,
  options: HtmlBeautifyOptions = {},
): string {
  const config: HtmlBeautifyOptions = {
    indent_size: 2,
    indent_char: " ",
    indent_inner_html: false,
    wrap_line_length: 0,
    wrap_attributes: "auto",
    end_with_newline: true,
    ...options,
  };

  try {
    return beautifyHtmlLib(html, config);
  } catch (error) {
    throw new Error(
      `Failed to beautify HTML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Minifies HTML by removing whitespace, comments, and optional tags
 * @param html - The HTML string to minify
 * @param options - Minification options (remove comments, collapse whitespace, etc.)
 * @returns Promise that resolves to minified HTML string
 * @throws Error if minification fails
 */
export async function minifyHtml(
  html: string,
  options: HtmlMinifyOptions = {},
): Promise<string> {
  try {
    const config = { ...defaultMinifyOptions, ...options };

    const result = await htmlMinify(html, {
      removeComments: config.removeComments,
      collapseWhitespace: config.collapseWhitespace,
      removeAttributeQuotes: config.removeAttributeQuotes,
      removeEmptyAttributes: config.removeEmptyAttributes,
      minifyCSS: config.minifyCSS,
      minifyJS: config.minifyJS,
      removeOptionalTags: config.removeOptionalTags,
      removeRedundantAttributes: config.removeRedundantAttributes,
      removeScriptTypeAttributes: config.removeScriptTypeAttributes,
      removeStyleLinkTypeAttributes: config.removeStyleLinkTypeAttributes,
      useShortDoctype: config.useShortDoctype,
      caseSensitive: false,
      keepClosingSlash: false,
    });

    return result;
  } catch (error) {
    throw new Error(
      `Failed to minify HTML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts plain text content from HTML by removing all tags and scripts
 * @param html - The HTML string to extract text from
 * @returns Plain text content without HTML tags
 * @throws Error if extraction fails
 */
export function extractTextFromHtml(html: string): string {
  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc.body.textContent || doc.documentElement.textContent || "";
    }

    return _extractTextFromHtmlFallback(html);
  } catch (error) {
    throw new Error(
      `Failed to extract text: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Fallback method to extract text from HTML using regex when DOMParser is unavailable
 * @param html - The HTML string to process
 * @returns Plain text content
 */
function _extractTextFromHtmlFallback(html: string): string {
  return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
}

/**
 * Extracts all anchor links from HTML with their text and href attributes
 * @param html - The HTML string to extract links from
 * @returns Array of link objects with text and href properties
 * @throws Error if extraction fails
 */
export function extractLinks(
  html: string,
): Array<{ text: string; href: string }> {
  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const links = doc.querySelectorAll("a[href]");

      return Array.from(links).map((link) => ({
        text: link.textContent || "",
        href: link.getAttribute("href") || "",
      }));
    }

    return _extractLinksFallback(html);
  } catch (error) {
    throw new Error(
      `Failed to extract links: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Fallback method to extract links using regex when DOMParser is unavailable
 * @param html - The HTML string to process
 * @returns Array of link objects
 */
function _extractLinksFallback(
  html: string,
): Array<{ text: string; href: string }> {
  const links: Array<{ text: string; href: string }> = [];
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      if (match[1] && match[2]) {
        links.push({
          text: match[2].replace(/<[^>]+>/g, "").trim(),
          href: match[1],
        });
      }
    }

    return links;
}

/**
 * Extracts all image elements from HTML with their src and alt attributes
 * @param html - The HTML string to extract images from
 * @returns Array of image objects with src and optional alt properties
 * @throws Error if extraction fails
 */
export function extractImages(
  html: string,
): Array<{ src: string; alt?: string }> {
  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const images = doc.querySelectorAll("img[src]");

      return Array.from(images).map((img) => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || undefined,
      }));
    }

    return _extractImagesFallback(html);
  } catch (error) {
    throw new Error(
      `Failed to extract images: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Fallback method to extract images using regex when DOMParser is unavailable
 * @param html - The HTML string to process
 * @returns Array of image objects
 */
function _extractImagesFallback(
  html: string,
): Array<{ src: string; alt?: string }> {
  const images: Array<{ src: string; alt?: string }> = [];
    const imgRegex =
      /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      if (match[1]) {
        images.push({
          src: match[1],
          alt: match[2],
        });
      }
    }

    return images;
}

/**
 * Extracts all meta tags from HTML and returns them as a key-value object
 * @param html - The HTML string to extract meta tags from
 * @returns Object mapping meta tag names/properties to their content values
 * @throws Error if extraction fails
 */
export function extractMetaTags(html: string): Record<string, string> {
  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const metas = doc.querySelectorAll("meta");

      const metaTags: Record<string, string> = {};
      for (const meta of Array.from(metas)) {
        const name =
          meta.getAttribute("name") || meta.getAttribute("property") || "";
        const content = meta.getAttribute("content") || "";
        if (name) {
          metaTags[name] = content;
        }
      }
      return metaTags;
    }

    return _extractMetaTagsFallback(html);
  } catch (error) {
    throw new Error(
      `Failed to extract meta tags: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Fallback method to extract meta tags using regex when DOMParser is unavailable
 * @param html - The HTML string to process
 * @returns Object mapping meta tag names to content
 */
function _extractMetaTagsFallback(html: string): Record<string, string> {
  const metaTags: Record<string, string> = {};
    const metaRegex =
      /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      if (match[1] && match[2]) {
        metaTags[match[1]] = match[2];
      }
    }

    return metaTags;
}

/**
 * Analyzes HTML and returns detailed statistics about tags, elements, and structure
 * @param html - The HTML string to analyze
 * @returns Object containing tag counts, element counts, text length, and structure flags
 */
export function getHtmlStats(html: string): {
  totalTags: number;
  totalElements: number;
  totalAttributes: number;
  textLength: number;
  hasDoctype: boolean;
  hasHtmlTag: boolean;
  hasHeadTag: boolean;
  hasBodyTag: boolean;
} {
  const textContent = extractTextFromHtml(html);
  const allTags = html.match(/<[^>]+>/g) || [];
  const elements = new Set(
    allTags.map((tag) => tag.match(/<(\w+)/)?.[1]).filter(Boolean) as string[],
  );

  return {
    totalTags: allTags.length,
    totalElements: elements.size,
    totalAttributes: (html.match(/\w+=["']/g) || []).length,
    textLength: textContent.length,
    hasDoctype: /<!doctype/i.test(html),
    hasHtmlTag: /<html/i.test(html),
    hasHeadTag: /<head/i.test(html),
    hasBodyTag: /<body/i.test(html),
  };
}

/**
 * Calculates size statistics comparing original and minified HTML
 * @param original - Original HTML string
 * @param minified - Minified HTML string
 * @returns Object containing size comparison metrics
 */
export function getHtmlSizeStats(original: string, minified: string) {
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
