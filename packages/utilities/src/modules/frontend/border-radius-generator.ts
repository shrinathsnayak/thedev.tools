/**
 * CSS Border Radius generator utilities
 */

export interface BorderRadiusValue {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

/**
 * Generates CSS border-radius string
 */
export function generateBorderRadius(
  radius: BorderRadiusValue | number,
): string {
  if (typeof radius === "number") {
    return `${radius}px`;
  }

  if (
    radius.topLeft === radius.topRight &&
    radius.topRight === radius.bottomRight &&
    radius.bottomRight === radius.bottomLeft
  ) {
    return `${radius.topLeft}px`;
  }

  if (
    radius.topLeft === radius.topRight &&
    radius.bottomLeft === radius.bottomRight
  ) {
    return `${radius.topLeft}px ${radius.bottomLeft}px`;
  }

  if (
    radius.topLeft === radius.bottomLeft &&
    radius.topRight === radius.bottomRight
  ) {
    return `${radius.topLeft}px ${radius.topRight}px`;
  }

  return `${radius.topLeft}px ${radius.topRight}px ${radius.bottomRight}px ${radius.bottomLeft}px`;
}

/**
 * Parses CSS border-radius string into structured format
 */
export function parseBorderRadius(
  borderRadiusString: string,
): BorderRadiusValue {
  const trimmed = borderRadiusString.trim();

  if (!trimmed || trimmed === "0") {
    return { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
  }

  const values = trimmed.match(/(-?\d+(?:\.\d+)?)/g) || [];
  const numbers = values.map((v) => parseFloat(v));

  if (numbers.length === 0) {
    return { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
  }

  if (numbers.length === 1) {
    const value = numbers[0] || 0;
    return {
      topLeft: value,
      topRight: value,
      bottomRight: value,
      bottomLeft: value,
    };
  }

  if (numbers.length === 2) {
    return {
      topLeft: numbers[0] || 0,
      topRight: numbers[1] || 0,
      bottomRight: numbers[0] || 0,
      bottomLeft: numbers[1] || 0,
    };
  }

  if (numbers.length === 3) {
    return {
      topLeft: numbers[0] || 0,
      topRight: numbers[1] || 0,
      bottomRight: numbers[2] || 0,
      bottomLeft: numbers[1] || 0,
    };
  }

  return {
    topLeft: numbers[0] || 0,
    topRight: numbers[1] || 0,
    bottomRight: numbers[2] || 0,
    bottomLeft: numbers[3] || 0,
  };
}

/**
 * Creates a preset border radius with predefined values
 * @param preset - Preset type (none, small, medium, large, or round)
 * @returns Border radius value object with preset values
 */
export function createPresetBorderRadius(
  preset: "none" | "small" | "medium" | "large" | "round",
): BorderRadiusValue {
  const presets: Record<
    "none" | "small" | "medium" | "large" | "round",
    BorderRadiusValue
  > = {
    none: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
    small: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 },
    medium: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
    large: { topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 },
    round: {
      topLeft: 9999,
      topRight: 9999,
      bottomRight: 9999,
      bottomLeft: 9999,
    },
  };

  return presets[preset];
}

/**
 * Generates CSS elliptical border-radius string
 * @param horizontal - Horizontal radius in pixels
 * @param vertical - Vertical radius in pixels
 * @returns CSS border-radius string with elliptical syntax
 */
export function generateEllipticalBorderRadius(
  horizontal: number,
  vertical: number,
): string {
  return `${horizontal}px / ${vertical}px`;
}
