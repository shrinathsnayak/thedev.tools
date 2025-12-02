/**
 * DOCX to PDF Converter
 * Converts DOCX files to PDF via HTML conversion
 * Note: This is a limited conversion - complex formatting may not be preserved perfectly
 */

import { docxToHtml } from "./docx-converter";
import { htmlToPdf, HtmlToPdfOptions } from "./html-to-pdf";

export interface DocxToPdfOptions extends Omit<HtmlToPdfOptions, "htmlStyles"> {
  preserveFormatting?: boolean; // Attempt to preserve more formatting (adds CSS)
}

/**
 * Converts DOCX file to PDF via HTML conversion
 * @param file - DOCX file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Conversion options (preserveFormatting, format, orientation, margin, quality)
 * @returns Promise resolving to PDF Blob
 * @throws Error if conversion fails
 */
export async function docxToPdf(
  file: File | Blob | ArrayBuffer | Uint8Array,
  options: DocxToPdfOptions = {},
): Promise<Blob> {
  try {
    const { preserveFormatting = true, ...pdfOptions } = options;

    const { html, messages } = await docxToHtml(file, {
      includeDefaultStyleMap: true,
      includeEmbeddedStyleMap: true,
    });

    if (messages.length > 0) {
      console.warn("DOCX conversion warnings:", messages);
    }

    const htmlStyles = preserveFormatting
      ? `
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #000;
        }
        h1, h2, h3, h4, h5, h6 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: bold;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.17em; }
        h4 { font-size: 1em; }
        h5 { font-size: 0.83em; }
        h6 { font-size: 0.67em; }
        p {
          margin: 0.5em 0;
        }
        strong, b {
          font-weight: bold;
        }
        em, i {
          font-style: italic;
        }
        ul, ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }
        blockquote {
          margin: 1em 2em;
          padding-left: 1em;
          border-left: 3px solid #ccc;
          color: #666;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        table td, table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    `
      : "";

    const pdfBlob = await htmlToPdf(html, {
      ...pdfOptions,
      htmlStyles,
    });

    return pdfBlob;
  } catch (error) {
    throw new Error(
      `Failed to convert DOCX to PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
