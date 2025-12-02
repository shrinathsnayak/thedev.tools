/**
 * Text analysis utilities: word count, character count, reading time, etc.
 */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number; // in minutes
  averageWordsPerSentence: number;
  averageCharsPerWord: number;
}

/**
 * Analyzes text and returns comprehensive statistics
 */
export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();

  // Characters
  const characters = trimmed.length;
  const charactersNoSpaces = trimmed.replace(/\s/g, "").length;

  // Words (split by whitespace)
  const words = trimmed.split(/\s+/).filter((word) => word.length > 0).length;

  // Sentences (split by sentence-ending punctuation)
  const sentences = trimmed
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0).length;

  const paragraphs =
    trimmed.split(/\n\s*\n/).filter((para) => para.trim().length > 0).length ||
    1;

  const lines = trimmed
    .split(/\n/)
    .filter((line) => line.trim().length > 0).length;

  const readingTime = Math.ceil(words / 225);

  const averageWordsPerSentence = sentences > 0 ? words / sentences : words;

  const averageCharsPerWord = words > 0 ? characters / words : 0;

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime,
    averageWordsPerSentence: Math.round(averageWordsPerSentence * 10) / 10,
    averageCharsPerWord: Math.round(averageCharsPerWord * 10) / 10,
  };
}

/**
 * Counts occurrences of a specific word or phrase in text (case-insensitive)
 * @param text - The text string to search
 * @param searchTerm - The word or phrase to count
 * @returns Number of occurrences found
 */
export function countOccurrences(text: string, searchTerm: string): number {
  const regex = new RegExp(
    searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi",
  );
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Finds the most frequent words in text and returns top N results
 * @param text - The text string to analyze
 * @param topN - Number of top words to return (default: 10)
 * @returns Array of word objects with count, sorted by frequency descending
 */
export function findMostFrequentWords(
  text: string,
  topN: number = 10,
): Array<{ word: string; count: number }> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const wordCount: Record<string, number> = {};

  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }

  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Removes duplicate lines from text while preserving order
 * @param text - The text string to process
 * @returns Text string with duplicate lines removed
 */
export function removeDuplicateLines(text: string): string {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      unique.push(line);
    } else if (!trimmed) {
      unique.push(line);
    }
  }

  return unique.join("\n");
}

/**
 * Removes duplicate words from text while preserving order
 * @param text - The text string to process
 * @returns Text string with duplicate words removed
 */
export function removeDuplicateWords(text: string): string {
  const words = text.split(/\s+/);
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const word of words) {
    if (!seen.has(word.toLowerCase())) {
      seen.add(word.toLowerCase());
      unique.push(word);
    }
  }

  return unique.join(" ");
}

/**
 * Reverses the order of characters in text
 * @param text - The text string to reverse
 * @returns Reversed text string
 */
export function reverseText(text: string): string {
  return text.split("").reverse().join("");
}

/**
 * Reverses words in text (keeps word order reversed)
 */
export function reverseWords(text: string): string {
  return text.split(/\s+/).reverse().join(" ");
}

/**
 * Extracts all URLs from text using regex pattern matching
 * @param text - The text string to search
 * @returns Array of unique URL strings found in the text
 */
export function extractUrls(text: string): string[] {
  const urlRegex =
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/gi;
  const matches = text.match(urlRegex);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extracts all email addresses from text using regex pattern matching
 * @param text - The text string to search
 * @returns Array of unique email addresses found in the text
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extracts phone numbers from text using basic regex pattern matching
 * @param text - The text string to search
 * @returns Array of unique phone number strings found in the text
 */
export function extractPhoneNumbers(text: string): string[] {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Removes all empty lines from text
 * @param text - The text string to process
 * @returns Text string with empty lines removed
 */
export function removeEmptyLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

/**
 * Sorts lines in text alphabetically
 * @param text - The text string to sort
 * @param reverse - If true, sorts in reverse order (default: false)
 * @returns Text string with lines sorted alphabetically
 */
export function sortLines(text: string, reverse: boolean = false): string {
  const lines = text.split("\n");
  lines.sort();
  if (reverse) {
    lines.reverse();
  }
  return lines.join("\n");
}

/**
 * Trims whitespace from the start and end of each line
 * @param text - The text string to process
 * @returns Text string with each line trimmed
 */
export function trimLines(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}
