/**
 * Image utilities
 * Common functions for image-related operations
 */

export type ImageFormat =
  | "jpeg"
  | "jpg"
  | "png"
  | "webp"
  | "gif"
  | "bmp"
  | "ico";

/**
 * Gets MIME type string for image format
 * @param format - Image format
 * @returns MIME type string
 */
export function getImageMimeType(format: ImageFormat): string {
  const mimeTypes: Record<ImageFormat, string> = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
    ico: "image/x-icon",
  };

  return mimeTypes[format] || "image/jpeg";
}

