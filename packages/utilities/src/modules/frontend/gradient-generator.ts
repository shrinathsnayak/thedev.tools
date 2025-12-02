import type { RgbColor } from "./color-picker";
import { hexToRgb, formatRgb } from "./color-picker";

/**
 * Gradient utilities for CSS gradient generation
 */

export interface GradientStop {
  color: string;
  position: number;
}

export interface LinearGradientOptions {
  direction?: number | string;
  stops: GradientStop[];
}

export interface RadialGradientOptions {
  shape?: "circle" | "ellipse";
  size?: string;
  position?: string;
  stops: GradientStop[];
}

/**
 * Generates CSS linear gradient
 * @param options - Gradient configuration
 * @returns CSS linear-gradient string
 */
export function generateLinearGradient(options: LinearGradientOptions): string {
  const { direction = 180, stops } = options;

  if (stops.length < 2) {
    throw new Error("Gradient requires at least 2 color stops");
  }

  const directionStr =
    typeof direction === "number" ? `${direction}deg` : direction;

  const stopsStr = stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  return `linear-gradient(${directionStr}, ${stopsStr})`;
}

/**
 * Generates CSS radial gradient
 * @param options - Gradient configuration
 * @returns CSS radial-gradient string
 */
export function generateRadialGradient(options: RadialGradientOptions): string {
  const {
    shape = "ellipse",
    size = "farthest-corner",
    position = "center",
    stops,
  } = options;

  if (stops.length < 2) {
    throw new Error("Gradient requires at least 2 color stops");
  }

  const stopsStr = stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  return `radial-gradient(${shape} ${size} at ${position}, ${stopsStr})`;
}

/**
 * Generates CSS conic gradient
 * @param stops - Color stops
 * @param angle - Starting angle in degrees
 * @param position - Center position
 * @returns CSS conic-gradient string
 */
export function generateConicGradient(
  stops: GradientStop[],
  angle: number = 0,
  position: string = "center",
): string {
  if (stops.length < 2) {
    throw new Error("Gradient requires at least 2 color stops");
  }

  const stopsStr = stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  return `conic-gradient(from ${angle}deg at ${position}, ${stopsStr})`;
}

/**
 * Validates gradient color stops and checks for errors
 * @param stops - Array of gradient stops to validate
 * @returns Validation result with error message if invalid
 */
export function validateGradientStops(stops: GradientStop[]): {
  valid: boolean;
  error?: string;
} {
  if (stops.length < 2) {
    return { valid: false, error: "At least 2 color stops required" };
  }

  for (const stop of stops) {
    if (stop.position < 0 || stop.position > 100) {
      return {
        valid: false,
        error: `Color stop position must be between 0 and 100, got ${stop.position}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Creates evenly spaced gradient stops from an array of colors
 * @param colors - Array of color strings
 * @returns Array of gradient stops with evenly distributed positions
 * @throws Error if less than 2 colors are provided
 */
export function createEvenStops(colors: string[]): GradientStop[] {
  if (colors.length < 2) {
    throw new Error("At least 2 colors required");
  }

  const step = 100 / (colors.length - 1);
  return colors.map((color, index) => ({
    color,
    position: Math.round(index * step),
  }));
}
