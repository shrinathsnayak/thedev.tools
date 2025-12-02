/**
 * Color conversion utilities for converting between HEX, RGB, and HSL color formats
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HexColor {
  hex: string;
}

/**
 * Converts a HEX color string to RGB color object
 * @param hex - HEX color string (e.g., "#ff0000" or "#f00")
 * @returns RGB color object with r, g, b values (0-255)
 * @throws Error if HEX format is invalid
 */
export function hexToRgb(hex: string): RgbColor {
  const cleaned = hex.replace("#", "");

  if (cleaned.length === 3) {
    const expanded = cleaned
      .split("")
      .map((char) => char + char)
      .join("");
    return hexToRgb("#" + expanded);
  }

  if (cleaned.length !== 6) {
    throw new Error("Invalid HEX color format");
  }

  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Converts an RGB color object to HEX color string
 * @param rgb - RGB color object with r, g, b values
 * @returns HEX color string (e.g., "#ff0000")
 */
export function rgbToHex(rgb: RgbColor): string {
  const _toHex = (value: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${_toHex(rgb.r)}${_toHex(rgb.g)}${_toHex(rgb.b)}`;
}

/**
 * Converts an RGB color object to HSL color object
 * @param rgb - RGB color object with r, g, b values (0-255)
 * @returns HSL color object with h (0-360), s (0-100), l (0-100) values
 */
export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts an HSL color object to RGB color object
 * @param hsl - HSL color object with h (0-360), s (0-100), l (0-100) values
 * @returns RGB color object with r, g, b values (0-255)
 */
export function hslToRgb(hsl: HslColor): RgbColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const _hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = _hue2rgb(p, q, h + 1 / 3);
    g = _hue2rgb(p, q, h);
    b = _hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts a HEX color string to HSL color object
 * @param hex - HEX color string
 * @returns HSL color object
 */
export function hexToHsl(hex: string): HslColor {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb);
}

/**
 * Converts an HSL color object to HEX color string
 * @param hsl - HSL color object
 * @returns HEX color string
 */
export function hslToHex(hsl: HslColor): string {
  const rgb = hslToRgb(hsl);
  return rgbToHex(rgb);
}

/**
 * Parses a color string in various formats (HEX, RGB, HSL) and converts to RGB
 * @param colorString - Color string in HEX, RGB, or HSL format
 * @returns RGB color object
 * @throws Error if color format is unsupported
 */
export function parseColor(colorString: string): RgbColor {
  const trimmed = colorString.trim();

  if (trimmed.startsWith("#")) {
    return hexToRgb(trimmed);
  }

  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  const hslMatch = trimmed.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/i);
  if (hslMatch && hslMatch[1] && hslMatch[2] && hslMatch[3]) {
    const hsl: HslColor = {
      h: parseInt(hslMatch[1], 10),
      s: parseInt(hslMatch[2], 10),
      l: parseInt(hslMatch[3], 10),
    };
    return hslToRgb(hsl);
  }

  throw new Error("Unsupported color format");
}

/**
 * Formats an RGB color object as a CSS rgb() or rgba() string
 * @param rgb - RGB color object
 * @param alpha - Optional alpha value (0-1) for rgba format
 * @returns CSS color string
 */
export function formatRgb(rgb: RgbColor, alpha?: number): string {
  if (alpha !== undefined) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Formats an HSL color object as a CSS hsl() or hsla() string
 * @param hsl - HSL color object
 * @param alpha - Optional alpha value (0-1) for hsla format
 * @returns CSS color string
 */
export function formatHsl(hsl: HslColor, alpha?: number): string {
  if (alpha !== undefined) {
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
  }
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}
