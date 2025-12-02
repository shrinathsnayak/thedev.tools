/**
 * PDF to Text Converter
 * Extracts text content from PDF files
 * Uses pdf.js for client-side PDF parsing
 */

import * as pdfjsLib from "pdfjs-dist";
import { toArrayBuffer } from "../../utils/file-converter";

if (typeof window !== "undefined") {
  const workerPath = (window as any).__PDFJS_WORKER_PATH__;

  if (workerPath) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
  } else {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url,
      ).toString();
    } catch {
      if (
        typeof process !== "undefined" &&
        process.env?.NODE_ENV === "production"
      ) {
        console.warn(
          "[PDF.js] Production mode: Set window.__PDFJS_WORKER_PATH__ for offline PWA support",
        );
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  }
}

export interface PdfTextExtractionOptions {
  maxPages?: number; // Limit number of pages to extract
  includePageNumbers?: boolean; // Include page numbers in output
}

/**
 * Extracts text content from PDF file
 * @param file - PDF file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Extraction options (maxPages, includePageNumbers)
 * @returns Promise resolving to object with text, pageCount, and pages array
 * @throws Error if extraction fails
 */
export async function pdfToText(
  file: File | Blob | ArrayBuffer | Uint8Array,
  options: PdfTextExtractionOptions = {},
): Promise<{
  text: string;
  pageCount: number;
  pages: Array<{ pageNumber: number; text: string }>;
}> {
  try {
    const { maxPages, includePageNumbers = false } = options;

    const arrayBuffer = await toArrayBuffer(file);

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
    });

    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;
    const pagesToProcess = maxPages ? Math.min(maxPages, pageCount) : pageCount;

    const pages: Array<{ pageNumber: number; text: string }> = [];
    let fullText = "";

    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = (textContent.items as any[])
        .map((item: any) => {
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .join(" ");

      pages.push({
        pageNumber: pageNum,
        text: pageText,
      });

      if (includePageNumbers && pageNum > 1) {
        fullText += `\n\n--- Page ${pageNum} ---\n\n`;
      }
      fullText += pageText;

      if (pageNum < pagesToProcess) {
        fullText += "\n\n";
      }
    }

    return {
      text: fullText.trim(),
      pageCount,
      pages,
    };
  } catch (error) {
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Gets PDF metadata including title, author, creation date, and page count
 * @param file - PDF file (File, Blob, ArrayBuffer, or Uint8Array)
 * @returns Promise resolving to PDF metadata object
 * @throws Error if metadata extraction fails
 */
export async function getPdfMetadata(
  file: File | Blob | ArrayBuffer | Uint8Array,
): Promise<{
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
}> {
  try {
    const arrayBuffer = await toArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
    });

    const pdfDocument = await loadingTask.promise;
    const metadata = await pdfDocument.getMetadata();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info = metadata.info as any;

    return {
      title: info?.Title as string | undefined,
      author: info?.Author as string | undefined,
      subject: info?.Subject as string | undefined,
      keywords: info?.Keywords as string | undefined,
      creator: info?.Creator as string | undefined,
      producer: info?.Producer as string | undefined,
      creationDate: info?.CreationDate as string | undefined,
      modificationDate: info?.ModDate as string | undefined,
      pageCount: pdfDocument.numPages,
    };
  } catch (error) {
    throw new Error(
      `Failed to get PDF metadata: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

