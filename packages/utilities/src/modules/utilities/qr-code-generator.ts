/**
 * QR Code Generator
 * Uses 'qrcode' package for QR code generation
 */

import QRCode from "qrcode";

export interface QrCodeOptions {
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  type?: "image/png" | "image/jpeg" | "image/webp";
  quality?: number; // 0-1 for JPEG
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  width?: number;
}

/**
 * Generates a QR code as a data URL string (base64 encoded image)
 * @param text - The text or data to encode in the QR code
 * @param options - QR code generation options (error correction, colors, size, etc.)
 * @returns Promise that resolves to data URL string
 * @throws Error if QR code generation fails
 */
export async function generateQrCodeDataUrl(
  text: string,
  options: QrCodeOptions = {},
): Promise<string> {
  try {
    const qrOptions = {
      errorCorrectionLevel: (options.errorCorrectionLevel || "M") as
        | "L"
        | "M"
        | "Q"
        | "H",
      type: (options.type || "image/png") as
        | "image/png"
        | "image/jpeg"
        | "image/webp",
      quality: options.quality ?? 0.92,
      margin: options.margin ?? 4,
      color: options.color || {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: options.width || 300,
    };

    return await QRCode.toDataURL(text, qrOptions);
  } catch (error) {
    throw new Error(
      `Failed to generate QR code: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Generates a QR code as an SVG string
 * @param text - The text or data to encode in the QR code
 * @param options - QR code generation options (error correction, colors, size, etc.)
 * @returns Promise that resolves to SVG string
 * @throws Error if QR code generation fails
 */
export async function generateQrCodeSvg(
  text: string,
  options: QrCodeOptions = {},
): Promise<string> {
  try {
    const qrOptions = {
      errorCorrectionLevel: (options.errorCorrectionLevel || "M") as
        | "L"
        | "M"
        | "Q"
        | "H",
      type: "svg" as const,
      margin: options.margin ?? 4,
      color: options.color || {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: options.width || 300,
    };

    return await QRCode.toString(text, qrOptions);
  } catch (error) {
    throw new Error(
      `Failed to generate QR code SVG: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Generates a QR code and renders it to a canvas element (browser only)
 * @param text - The text or data to encode in the QR code
 * @param canvas - HTML canvas element to render the QR code on
 * @param options - QR code generation options (error correction, colors, size, etc.)
 * @returns Promise that resolves when QR code is rendered
 * @throws Error if QR code generation fails
 */
export async function generateQrCodeCanvas(
  text: string,
  canvas: HTMLCanvasElement,
  options: QrCodeOptions = {},
): Promise<void> {
  try {
    const qrOptions = {
      errorCorrectionLevel: (options.errorCorrectionLevel || "M") as
        | "L"
        | "M"
        | "Q"
        | "H",
      margin: options.margin ?? 4,
      color: options.color || {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: options.width || 300,
    };

    await QRCode.toCanvas(canvas, text, qrOptions);
  } catch (error) {
    throw new Error(
      `Failed to generate QR code canvas: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
