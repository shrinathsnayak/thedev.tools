/**
 * Text Deduplicator
 * Removes duplicate lines, words, or characters from text
 */

export interface DeduplicationOptions {
  caseSensitive?: boolean;
  preserveOrder?: boolean;
  trimWhitespace?: boolean;
  ignoreEmpty?: boolean;
}

/**
 * Removes duplicate lines from text
 */
export function deduplicateLines(
  text: string,
  options: DeduplicationOptions = {},
): string {
  const {
    caseSensitive = true,
    preserveOrder = true,
    trimWhitespace = false,
    ignoreEmpty = false,
  } = options;

  let lines = text.split("\n");

  if (trimWhitespace) {
    lines = lines.map((line) => line.trim());
  }

  if (ignoreEmpty) {
    lines = lines.filter((line) => line.length > 0);
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (preserveOrder) {
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    } else {
      seen.add(key);
    }
  }

  if (!preserveOrder) {
    return Array.from(seen).join("\n");
  }

  return result.join("\n");
}

/**
 * Removes duplicate words from text with customizable options
 * @param text - The text string to process
 * @param options - Deduplication options (case sensitive, preserve order, trim whitespace)
 * @returns Text string with duplicate words removed
 */
export function deduplicateWords(
  text: string,
  options: DeduplicationOptions = {},
): string {
  const {
    caseSensitive = true,
    preserveOrder = true,
    trimWhitespace = true,
  } = options;

  const words = text.split(/\s+/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const word of words) {
    const processed = trimWhitespace ? word.trim() : word;
    if (!processed) continue;

    const key = caseSensitive ? processed : processed.toLowerCase();

    if (preserveOrder) {
      if (!seen.has(key)) {
        seen.add(key);
        result.push(processed);
      }
    } else {
      seen.add(key);
    }
  }

  if (!preserveOrder) {
    return Array.from(seen).join(" ");
  }

  return result.join(" ");
}

/**
 * Removes duplicate characters from text with customizable options
 * @param text - The text string to process
 * @param options - Deduplication options (case sensitive, preserve order)
 * @returns Text string with duplicate characters removed
 */
export function deduplicateCharacters(
  text: string,
  options: DeduplicationOptions = {},
): string {
  const { caseSensitive = true, preserveOrder = true } = options;

  const seen = new Set<string>();
  const result: string[] = [];

  for (const char of text) {
    const key = caseSensitive ? char : char.toLowerCase();

    if (preserveOrder) {
      if (!seen.has(key)) {
        seen.add(key);
        result.push(char);
      }
    } else {
      seen.add(key);
    }
  }

  if (!preserveOrder) {
    return Array.from(seen).join("");
  }

  return result.join("");
}

/**
 * Counts duplicate items in text and returns frequency information
 * @param text - The text string to analyze
 * @param type - Type of items to count (lines, words, or characters)
 * @param options - Deduplication options (case sensitive, trim whitespace, ignore empty)
 * @returns Array of item objects with count, sorted by count descending
 */
export function countDuplicates(
  text: string,
  type: "lines" | "words" | "characters" = "lines",
  options: DeduplicationOptions = {},
): Array<{ item: string; count: number }> {
  const { caseSensitive = true } = options;

  let items: string[] = [];

  if (type === "lines") {
    items = text.split("\n");
    if (options.trimWhitespace) {
      items = items.map((item) => item.trim());
    }
    if (options.ignoreEmpty) {
      items = items.filter((item) => item.length > 0);
    }
  } else if (type === "words") {
    items = text.split(/\s+/).filter((item) => item.length > 0);
  } else {
    items = text.split("");
  }

  const counts = new Map<string, number>();

  for (const item of items) {
    const key = caseSensitive ? item : item.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([item, count]) => ({ item, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Removes duplicate paragraphs from text with customizable options
 * @param text - The text string to process
 * @param options - Deduplication options (case sensitive, preserve order, trim whitespace, ignore empty)
 * @returns Text string with duplicate paragraphs removed
 */
export function deduplicateParagraphs(
  text: string,
  options: DeduplicationOptions = {},
): string {
  const {
    caseSensitive = true,
    preserveOrder = true,
    trimWhitespace = true,
    ignoreEmpty = true,
  } = options;

  const paragraphs = text.split(/\n\s*\n/);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const para of paragraphs) {
    const processed = trimWhitespace ? para.trim() : para;
    if (ignoreEmpty && !processed) continue;

    const key = caseSensitive ? processed : processed.toLowerCase();

    if (preserveOrder) {
      if (!seen.has(key)) {
        seen.add(key);
        result.push(processed);
      }
    } else {
      seen.add(key);
    }
  }

  if (!preserveOrder) {
    return Array.from(seen).join("\n\n");
  }

  return result.join("\n\n");
}
