/**
 * Image resizer using Canvas API
 * Client-side image resizing without backend
 */

import { toBlob } from "../../utils/file-converter";

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean; // default: true
  quality?: number; // 0.0 to 1.0
  format?: "jpeg" | "jpg" | "png" | "webp";
}

/**
 * Resizes image to specified dimensions with optional quality and format options
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param options - Resize options (width, height, maintainAspectRatio, quality, format)
 * @returns Promise resolving to resized image Blob
 * @throws Error if resizing fails
 */
export async function resizeImage(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  options: ImageResizeOptions,
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

    const maintainAspectRatio = options.maintainAspectRatio !== false;

    if (options.width || options.height) {
      const targetWidth = options.width ?? width;
      const targetHeight = options.height ?? height;

      if (maintainAspectRatio) {
        const aspectRatio = width / height;

        if (options.width && !options.height) {
          width = targetWidth;
          height = width / aspectRatio;
        } else if (options.height && !options.width) {
          height = targetHeight;
          width = height * aspectRatio;
        } else {
          const widthRatio = targetWidth / width;
          const heightRatio = targetHeight / height;
          const ratio = Math.min(widthRatio, heightRatio);

          width = width * ratio;
          height = height * ratio;
        }
      } else {
        width = targetWidth;
        height = targetHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, width, height);

    const quality = options.quality !== undefined ? options.quality : 0.92;
    const format = options.format || "png";
    const mimeType =
      format === "jpg" || format === "jpeg" ? "image/jpeg" : `image/${format}`;

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to resize image"));
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
 * Resizes image to fit within maximum dimensions while maintaining aspect ratio
 * @param inputFile - Input image file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param options - Additional resize options (maintainAspectRatio, quality, format)
 * @returns Promise resolving to resized image Blob
 * @throws Error if resizing fails
 */
export async function resizeImageToFit(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  maxWidth: number,
  maxHeight: number,
  options: Omit<ImageResizeOptions, "width" | "height"> = {},
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

    let { width, height } = img;

    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    if (ratio < 1) {
      width = width * ratio;
      height = height * ratio;
    }

    return resizeImage(inputFile, {
      ...options,
      width: Math.round(width),
      height: Math.round(height),
      maintainAspectRatio: true,
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}
