/**
 * Code metrics calculator utilities
 */

export interface CodeMetrics {
  linesOfCode: number;
  linesOfComments: number;
  blankLines: number;
  totalLines: number;
  functions: number;
  classes: number;
  complexity: number;
  commentRatio: number;
  maintainabilityIndex: number;
}

export interface LanguageMetrics {
  language: string;
  metrics: CodeMetrics;
}

/**
 * Analyzes source code and calculates various metrics
 * @param code - Source code string to analyze
 * @param language - Programming language (optional, for language-specific patterns)
 * @returns Code metrics object with lines, functions, classes, complexity, etc.
 */
export function calculateCodeMetrics(
  code: string,
  language?: string,
): CodeMetrics {
  const lines = code.split("\n");
  const totalLines = lines.length;

  let linesOfCode = 0;
  let linesOfComments = 0;
  let blankLines = 0;
  let functions = 0;
  let classes = 0;
  let complexity = 1;

  const commentPatterns = _getCommentPatterns(language);
  const functionPatterns = _getFunctionPatterns(language);
  const classPatterns = _getClassPatterns(language);
  const complexityPatterns = _getComplexityPatterns(language);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === "") {
      blankLines++;
      return;
    }

    const isComment = commentPatterns.some((pattern) => pattern.test(trimmed));
    if (isComment) {
      linesOfComments++;
      return;
    }

    linesOfCode++;

    const isFunction = functionPatterns.some((pattern) =>
      pattern.test(trimmed),
    );
    if (isFunction) {
      functions++;
    }

    const isClass = classPatterns.some((pattern) => pattern.test(trimmed));
    if (isClass) {
      classes++;
    }

    complexityPatterns.forEach((pattern) => {
      if (pattern.test(trimmed)) {
        complexity++;
      }
    });
  });

  const commentRatio = totalLines > 0 ? linesOfComments / totalLines : 0;
  const maintainabilityIndex = _calculateMaintainabilityIndex(
    linesOfCode,
    complexity,
    commentRatio,
  );

  return {
    linesOfCode,
    linesOfComments,
    blankLines,
    totalLines,
    functions,
    classes,
    complexity,
    commentRatio,
    maintainabilityIndex,
  };
}

/**
 * Gets comment patterns for a specific programming language
 * @param language - Programming language name
 * @returns Array of RegExp patterns for detecting comments
 */
