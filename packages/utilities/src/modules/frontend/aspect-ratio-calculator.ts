/**
 * Aspect Ratio Calculator
 * Calculates and converts aspect ratios
 */

import type { AspectRatio, AspectRatioPreset } from "@workspace/types/aspect-ratio";
import { ASPECT_RATIO_PRESETS } from "@workspace/constants/aspect-ratio";

// Re-export for backward compatibility
export type { AspectRatio, AspectRatioPreset } from "@workspace/types/aspect-ratio";
export { ASPECT_RATIO_PRESETS } from "@workspace/constants/aspect-ratio";

/**
 * Calculates aspect ratio from width and height
 */
export function calculateAspectRatio(
  width: number,
  height: number,
): AspectRatio {
  if (height === 0) {
    throw new Error("Height cannot be zero");
  }

  const ratio = width / height;
  const gcd = getGCD(width, height);
  const string = `${width / gcd}:${height / gcd}`;

  return {
    width,
    height,
    ratio,
    string,
    decimal: Math.round(ratio * 100) / 100,
  };
}

/**
 * Calculates dimensions from aspect ratio and one dimension
 */
export function calculateDimensions(
  aspectRatio: string | number,
  width?: number,
  height?: number,
): { width: number; height: number } {
  let ratio: number;

  if (typeof aspectRatio === "string") {
    const [w, h] = aspectRatio.split(":").map(Number);
    if (!w || !h) {
      throw new Error(`Invalid aspect ratio format: ${aspectRatio}`);
    }
    ratio = w / h;
  } else {
    ratio = aspectRatio;
  }

  if (width && !height) {
    return {
      width,
      height: Math.round(width / ratio),
    };
  } else if (height && !width) {
    return {
      width: Math.round(height * ratio),
      height,
    };
  } else {
    throw new Error("Either width or height must be provided");
  }
}

/**
 * Converts aspect ratio to percentage (for padding-top hack)
 */
export function aspectRatioToPercentage(aspectRatio: string | number): number {
  let ratio: number;

  if (typeof aspectRatio === "string") {
    const [w, h] = aspectRatio.split(":").map(Number);
    if (!w || !h) {
      throw new Error(`Invalid aspect ratio format: ${aspectRatio}`);
    }
    ratio = h / w;
  } else {
    ratio = 1 / aspectRatio;
  }

  return Math.round(ratio * 100 * 100) / 100;
}

/**
 * Finds closest preset aspect ratio
 */
export function findClosestPreset(ratio: number): AspectRatioPreset {
  let closest = ASPECT_RATIO_PRESETS[0]!;
  let minDiff = Math.abs(ratio - closest.ratio);

  for (const preset of ASPECT_RATIO_PRESETS) {
    const diff = Math.abs(ratio - preset.ratio);
    if (diff < minDiff) {
      minDiff = diff;
      closest = preset;
    }
  }

  return closest;
}

/**
 * Simplifies aspect ratio to lowest terms (e.g., 1920:1080 -> 16:9)
 */
export function simplifyAspectRatio(width: number, height: number): string {
  const gcd = getGCD(width, height);
  return `${width / gcd}:${height / gcd}`;
}

/**
 * Calculates Greatest Common Divisor (Euclidean algorithm)
 */
function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * Validates if dimensions match aspect ratio (within tolerance)
 */
export function matchesAspectRatio(
  width: number,
  height: number,
  targetRatio: string | number,
  tolerance: number = 0.01,
): boolean {
  let ratio: number;

  if (typeof targetRatio === "string") {
    const [w, h] = targetRatio.split(":").map(Number);
    if (!w || !h) {
      return false;
    }
    ratio = w / h;
  } else {
    ratio = targetRatio;
  }

  const actualRatio = width / height;
  return Math.abs(actualRatio - ratio) <= tolerance;
}
