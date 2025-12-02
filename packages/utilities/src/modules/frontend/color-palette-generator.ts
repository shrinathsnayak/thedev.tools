/**
 * Color Palette Generator
 * Generates color schemes based on color theory
 */

export interface ColorPalette {
  base: string;
  primary: string;
  secondary: string;
  accent: string;
  complementary: string;
  analogous: string[];
  triadic: string[];
  tetradic: string[];
  monochromatic: string[];
}

export interface ColorScheme {
  name: string;
  colors: string[];
  description: string;
}

/**
 * Converts HSL to HEX
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Converts hex color string to HSL color values
 * @param hex - Hex color string (e.g., "#RRGGBB")
 * @returns HSL tuple [hue, saturation, lightness]
 */
function _hexToHsl(hex: string): [number, number, number] {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

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

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Generates a complete color palette from a base color using color theory
 * @param baseColor - Base hex color string
 * @returns Color palette object with complementary, analogous, triadic, tetradic, and monochromatic colors
 */
export function generateColorPalette(baseColor: string): ColorPalette {
  const [h, s, l] = _hexToHsl(baseColor);

  const compH = (h + 180) % 360;
  const complementary = _hslToHex(compH, s, l);

  const analogous = [
    _hslToHex((h + 30) % 360, s, l),
    _hslToHex((h - 30 + 360) % 360, s, l),
  ];

  const triadic = [
    _hslToHex((h + 120) % 360, s, l),
    _hslToHex((h + 240) % 360, s, l),
  ];

  const tetradic = [
    _hslToHex((h + 90) % 360, s, l),
    _hslToHex((h + 180) % 360, s, l),
    _hslToHex((h + 270) % 360, s, l),
  ];

  const monochromatic = [
    _hslToHex(h, Math.min(s + 20, 100), Math.min(l + 20, 100)),
    _hslToHex(h, Math.max(s - 20, 0), Math.max(l - 20, 0)),
    _hslToHex(h, s, Math.min(l + 40, 100)),
    _hslToHex(h, s, Math.max(l - 40, 0)),
  ];

  return {
    base: baseColor,
    primary: baseColor,
    secondary: _hslToHex((h + 30) % 360, s, l),
    accent: complementary,
    complementary,
    analogous,
    triadic,
    tetradic,
    monochromatic,
  };
}

/**
 * Generates predefined color schemes from a base color
 * @param baseColor - Base hex color string
 * @returns Array of color scheme objects with names, colors, and descriptions
 */
export function generateColorSchemes(baseColor: string): ColorScheme[] {
  const palette = generateColorPalette(baseColor);

  return [
    {
      name: "Complementary",
      colors: [palette.base, palette.complementary],
      description: "Two opposite colors on the color wheel",
    },
    {
      name: "Triadic",
      colors: [palette.base, ...palette.triadic],
      description: "Three evenly spaced colors on the color wheel",
    },
    {
      name: "Analogous",
      colors: [palette.base, ...palette.analogous],
      description: "Colors adjacent to each other on the color wheel",
    },
    {
      name: "Tetradic",
      colors: [palette.base, ...palette.tetradic],
      description: "Four evenly spaced colors on the color wheel",
    },
    {
      name: "Monochromatic",
      colors: [palette.base, ...palette.monochromatic.slice(0, 4)],
      description: "Variations of a single hue",
    },
  ];
}

/**
 * Generates warm color palette
 */
export function generateWarmPalette(): string[] {
  return [
    "#FF6B6B", // Red
    "#FF8E53", // Orange-red
    "#FFA07A", // Light salmon
    "#FFB347", // Orange
    "#FFCC5C", // Yellow-orange
  ];
}

/**
 * Generates cool color palette
 */
export function generateCoolPalette(): string[] {
  return [
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky blue
    "#96CEB4", // Mint green
    "#95E1D3", // Aqua
    "#A8E6CF", // Light green
  ];
}

/**
 * Generates neutral color palette
 */
export function generateNeutralPalette(): string[] {
  return [
    "#2C3E50", // Dark blue-gray
    "#34495E", // Slate
    "#7F8C8D", // Gray
    "#BDC3C7", // Light gray
    "#ECF0F1", // Off-white
  ];
}
