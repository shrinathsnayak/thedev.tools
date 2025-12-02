/**
 * DOCX Converter
 * Converts DOCX files to HTML, Markdown, or plain text
 * Uses mammoth.js for client-side DOCX parsing
 */

// @ts-ignore - mammoth may not have perfect types
import mammoth from "mammoth";
import { toArrayBuffer } from "../../utils/file-converter";

export interface DocxConversionOptions {
  includeDefaultStyleMap?: boolean;
  includeEmbeddedStyleMap?: boolean;
  styleMap?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertImage?: (image: any) => Promise<any>;
}

/**
 * Converts DOCX file to HTML format
 * @param file - DOCX file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Conversion options (styleMap, includeDefaultStyleMap, etc.)
 * @returns Promise resolving to object with HTML string and conversion messages
 * @throws Error if conversion fails
 */
export async function docxToHtml(
  file: File | Blob | ArrayBuffer | Uint8Array,
  options: DocxConversionOptions = {},
): Promise<{ html: string; messages: string[] }> {
  try {
    const arrayBuffer = await toArrayBuffer(file);
    const mammothOptions: any = {
      styleMap: options.styleMap || [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
        "r[style-name='Strong'] => strong",
        "p[style-name='Quote'] => blockquote:fresh",
      ],
      includeDefaultStyleMap: options.includeDefaultStyleMap ?? true,
      includeEmbeddedStyleMap: options.includeEmbeddedStyleMap ?? true,
    };

    if (options.convertImage) {
      mammothOptions.convertImage = options.convertImage;
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, mammothOptions);

    return {
      html: result.value,
      messages: result.messages.map((msg) => msg.message),
    };
  } catch (error) {
    throw new Error(
      `Failed to convert DOCX to HTML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts DOCX file to Markdown format (via HTML conversion)
 * @param file - DOCX file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Conversion options
 * @returns Promise resolving to object with Markdown string and conversion messages
 * @throws Error if conversion fails
 */
export async function docxToMarkdown(
  file: File | Blob | ArrayBuffer | Uint8Array,
  options: DocxConversionOptions = {},
): Promise<{ markdown: string; messages: string[] }> {
  try {
    const { html, messages } = await docxToHtml(file, options);

    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n")
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n")
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n")
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return {
      markdown,
      messages,
    };
  } catch (error) {
    throw new Error(
      `Failed to convert DOCX to Markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts DOCX file to plain text
 * @param file - DOCX file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Conversion options (excluding styleMap)
 * @returns Promise resolving to object with text string and conversion messages
 * @throws Error if conversion fails
 */
export async function docxToText(
  file: File | Blob | ArrayBuffer | Uint8Array,
  options: Omit<DocxConversionOptions, "styleMap"> = {},
): Promise<{ text: string; messages: string[] }> {
  try {
    const arrayBuffer = await toArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });

    return {
      text: result.value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: result.messages.map((msg: any) => msg.message || String(msg)),
    };
  } catch (error) {
    throw new Error(
      `Failed to convert DOCX to text: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

