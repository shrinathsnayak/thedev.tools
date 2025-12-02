/**
 * Image format converter using Canvas API
 * Client-side image format conversion without backend
 */

import { toBlob } from "../../utils/file-converter";
import { getImageMimeType, type ImageFormat } from "../../utils/image";

export interface ImageConversionOptions {
  quality?: number; // 0.0 to 1.0 (for lossy formats)
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean; // default: true
}

/**
 * Converts image to specified format with optional resizing and quality options
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param outputFormat - Target image format
 * @param options - Conversion options (quality, maxWidth, maxHeight, maintainAspectRatio)
 * @returns Promise resolving to converted image Blob
 * @throws Error if image loading or conversion fails
 */
export async function convertImageFormat(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  outputFormat: ImageFormat,
  options: ImageConversionOptions = {},
): Promise<Blob> {
  const inputBlob = toBlob(inputFile);

  // Create image element
  const img = new Image();
  const imageUrl = URL.createObjectURL(inputBlob);

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    let { width, height } = img;

    if (options.maxWidth || options.maxHeight) {
      const maxWidth = options.maxWidth ?? Infinity;
      const maxHeight = options.maxHeight ?? Infinity;
      const maintainAspectRatio = options.maintainAspectRatio !== false;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (maintainAspectRatio) {
          if (width > height) {
            width = Math.min(width, maxWidth);
            height = width / aspectRatio;
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }
          } else {
            height = Math.min(height, maxHeight);
            width = height * aspectRatio;
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
          }
        } else {
          width = Math.min(width, maxWidth);
          height = Math.min(height, maxHeight);
        }
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    ctx.drawImage(img, 0, 0, width, height);

    const quality = options.quality !== undefined ? options.quality : 0.92;
    const mimeType = getImageMimeType(outputFormat);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert image"));
          }
        },
        mimeType,
        outputFormat === "jpeg" ||
          outputFormat === "jpg" ||
          outputFormat === "webp"
          ? quality
          : undefined,
      );
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}


/**
 * Validates if input file is a valid image
 * @param file - File, Blob, ArrayBuffer, or Uint8Array to validate
 * @returns Promise resolving to true if valid image, false otherwise
 */
export async function validateImage(
  file: File | Blob | ArrayBuffer | Uint8Array,
): Promise<boolean> {
  try {
    const inputBlob = toBlob(file);

    const img = new Image();
    const imageUrl = URL.createObjectURL(inputBlob);

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = imageUrl;
      });

      return true;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  } catch {
    return false;
  }
}
