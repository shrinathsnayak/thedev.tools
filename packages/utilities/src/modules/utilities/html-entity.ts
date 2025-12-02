/**
 * HTML entity encoding/decoding utilities
 * Uses 'he' package for comprehensive HTML entity handling
 */

import { encode, decode, escape, unescape } from "he";

/**
 * Encodes special HTML characters to HTML entities
 * @param text - Text string to encode
 * @param options - Encoding options (useNamedReferences)
 * @returns Encoded HTML string with entities
 */
export function encodeHtmlEntities(
  text: string,
  options?: { useNamedReferences?: boolean },
): string {
  return encode(text, {
    useNamedReferences: options?.useNamedReferences ?? true,
    allowUnsafeSymbols: false,
  });
}

/**
 * Decodes HTML entities back to characters
 * @param text - HTML string with entities to decode
 * @param options - Decoding options (strict)
 * @returns Decoded text string
 */
export function decodeHtmlEntities(
  text: string,
  options?: { strict?: boolean },
): string {
  return decode(text, {
    strict: options?.strict ?? false,
  });
}

/**
 * Escapes HTML characters for safe embedding in HTML/scripts
 * @param text - Text string to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string): string {
  return escape(text);
}

/**
 * Unescapes HTML characters
 * @param text - Escaped HTML string to unescape
 * @returns Unescaped text string
 */
export function unescapeHtml(text: string): string {
  return unescape(text);
}

/**
 * Extracts all HTML entities from text
 * @param text - Text string to search for entities
 * @returns Array of unique HTML entity strings found
 */
export function extractHtmlEntities(text: string): string[] {
  const entityRegex = /&(#?[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/g;
  const entities: string[] = [];
  const entitySet = new Set<string>();
  let match;

  while ((match = entityRegex.exec(text)) !== null) {
    if (match[0] && !entitySet.has(match[0])) {
      entitySet.add(match[0]);
      entities.push(match[0]);
    }
  }

  return entities;
}

/**
 * Counts the number of HTML entities in text
 * @param text - Text string to count entities in
 * @returns Number of HTML entities found
 */
export function countHtmlEntities(text: string): number {
  const entityRegex = /&#?[a-zA-Z0-9]+;/g;
  const matches = text.match(entityRegex);
  return matches ? matches.length : 0;
}
