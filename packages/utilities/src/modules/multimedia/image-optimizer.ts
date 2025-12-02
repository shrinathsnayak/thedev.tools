/**
 * Image optimizer using Canvas API
 * Client-side image optimization/compression
 */

import { toBlob } from "../../utils/file-converter";

export interface ImageOptimizeOptions {
  quality?: number; // 0.0 to 1.0 (JPEG/WebP only)
  format?: "jpeg" | "jpg" | "png" | "webp";
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Optimizes image by converting format, adjusting quality, and optionally resizing
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Optimization options (quality, format, maxWidth, maxHeight, maintainAspectRatio)
 * @returns Promise resolving to optimized image Blob
 * @throws Error if optimization fails
 */
export async function optimizeImage(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  options: ImageOptimizeOptions = {},
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

    const quality = options.quality !== undefined ? options.quality : 0.82;
    const format = options.format || "webp";
    const mimeType =
      format === "jpg" || format === "jpeg" ? "image/jpeg" : `image/${format}`;

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to optimize image"));
          }
        },
        mimeType,
        format === "jpeg" || format === "jpg" || format === "webp"
          ? quality
          : undefined,
      );
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * Estimates image file size reduction after optimization
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param targetFormat - Target image format (default: webp)
 * @param quality - Target quality 0.0-1.0 (default: 0.82)
 * @returns Promise resolving to optimization estimate with originalSize, estimatedSize, and reductionPercent
 */
export async function estimateOptimization(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  targetFormat: "jpeg" | "webp" | "png" = "webp",
  quality: number = 0.82,
): Promise<{
  originalSize: number;
  estimatedSize: number;
  reductionPercent: number;
}> {
  const file = toBlob(inputFile);
  const originalSize = file.size;

  const sizeReduction = {
    jpeg: 0.7,
    webp: 0.65,
    png: 0.9,
  };

  const estimatedSize = Math.round(
    originalSize * (sizeReduction[targetFormat] || 0.7) * quality,
  );
  const reductionPercent = Math.round(
    ((originalSize - estimatedSize) / originalSize) * 100,
  );

  return {
    originalSize,
    estimatedSize,
    reductionPercent,
  };
}
