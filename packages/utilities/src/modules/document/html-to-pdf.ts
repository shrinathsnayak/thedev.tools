/**
 * HTML/Markdown to PDF Converter
 * Converts HTML or Markdown content to PDF
 * Uses jsPDF and html2pdf for client-side PDF generation
 */

import { jsPDF } from "jspdf";
// @ts-ignore - html2pdf.js may not have perfect types
import html2pdf from "html2pdf.js";
import { marked } from "marked";

export interface HtmlToPdfOptions {
  format?: "a4" | "letter" | [number, number]; // [width, height] in mm
  orientation?: "portrait" | "landscape";
  margin?: number | [number, number, number, number]; // [top, right, bottom, left] in mm
  quality?: number; // 0 to 1
  htmlStyles?: string; // Additional CSS styles
}

/**
 * Converts HTML string to PDF
 * @param html - HTML string to convert
 * @param options - PDF generation options (format, orientation, margin, quality, htmlStyles)
 * @returns Promise resolving to PDF Blob
 * @throws Error if conversion fails
 */
export async function htmlToPdf(
  html: string,
  options: HtmlToPdfOptions = {},
): Promise<Blob> {
  try {
    const {
      format = "a4",
      orientation = "portrait",
      margin = 10,
      quality = 0.95,
      htmlStyles = "",
    } = options;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    if (htmlStyles) {
      const styleElement = document.createElement("style");
      styleElement.textContent = htmlStyles;
      tempDiv.appendChild(styleElement);
    }

    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    try {
      const opt = {
        margin: Array.isArray(margin)
          ? margin
          : typeof margin === "number"
            ? [margin, margin, margin, margin]
            : [margin, margin, margin, margin],
        filename: "document.pdf",
        image: { type: "jpeg", quality },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: Array.isArray(format) ? format : format.toUpperCase(),
          orientation,
        },
      };

      const pdfBlob = await html2pdf().set(opt).from(tempDiv).outputPdf("blob");
      return pdfBlob;
    } finally {
      document.body.removeChild(tempDiv);
    }
  } catch (error) {
    throw new Error(
      `Failed to convert HTML to PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts Markdown string to PDF via HTML conversion
 * @param markdown - Markdown string to convert
 * @param options - PDF generation options
 * @returns Promise resolving to PDF Blob
 * @throws Error if conversion fails
 */
export async function markdownToPdf(
  markdown: string,
  options: HtmlToPdfOptions = {},
): Promise<Blob> {
  try {
    const html = await marked.parse(markdown, {
      breaks: true,
      gfm: true,
    });

    const styledHtml = `<div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">${html}</div>`;

    return htmlToPdf(styledHtml, options);
  } catch (error) {
    throw new Error(
      `Failed to convert Markdown to PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts plain text to PDF using jsPDF
 * @param text - Text string to convert
 * @param options - PDF generation options (format, orientation, fontSize, fontFamily, margin)
 * @returns Promise resolving to PDF Blob
 * @throws Error if conversion fails
 */
export async function textToPdf(
  text: string,
  options: {
    format?: "a4" | "letter" | [number, number];
    orientation?: "portrait" | "landscape";
    fontSize?: number;
    fontFamily?: string;
    margin?: number;
  } = {},
): Promise<Blob> {
  try {
    const {
      format = "a4",
      orientation = "portrait",
      fontSize = 12,
      fontFamily = "helvetica",
      margin = 10,
    } = options;

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: Array.isArray(format) ? format : format.toUpperCase(),
    });

    pdf.setFont(fontFamily);
    pdf.setFontSize(fontSize);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const lines = pdf.splitTextToSize(text, maxWidth);

    let y = margin;

    for (const line of lines) {
      if (y + fontSize > maxHeight) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += fontSize * 0.5;
    }

    return new Blob([pdf.output("blob")], { type: "application/pdf" });
  } catch (error) {
    throw new Error(
      `Failed to convert text to PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