function _getCommentPatterns(language?: string): RegExp[] {
  const patterns: RegExp[] = [];

  switch (language?.toLowerCase()) {
    case "javascript":
    case "typescript":
    case "java":
    case "c":
    case "cpp":
    case "csharp":
    case "go":
    case "rust":
      patterns.push(/^\/\//, /^\/\*/, /^\*/);
      break;
    case "python":
    case "ruby":
    case "bash":
    case "shell":
      patterns.push(/^#/);
      break;
    case "html":
    case "xml":
      patterns.push(/^<!--/, /^-->/);
      break;
    case "css":
    case "scss":
      patterns.push(/^\/\//, /^\/\*/, /^\*/);
      break;
    default:
      patterns.push(/^\/\//, /^\/\*/, /^\*/);
  }

  return patterns;
}

/**
 * Gets function declaration patterns for a specific programming language
 * @param language - Programming language name
 * @returns Array of RegExp patterns for detecting function declarations
 */
function _getFunctionPatterns(language?: string): RegExp[] {
  const patterns: RegExp[] = [];

  switch (language?.toLowerCase()) {
    case "javascript":
    case "typescript":
      patterns.push(
        /^\s*(export\s+)?(async\s+)?(function\s+\w+|const\s+\w+\s*=\s*(async\s+)?\(|const\s+\w+\s*=\s*(async\s+)?\w+\s*=>|class\s+\w+\s*\{[\s\S]*?\}\s*=\s*\(|\w+\s*:\s*(async\s+)?\()/,
      );
      break;
    case "python":
      patterns.push(/^\s*(async\s+)?def\s+\w+\s*\(/);
      break;
    case "java":
    case "csharp":
      patterns.push(
        /^\s*(public|private|protected)?\s*(static\s+)?\w+\s+\w+\s*\(/,
      );
      break;
    case "go":
      patterns.push(/^\s*func\s+\w+/);
      break;
    case "rust":
      patterns.push(/^\s*(pub\s+)?fn\s+\w+/);
      break;
    default:
      patterns.push(/function\s+\w+|^\s*\w+\s*=\s*\(|^\s*def\s+\w+/);
  }

  return patterns;
}

/**
 * Gets class declaration patterns for a specific programming language
 * @param language - Programming language name
 * @returns Array of RegExp patterns for detecting class declarations
 */
function _getClassPatterns(language?: string): RegExp[] {
  const patterns: RegExp[] = [];

  switch (language?.toLowerCase()) {
    case "javascript":
    case "typescript":
      patterns.push(/^\s*(export\s+)?class\s+\w+/);
      break;
    case "python":
      patterns.push(/^\s*class\s+\w+/);
      break;
    case "java":
    case "csharp":
      patterns.push(/^\s*(public\s+)?class\s+\w+/);
      break;
    default:
      patterns.push(/class\s+\w+/);
  }

  return patterns;
}

/**
 * Gets complexity patterns for control flow statements
 * @param _language - Programming language name (unused, patterns are common)
 * @returns Array of RegExp patterns for detecting complexity-increasing statements
 */
function _getComplexityPatterns(_language?: string): RegExp[] {
  return [
    /\bif\s*\(/,
    /\belse\b/,
    /\bswitch\s*\(/,
    /\bcase\b/,
    /\bfor\s*\(/,
    /\bwhile\s*\(/,
    /\bdo\s*\{/,
    /\bcatch\s*\(/,
    /\btry\s*\{/,
    /\bawait\b/,
    /\b\.then\s*\(/,
    /\b\.catch\s*\(/,
  ];
}

/**
 * Calculates maintainability index using simplified formula
 * @param linesOfCode - Number of lines of code
 * @param complexity - Cyclomatic complexity value
 * @param commentRatio - Ratio of comment lines to total lines
 * @returns Maintainability index value (0-100)
 */
function _calculateMaintainabilityIndex(
  linesOfCode: number,
  complexity: number,
  commentRatio: number,
): number {
  const halsteadVolume = linesOfCode * 10;
  const mi =
    171 -
    5.2 * Math.log(Math.max(1, halsteadVolume)) -
    0.23 * complexity -
    16.2 * Math.log(Math.max(1, linesOfCode)) +
    50 * Math.sin(2.4 * commentRatio);

  return Math.max(0, Math.min(100, Math.round(mi)));
}

/**
 * Analyzes multiple code files and returns metrics per file
 * @param files - Array of file objects with code and optional language
 * @returns Array of language metrics objects
 */
export function analyzeMultipleFiles(
  files: Array<{ code: string; language?: string }>,
): LanguageMetrics[] {
  return files.map((file) => ({
    language: file.language || "unknown",
    metrics: calculateCodeMetrics(file.code, file.language),
  }));
}

/**
 * Gets code statistics summary with additional calculated metrics
 * @param code - Source code string to analyze
 * @param language - Programming language (optional)
 * @returns Statistics summary object with metrics and averages
 */
export function getCodeStatistics(
  code: string,
  language?: string,
): {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  functions: number;
  classes: number;
  averageFunctionLength: number;
  commentRatio: number;
} {
  const metrics = calculateCodeMetrics(code, language);

  return {
    totalLines: metrics.totalLines,
    codeLines: metrics.linesOfCode,
    commentLines: metrics.linesOfComments,
    blankLines: metrics.blankLines,
    functions: metrics.functions,
    classes: metrics.classes,
    averageFunctionLength:
      metrics.functions > 0
        ? Math.round(metrics.linesOfCode / metrics.functions)
        : 0,
    commentRatio: metrics.commentRatio,
  };
}
