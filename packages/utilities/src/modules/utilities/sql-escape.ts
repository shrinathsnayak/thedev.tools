/**
 * SQL string escaping and unescaping utilities
 */

export type SQLDialect = "mysql" | "postgresql" | "sqlite" | "mssql" | "oracle";

export interface EscapeOptions {
  dialect?: SQLDialect;
  quoteChar?: string;
  escapeChar?: string;
}

/**
 * Escapes SQL string to prevent injection
 * @param value - String value to escape
 * @param options - Escape options
 * @returns Escaped SQL string
 */
export function escapeSQL(value: string, options: EscapeOptions = {}): string {
  const { dialect = "mysql", quoteChar, escapeChar } = options;

  let quote: string;
  if (quoteChar) {
    quote = quoteChar;
  } else {
    switch (dialect) {
      case "postgresql":
      case "sqlite":
        quote = "'";
        break;
      case "mysql":
        quote = "'";
        break;
      case "mssql":
        quote = "'";
        break;
      case "oracle":
        quote = "'";
        break;
      default:
        quote = "'";
    }
  }

  const escape = escapeChar || (dialect === "mysql" ? "\\" : "'");

  let escaped = value;

  if (dialect === "mysql") {
    escaped = escaped
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\0/g, "\\0")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\x1a/g, "\\Z");
  } else if (dialect === "postgresql") {
    escaped = escaped.replace(/'/g, "''");
  } else if (dialect === "sqlite") {
    escaped = escaped.replace(/'/g, "''");
  } else if (dialect === "mssql") {
    escaped = escaped.replace(/'/g, "''");
  } else if (dialect === "oracle") {
    escaped = escaped.replace(/'/g, "''");
  }

  return `${quote}${escaped}${quote}`;
}

/**
 * Unescapes SQL string
 * @param value - Escaped SQL string
 * @param options - Unescape options
 * @returns Unescaped string
 */
export function unescapeSQL(
  value: string,
  options: EscapeOptions = {},
): string {
  const { dialect = "mysql", quoteChar } = options;

  let unescaped = value;
  const quote = quoteChar || "'";

  if (unescaped.startsWith(quote) && unescaped.endsWith(quote)) {
    unescaped = unescaped.slice(1, -1);
  }

  if (dialect === "mysql") {
    unescaped = unescaped
      .replace(/\\Z/g, "\x1a")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\n/g, "\n")
      .replace(/\\0/g, "\0")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\");
  } else {
    unescaped = unescaped.replace(/''/g, "'");
  }

  return unescaped;
}

/**
 * Escapes SQL identifier (table name, column name, etc.)
 * @param identifier - Identifier to escape
 * @param options - Escape options
 * @returns Escaped identifier
 */
export function escapeSQLIdentifier(
  identifier: string,
  options: EscapeOptions & { quoteIdentifier?: boolean } = {},
): string {
  const { dialect = "mysql", quoteIdentifier = true } = options;

  if (!quoteIdentifier) {
    return identifier;
  }

  let quote: string;
  switch (dialect) {
    case "mysql":
      quote = "`";
      break;
    case "postgresql":
    case "sqlite":
      quote = '"';
      break;
    case "mssql":
      quote = "[";
      break;
    case "oracle":
      quote = '"';
      break;
    default:
      quote = '"';
  }

  let escaped = identifier;
  if (dialect === "mysql") {
    escaped = escaped.replace(/`/g, "``");
  } else if (
    dialect === "postgresql" ||
    dialect === "sqlite" ||
    dialect === "oracle"
  ) {
    escaped = escaped.replace(/"/g, '""');
  } else if (dialect === "mssql") {
    escaped = escaped.replace(/\]/g, "]]");
  }

  const closingQuote = dialect === "mssql" ? "]" : quote;

  return `${quote}${escaped}${closingQuote}`;
}

/**
 * Escapes LIKE pattern special characters (% and _) for safe use in SQL LIKE queries
 * @param pattern - LIKE pattern string to escape
 * @param options - Escape options including SQL dialect
 * @returns Escaped pattern safe for LIKE queries
 */
export function escapeSQLLikePattern(
  pattern: string,
  options: EscapeOptions = {},
): string {
  const { dialect = "mysql" } = options;

  let escaped = pattern;

  if (dialect === "mysql") {
    escaped = escaped
      .replace(/\\/g, "\\\\")
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_");
  } else {
    escaped = escaped.replace(/%/g, "\\%").replace(/_/g, "\\_");
  }

  return escaped;
}

/**
 * Sanitizes SQL string by removing potentially dangerous characters and patterns
 * @param value - String to sanitize
 * @param options - Sanitization options (removeComments, removeSemicolons)
 * @returns Sanitized string with dangerous patterns removed
 */
export function sanitizeSQL(
  value: string,
  options: { removeComments?: boolean; removeSemicolons?: boolean } = {},
): string {
  const { removeComments = true, removeSemicolons = true } = options;
  let sanitized = value;

  if (removeComments) {
    sanitized = sanitized
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
  }

  if (removeSemicolons) {
    sanitized = sanitized.replace(/;/g, "");
  }

  sanitized = sanitized
    .replace(
      /\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi,
      "",
    )
    .replace(/['";]/g, "");

  return sanitized.trim();
}

/**
 * Gets the appropriate parameterized query placeholder for a SQL dialect
 * @param index - Parameter index (1-based)
 * @param dialect - SQL dialect to get placeholder for
 * @returns Placeholder string (?, $1, @p1, :p1, etc.)
 */
export function getSQLPlaceholder(
  index: number,
  dialect: SQLDialect = "mysql",
): string {
  switch (dialect) {
    case "mysql":
    case "sqlite":
      return "?";
    case "postgresql":
      return `$${index}`;
    case "mssql":
      return `@p${index}`;
    case "oracle":
      return `:p${index}`;
    default:
      return "?";
  }
}
