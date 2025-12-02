/**
 * Font Pairing Generator
 * Suggests complementary font combinations
 */

import type { FontPair } from "@workspace/types/font";
import { FONT_PAIRINGS } from "@workspace/constants/font";

// Re-export for backward compatibility
export type { FontPair } from "@workspace/types/font";
export { FONT_PAIRINGS } from "@workspace/constants/font";

/**
 * Gets all available font pairings
 */
export function getFontPairings(): FontPair[] {
  return FONT_PAIRINGS;
}

/**
 * Gets random font pairing
 */
export function getRandomFontPairing(): FontPair {
  return FONT_PAIRINGS[Math.floor(Math.random() * FONT_PAIRINGS.length)]!;
}

/**
 * Gets font pairing by category
 */
export function getFontPairingsByCategory(
  headingCategory?: string,
  bodyCategory?: string,
): FontPair[] {
  return FONT_PAIRINGS.filter((pair) => {
    if (headingCategory && pair.heading.category !== headingCategory) {
      return false;
    }
    if (bodyCategory && pair.body.category !== bodyCategory) {
      return false;
    }
    return true;
  });
}

/**
 * Generates Google Fonts import URLs for a font pair
 * NOTE: This only generates HTML link tags - it does NOT load fonts.
 * For offline PWA support, users should:
 * 1. Use system fonts, OR
 * 2. Self-host fonts and replace Google Fonts URLs with local paths
 */
export function generateGoogleFontsImport(pair: FontPair): string {
  const headingName = pair.heading.name.replace(/\s+/g, "+");
  const bodyName = pair.body.name.replace(/\s+/g, "+");
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${headingName}:wght@400;700&family=${bodyName}:wght@400;700&display=swap" rel="stylesheet">`;
}

/**
 * Generates CSS variables for font pair
 */
export function generateFontVariables(pair: FontPair): string {
  return `:root {
  --font-heading: ${pair.heading.family};
  --font-body: ${pair.body.family};
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body, p, span, div {
  font-family: var(--font-body);
}`;
}
