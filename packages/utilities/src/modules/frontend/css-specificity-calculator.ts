/**
 * CSS Specificity Calculator
 * Calculates selector specificity based on W3C CSS Specificity rules
 */

export interface SpecificityResult {
  specificity: [number, number, number, number]; // [inline, IDs, classes, elements]
  score: number; // Total specificity score
  string: string; // Human-readable format (e.g., "0,3,1,2")
  level: "low" | "medium" | "high" | "very-high";
}

/**
 * Calculates CSS selector specificity
 * Based on W3C specification: https://www.w3.org/TR/CSS2/cascade.html#specificity
 *
 * Returns [a, b, c, d] where:
 * - a = inline styles (always 0 or 1)
 * - b = number of ID selectors
 * - c = number of class selectors, attribute selectors, pseudo-classes
 * - d = number of element selectors and pseudo-elements
 */
export function calculateSpecificity(selector: string): SpecificityResult {
  let a = 0; // Inline styles (not applicable here, always 0)
  let b = 0; // IDs
  let c = 0; // Classes, attributes, pseudo-classes
  let d = 0; // Elements, pseudo-elements

  // Handle inline style (if passed, we can't detect this from selector alone)
  // For this tool, we assume no inline styles

  // Remove comments
  let cleanSelector = selector.replace(/\/\*[\s\S]*?\*\//g, "").trim();

  // Handle multiple selectors (comma-separated) - calculate the highest one
  const selectors = cleanSelector.split(",").map((s) => s.trim());
  let maxSpecificity: [number, number, number, number] = [0, 0, 0, 0];

  for (const sel of selectors) {
    if (!sel) continue;
    const spec = _calculateSingleSelectorSpecificity(sel);
    if (_compareSpecificity(spec, maxSpecificity) > 0) {
      maxSpecificity = spec;
    }
  }

  const [specA, specB, specC, specD] = maxSpecificity;
  const score = specA * 1000 + specB * 100 + specC * 10 + specD;
  const string = `${specA},${specB},${specC},${specD}`;

  let level: SpecificityResult["level"] = "low";
  if (score >= 1000) {
    level = "very-high";
  } else if (score >= 100) {
    level = "high";
  } else if (score >= 10) {
    level = "medium";
  }

  return {
    specificity: maxSpecificity,
    score,
    string,
    level,
  };
}

/**
 * Calculates specificity for a single CSS selector
 * @param selector - The CSS selector string to analyze
 * @returns Specificity tuple [a, b, c, d]
 */
function _calculateSingleSelectorSpecificity(
  selector: string,
): [number, number, number, number] {
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;

  const idMatches = selector.match(/#[a-zA-Z_][\w-]*/g);
  if (idMatches) {
    b += idMatches.length;
  }

  const classMatches = selector.match(/\.[a-zA-Z_][\w-]*/g);
  if (classMatches) {
    c += classMatches.length;
  }

  const attrMatches = selector.match(/\[[^\]]+\]/g);
  if (attrMatches) {
    c += attrMatches.length;
  }

  const pseudoClassMatches = selector.match(/:+[a-zA-Z-]+(?:\([^)]+\))?/g);
  if (pseudoClassMatches) {
    for (const match of pseudoClassMatches) {
      if (match.startsWith("::")) {
        d += 1;
      } else {
        c += 1;
      }
    }
  }

  const elementRegex =
    /^[a-zA-Z_][\w-]*|(?<![.#[:])[a-zA-Z_][\w-]*(?![.#[:(\s])/g;
  let elementCount = 0;
  let match;
  const elementKeywords = new Set([
    "not",
    "is",
    "where",
    "has",
    "dir",
    "lang",
    "any-link",
    "link",
    "visited",
    "local-link",
    "target",
    "target-within",
    "scope",
  ]);

  while ((match = elementRegex.exec(selector)) !== null) {
    const elem = match[0];
    if (
      !elem.includes("(") &&
      !elem.includes("[") &&
      !selector
        .substring(Math.max(0, match.index - 1), match.index)
        .includes(":") &&
      !elementKeywords.has(elem.toLowerCase())
    ) {
      elementCount++;
    }
  }

  const simpleElementRegex = /\b([a-zA-Z_][\w-]*)(?![.#[:])/g;
  const elementMatches = selector.match(simpleElementRegex);
  if (elementMatches) {
    const keywords = new Set([
      "not",
      "and",
      "or",
      "is",
      "where",
      "has",
      "dir",
      "lang",
      "when",
      "container",
    ]);
    d += elementMatches.filter((m) => !keywords.has(m.toLowerCase())).length;
  }

  return [a, b, c, d];
}

/**
 * Compares two specificity tuples and returns comparison result
 * @param a - First specificity tuple
 * @param b - Second specificity tuple
 * @returns Positive number if a > b, negative if a < b, 0 if equal
 */
function _compareSpecificity(
  a: [number, number, number, number],
  b: [number, number, number, number],
): number {
  for (let i = 0; i < 4; i++) {
    const aVal = a[i] ?? 0;
    const bVal = b[i] ?? 0;
    if (aVal !== bVal) {
      return aVal - bVal;
    }
  }
  return 0;
}

/**
 * Compares two CSS selectors and determines which has higher specificity
 * @param selector1 - First CSS selector to compare
 * @param selector2 - Second CSS selector to compare
 * @returns Comparison result with winner and detailed specificity information
 */
export function compareSelectors(
  selector1: string,
  selector2: string,
): {
  winner: "first" | "second" | "equal";
  details: { first: SpecificityResult; second: SpecificityResult };
} {
  const spec1 = calculateSpecificity(selector1);
  const spec2 = calculateSpecificity(selector2);

  const comparison = _compareSpecificity(spec1.specificity, spec2.specificity);

  return {
    winner: comparison > 0 ? "first" : comparison < 0 ? "second" : "equal",
    details: {
      first: spec1,
      second: spec2,
    },
  };
}
