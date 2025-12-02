/**
 * Color contrast checker for accessibility (WCAG compliance)
 * Pure client-side calculations based on WCAG 2.1 guidelines
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  level: "AAA Large" | "AAA" | "AA Large" | "AA" | "Fail";
  passes: boolean;
  details: {
    aaNormal: boolean;
    aaLarge: boolean;
    aaaNormal: boolean;
    aaaLarge: boolean;
  };
}

/**
 * Converts a hex color string to RGB color object
 * @param hex - The hex color string (e.g., "#RRGGBB" or "RRGGBB")
 * @returns RGB color object or null if hex format is invalid
 */
export function hexToRgbColor(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1] || "0", 16),
        g: Number.parseInt(result[2] || "0", 16),
        b: Number.parseInt(result[3] || "0", 16),
      }
    : null;
}

/**
 * Converts RGB color components to hex color string
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string (e.g., "#RRGGBB")
 */
export function rgbToHexFromContrast(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Calculates relative luminance of a color using WCAG 2.1 formula
 * @param rgb - RGB color object
 * @returns Relative luminance value (0-1)
 */
function _getRelativeLuminance(rgb: ColorRGB): number {
  const r = (rgb.r ?? 0) / 255;
  const g = (rgb.g ?? 0) / 255;
  const b = (rgb.b ?? 0) / 255;

  const rLum = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLum = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLum = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}

/**
 * Calculates contrast ratio between two colors (WCAG formula)
 */
/**
 * Calculates contrast ratio between two colors using WCAG 2.1 formula
 * @param color1 - First RGB color
 * @param color2 - Second RGB color
 * @returns Contrast ratio (1-21, where 21 is maximum contrast)
 */
export function calculateContrast(color1: ColorRGB, color2: ColorRGB): number {
  const lum1 = _getRelativeLuminance(color1);
  const lum2 = _getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks contrast between two colors and returns WCAG 2.1 compliance information
 * @param foreground - Foreground color as hex string or RGB object
 * @param background - Background color as hex string or RGB object
 * @returns Contrast result with ratio, WCAG level, and pass/fail status
 * @throws Error if color format is invalid
 */
export function checkContrast(
  foreground: string | ColorRGB,
  background: string | ColorRGB,
): ContrastResult {
  let fgRgb: ColorRGB;
  let bgRgb: ColorRGB;

  if (typeof foreground === "string") {
    const rgb = hexToRgbColor(foreground);
    if (!rgb) {
      throw new Error(`Invalid foreground color: ${foreground}`);
    }
    fgRgb = rgb;
  } else {
    fgRgb = foreground;
  }

  if (typeof background === "string") {
    const rgb = hexToRgbColor(background);
    if (!rgb) {
      throw new Error(`Invalid background color: ${background}`);
    }
    bgRgb = rgb;
  } else {
    bgRgb = background;
  }

  const ratio = calculateContrast(fgRgb, bgRgb);

  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  const aaaNormal = ratio >= 7;
  const aaaLarge = ratio >= 4.5;

  let level: ContrastResult["level"] = "Fail";
  if (aaaLarge) {
    level = aaaNormal ? "AAA Large" : "AAA";
  } else if (aaLarge) {
    level = aaNormal ? "AA Large" : "AA";
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passes: aaLarge || aaNormal,
    details: {
      aaNormal,
      aaLarge,
      aaaNormal,
      aaaLarge,
    },
  };
}

/**
 * Determines the best contrasting color (black or white) for a given background
 * @param background - Background color as hex string or RGB object
 * @returns "white" or "black" depending on which provides better contrast
 * @throws Error if background color format is invalid
 */
export function getBestContrastColor(
  background: string | ColorRGB,
): "white" | "black" {
  const bgRgb =
    typeof background === "string" ? hexToRgbColor(background) : background;
  if (!bgRgb) {
    throw new Error(`Invalid background color: ${background}`);
  }

  const whiteContrast = calculateContrast({ r: 255, g: 255, b: 255 }, bgRgb);
  const blackContrast = calculateContrast({ r: 0, g: 0, b: 0 }, bgRgb);

  return whiteContrast > blackContrast ? "white" : "black";
}

/**
 * Finds a readable text color with sufficient contrast for a given background
 * @param background - Background color as hex string or RGB object
 * @param minRatio - Minimum contrast ratio required (default: 4.5 for WCAG AA)
 * @returns Hex color string for readable text color
 * @throws Error if background color format is invalid
 */
export function getReadableTextColor(
  background: string | ColorRGB,
  minRatio: number = 4.5,
): string {
  const bgRgb =
    typeof background === "string" ? hexToRgbColor(background) : background;
  if (!bgRgb) {
    throw new Error(`Invalid background color: ${background}`);
  }

  const whiteContrast = calculateContrast({ r: 255, g: 255, b: 255 }, bgRgb);
  if (whiteContrast >= minRatio) {
    return "#ffffff";
  }

  const blackContrast = calculateContrast({ r: 0, g: 0, b: 0 }, bgRgb);
  if (blackContrast >= minRatio) {
    return "#000000";
  }

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}
