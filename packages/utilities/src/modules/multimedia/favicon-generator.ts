/**
 * Favicon generator using Canvas API
 * Generates favicons from images in various sizes
 */

import { toBlob } from "../../utils/file-converter";

export interface FaviconSizes {
  "16x16": boolean;
  "32x32": boolean;
  "48x48": boolean;
  "64x64": boolean;
  "96x96": boolean;
  "128x128": boolean;
  "180x180": boolean; // Apple touch icon
  "192x192": boolean; // Android
  "512x512": boolean; // PWA
}

/**
 * Generates favicon in specified size and format
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param size - Favicon size in pixels (square)
 * @param format - Output format (png or ico, default: png)
 * @returns Promise resolving to favicon Blob
 * @throws Error if image loading or generation fails
 */
export async function generateFavicon(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  size: number,
  format: "png" | "ico" = "png",
): Promise<Blob> {
  const inputBlob = toBlob(inputFile);

  const img = new Image();
  const imageUrl = URL.createObjectURL(inputBlob);

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // High quality rendering for small images
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, size, size);

    const mimeType = format === "ico" ? "image/x-icon" : "image/png";

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate favicon"));
        }
      }, mimeType);
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * Generates multiple favicon sizes from input image
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param sizes - Object mapping size strings to enabled flags (defaults to common sizes)
 * @returns Promise resolving to object mapping size strings to Blob objects
 */
export async function generateFavicons(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  sizes: Partial<FaviconSizes> = {},
): Promise<Record<string, Blob>> {
  const defaultSizes: FaviconSizes = {
    "16x16": true,
    "32x32": true,
    "48x48": true,
    "64x64": false,
    "96x96": false,
    "128x128": false,
    "180x180": true, // Apple touch icon
    "192x192": true, // Android
    "512x512": false,
  };

  const activeSizes = { ...defaultSizes, ...sizes };
  const results: Record<string, Blob> = {};

  for (const [sizeStr, enabled] of Object.entries(activeSizes)) {
    if (enabled) {
      const size = Number.parseInt(sizeStr.split("x")[0] || "32", 10);
      const favicon = await generateFavicon(inputFile, size);
      results[sizeStr] = favicon;
    }
  }

  return results;
}

/**
 * Generates HTML link tags for favicons
 * @param favicons - Object mapping size strings to favicon Blobs
 * @param basePath - Base path for favicon files (default: "/favicons")
 * @returns HTML string with link tags for all favicons
 */
export function generateFaviconLinks(
  favicons: Record<string, Blob>,
  basePath: string = "/favicons",
): string {
  const links: string[] = [];

  for (const [size, blob] of Object.entries(favicons)) {
    const [width, height] = size.split("x").map(Number);
    const rel = size === "180x180" ? "apple-touch-icon" : "icon";
    const type = blob.type || "image/png";
    const href = `${basePath}/favicon-${size}.png`;

    links.push(
      `<link rel="${rel}" type="${type}" sizes="${size}" href="${href}">`,
    );
  }

  return links.join("\n");
}
