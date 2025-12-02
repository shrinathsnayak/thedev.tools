/**
 * Code Diff Viewer
 * Uses 'diff' package to compare and highlight differences between code blocks
 */

import {
  diffChars,
  diffWords,
  diffLines,
  diffWordsWithSpace,
  Change,
} from "diff";

export type DiffMode = "chars" | "words" | "words-with-space" | "lines";

export interface DiffResult {
  added: Array<{ text: string; line?: number }>;
  removed: Array<{ text: string; line?: number }>;
  unchanged: Array<{ text: string; line?: number }>;
  stats: {
    added: number;
    removed: number;
    unchanged: number;
    totalChanges: number;
  };
  raw: Change[];
}

/**
 * Compares two text blocks and returns detailed diff result
 * @param text1 - First text block to compare
 * @param text2 - Second text block to compare
 * @param mode - Diff mode (chars, words, words-with-space, lines)
 * @returns Diff result with added, removed, unchanged sections and statistics
 */
export function compareText(
  text1: string,
  text2: string,
  mode: DiffMode = "lines",
): DiffResult {
  let changes: Change[];

  switch (mode) {
    case "chars":
      changes = diffChars(text1, text2);
      break;
    case "words":
      changes = diffWords(text1, text2);
      break;
    case "words-with-space":
      changes = diffWordsWithSpace(text1, text2);
      break;
    case "lines":
    default:
      changes = diffLines(text1, text2);
      break;
  }

  const result: DiffResult = {
    added: [],
    removed: [],
    unchanged: [],
    stats: {
      added: 0,
      removed: 0,
      unchanged: 0,
      totalChanges: 0,
    },
    raw: changes,
  };

  let lineNumber = 1;

  for (const change of changes) {
    if (change.added) {
      result.added.push({
        text: change.value,
        line: mode === "lines" ? lineNumber : undefined,
      });
      result.stats.added++;
      result.stats.totalChanges++;
      if (mode === "lines") {
        lineNumber++;
      }
    } else if (change.removed) {
      result.removed.push({
        text: change.value,
        line: mode === "lines" ? lineNumber : undefined,
      });
      result.stats.removed++;
      result.stats.totalChanges++;
      if (mode === "lines") {
        lineNumber++;
      }
    } else {
      result.unchanged.push({
        text: change.value,
        line: mode === "lines" ? lineNumber : undefined,
      });
      result.stats.unchanged++;
      if (mode === "lines") {
        lineNumber += change.value.split("\n").length - 1;
      }
    }
  }

  return result;
}

/**
 * Generates unified diff format string (similar to git diff)
 * @param text1 - First text block (old version)
 * @param text2 - Second text block (new version)
 * @param file1 - Name of first file (default: "file1")
 * @param file2 - Name of second file (default: "file2")
 * @returns Unified diff format string
 */
export function generateUnifiedDiff(
  text1: string,
  text2: string,
  file1: string = "file1",
  file2: string = "file2",
): string {
  const changes = diffLines(text1, text2);
  let output = `--- ${file1}\n+++ ${file2}\n`;
  let oldLine = 1;
  let newLine = 1;

  for (const change of changes) {
    if (change.added) {
      const lines = change.value.split("\n").filter((l) => l !== "");
      for (const line of lines) {
        output += `+${newLine}: ${line}\n`;
        newLine++;
      }
    } else if (change.removed) {
      const lines = change.value.split("\n").filter((l) => l !== "");
      for (const line of lines) {
        output += `-${oldLine}: ${line}\n`;
        oldLine++;
      }
    } else {
      const lines = change.value.split("\n").filter((l) => l !== "");
      oldLine += lines.length;
      newLine += lines.length;
    }
  }

  return output;
}

/**
 * Calculates similarity percentage between two text blocks
 * @param text1 - First text block
 * @param text2 - Second text block
 * @returns Similarity percentage (0-100)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const changes = diffLines(text1, text2);
  let totalLength = 0;
  let unchangedLength = 0;

  for (const change of changes) {
    totalLength += change.value.length;
    if (!change.added && !change.removed) {
      unchangedLength += change.value.length;
    }
  }

  if (totalLength === 0) {
    return 100;
  }

  return Math.round((unchangedLength / totalLength) * 100);
}
