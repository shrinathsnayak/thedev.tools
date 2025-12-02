/**
 * CSS Box Shadow generator utilities
 */

export interface BoxShadowValue {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  inset?: boolean;
}

/**
 * Generates CSS box-shadow string
 * @param shadows - Array of box shadow values
 * @returns CSS box-shadow property value
 */
export function generateBoxShadow(shadows: BoxShadowValue[]): string {
  if (shadows.length === 0) {
    return "none";
  }

  return shadows
    .map((shadow) => {
      const inset = shadow.inset ? "inset " : "";
      return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${shadow.color}`;
    })
    .join(", ");
}

/**
 * Parses CSS box-shadow string into structured format
 * @param boxShadowString - CSS box-shadow value
 * @returns Array of parsed box shadow values
 */
export function parseBoxShadow(boxShadowString: string): BoxShadowValue[] {
  if (!boxShadowString || boxShadowString.trim() === "none") {
    return [];
  }

  const shadows: BoxShadowValue[] = [];
  const shadowStrings = boxShadowString.split(/,\s*(?![^()]*\))/);

  for (const shadowStr of shadowStrings) {
    const trimmed = shadowStr.trim();
    const parts = trimmed.match(
      /(inset\s+)?(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)?\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(.+)?$/,
    );

    if (parts) {
      const inset = !!parts[1];
      const offsetX = parts[2] ? parseFloat(parts[2]) : 0;
      const offsetY = parts[3] ? parseFloat(parts[3]) : 0;
      const blurRadius = parts[4] ? parseFloat(parts[4]) : 0;
      const spreadRadius = parts[5] ? parseFloat(parts[5]) : 0;
      const color = parts[6]?.trim() || "rgba(0, 0, 0, 0.5)";

      shadows.push({
        offsetX,
        offsetY,
        blurRadius,
        spreadRadius,
        color,
        inset,
      });
    }
  }

  return shadows.length > 0 ? shadows : [];
}

/**
 * Validates a box shadow value and checks for common issues
 * @param shadow - The box shadow value to validate
 * @returns Validation result with error message if invalid
 */
export function validateBoxShadow(shadow: BoxShadowValue): {
  valid: boolean;
  error?: string;
} {
  if (shadow.blurRadius < 0) {
    return { valid: false, error: "Blur radius cannot be negative" };
  }

  return { valid: true };
}

/**
 * Creates a preset box shadow with predefined values
 * @param preset - Preset type (small, medium, or large)
 * @returns Box shadow value object with preset values
 */
export function createPresetShadow(
  preset: "small" | "medium" | "large",
): BoxShadowValue {
  const presets: Record<"small" | "medium" | "large", BoxShadowValue> = {
    small: {
      offsetX: 0,
      offsetY: 1,
      blurRadius: 2,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.1)",
    },
    medium: {
      offsetX: 0,
      offsetY: 2,
      blurRadius: 4,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.15)",
    },
    large: {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 8,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.2)",
    },
  };

  return presets[preset];
}
