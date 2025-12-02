/**
 * CSS Text Shadow generator utilities
 */

export interface TextShadowValue {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  color: string;
}

/**
 * Generates CSS text-shadow string
 */
export function generateTextShadow(shadows: TextShadowValue[]): string {
  if (shadows.length === 0) {
    return "none";
  }

  return shadows
    .map(
      (shadow) =>
        `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.color}`,
    )
    .join(", ");
}

/**
 * Parses CSS text-shadow string into structured format
 */
export function parseTextShadow(textShadowString: string): TextShadowValue[] {
  if (!textShadowString || textShadowString.trim() === "none") {
    return [];
  }

  const shadows: TextShadowValue[] = [];
  const shadowStrings = textShadowString.split(/,\s*(?![^()]*\))/);

  for (const shadowStr of shadowStrings) {
    const trimmed = shadowStr.trim();
    const parts = trimmed.match(
      /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)?\s*(.+)?$/,
    );

    if (parts) {
      const offsetX = parts[1] ? parseFloat(parts[1]) : 0;
      const offsetY = parts[2] ? parseFloat(parts[2]) : 0;
      const blurRadius = parts[3] ? parseFloat(parts[3]) : 0;
      const color = parts[4]?.trim() || "rgba(0, 0, 0, 0.5)";

      shadows.push({
        offsetX,
        offsetY,
        blurRadius,
        color,
      });
    }
  }

  return shadows.length > 0 ? shadows : [];
}

/**
 * Validates a text shadow value and checks for common issues
 * @param shadow - The text shadow value to validate
 * @returns Validation result with error message if invalid
 */
export function validateTextShadow(shadow: TextShadowValue): {
  valid: boolean;
  error?: string;
} {
  if (shadow.blurRadius < 0) {
    return { valid: false, error: "Blur radius cannot be negative" };
  }

  return { valid: true };
}

/**
 * Creates a preset text shadow with predefined values
 * @param preset - Preset type (subtle, medium, strong, or outline)
 * @returns Text shadow value object with preset values
 */
export function createPresetTextShadow(
  preset: "subtle" | "medium" | "strong" | "outline",
): TextShadowValue {
  const presets: Record<
    "subtle" | "medium" | "strong" | "outline",
    TextShadowValue
  > = {
    subtle: {
      offsetX: 0,
      offsetY: 1,
      blurRadius: 1,
      color: "rgba(0, 0, 0, 0.1)",
    },
    medium: {
      offsetX: 0,
      offsetY: 2,
      blurRadius: 3,
      color: "rgba(0, 0, 0, 0.3)",
    },
    strong: {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      color: "rgba(0, 0, 0, 0.5)",
    },
    outline: {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 2,
      color: "rgba(255, 255, 255, 1)",
    },
  };

  return presets[preset];
}
