/**
 * JSON to SQL Insert Generator
 * Converts JSON data to SQL INSERT statements
 */

export interface SqlInsertOptions {
  tableName: string;
  insertType?: "INSERT" | "INSERT IGNORE" | "REPLACE" | "INSERT OR REPLACE";
  onDuplicateKeyUpdate?: boolean;
  batchSize?: number;
}

/**
 * Converts a JSON array of objects to SQL INSERT statements
 * @param jsonData - Array of objects to convert to SQL INSERT statements
 * @param options - SQL generation options (table name, insert type, batch size, etc.)
 * @returns SQL INSERT statement string
 * @throws Error if jsonData is invalid or empty
 */
export function jsonToSqlInsert(
  jsonData: unknown[],
  options: SqlInsertOptions,
): string {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error("JSON data must be a non-empty array");
  }

  const {
    tableName,
    insertType = "INSERT",
    onDuplicateKeyUpdate = false,
    batchSize = 100,
  } = options;

  const firstRow = jsonData[0];
  if (!firstRow || typeof firstRow !== "object" || firstRow === null) {
    throw new Error("JSON data must contain objects");
  }

  const columns = Object.keys(firstRow as Record<string, unknown>);

  const statements: string[] = [];
  for (let i = 0; i < jsonData.length; i += batchSize) {
    const batch = jsonData.slice(i, i + batchSize);
    const statement = _generateInsertStatement(
      batch,
      tableName,
      columns,
      insertType,
      onDuplicateKeyUpdate,
    );
    statements.push(statement);
  }

  return statements.join(";\n\n") + ";";
}

/**
 * Generates a single SQL INSERT statement for a batch of rows
 * @param rows - Array of row objects to insert
 * @param tableName - Name of the table
 * @param columns - Array of column names
 * @param insertType - Type of INSERT statement (INSERT, INSERT IGNORE, etc.)
 * @param onDuplicateKeyUpdate - Whether to include ON DUPLICATE KEY UPDATE clause
 * @returns SQL INSERT statement string
 */
function _generateInsertStatement(
  rows: unknown[],
  tableName: string,
  columns: string[],
  insertType: string,
  onDuplicateKeyUpdate: boolean,
): string {
  let statement = `${insertType} INTO ${_escapeSqlIdentifier(tableName)} (`;
  statement += columns.map((col) => _escapeSqlIdentifier(col)).join(", ");
  statement += ") VALUES\n";

  const valueRows = rows.map((row) => {
    if (!row || typeof row !== "object" || row === null) {
      throw new Error("Invalid row data");
    }

    const values = columns.map((col) => {
      const value = (row as Record<string, unknown>)[col];
      return _formatSqlValue(value);
    });

    return `  (${values.join(", ")})`;
  });

  statement += valueRows.join(",\n");

  if (onDuplicateKeyUpdate) {
    const updateClause = columns
      .map(
        (col) =>
          `${_escapeSqlIdentifier(col)} = VALUES(${_escapeSqlIdentifier(col)})`,
      )
      .join(", ");
    statement += `\nON DUPLICATE KEY UPDATE ${updateClause}`;
  }

  return statement;
}

/**
 * Escapes SQL identifier using backticks (MySQL style)
 * @param identifier - The SQL identifier to escape
 * @returns Escaped identifier wrapped in backticks
 */
function _escapeSqlIdentifier(identifier: string): string {
  return `\`${identifier.replace(/`/g, "``")}\``;
}

/**
 * Formats a JavaScript value as a SQL literal value
 * @param value - The value to format (string, number, boolean, Date, object, null)
 * @returns SQL literal value string
 */
function _formatSqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "string") {
    return `'${_escapeSqlString(value)}'`;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }

  if (typeof value === "object") {
    return `'${_escapeSqlString(JSON.stringify(value))}'`;
  }

  return `'${_escapeSqlString(String(value))}'`;
}

/**
 * Escapes special characters in a SQL string literal
 * @param str - The string to escape
 * @returns Escaped string safe for SQL
 */
function _escapeSqlString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Converts a JSON object to a SQL UPDATE statement
 * @param jsonData - Object containing column-value pairs to update
 * @param options - Update options (table name, WHERE clause)
 * @returns SQL UPDATE statement string
 */
export function jsonToSqlUpdate(
  jsonData: Record<string, unknown>,
  options: {
    tableName: string;
    whereClause: string;
  },
): string {
  const { tableName, whereClause } = options;
  const columns = Object.keys(jsonData);

  const setClauses = columns.map((col) => {
    const value = _formatSqlValue(jsonData[col]);
    return `${_escapeSqlIdentifier(col)} = ${value}`;
  });

  return `UPDATE ${_escapeSqlIdentifier(tableName)}\nSET ${setClauses.join(",\n    ")}\nWHERE ${whereClause};`;
}

/**
 * Converts a JSON array to a SQL CREATE TABLE statement with inferred column types
 * @param jsonData - Array of objects to infer table structure from
 * @param options - Table creation options (table name, primary key, indexes)
 * @returns SQL CREATE TABLE statement string
 * @throws Error if jsonData is invalid or empty
 */
export function jsonToSqlCreateTable(
  jsonData: unknown[],
  options: {
    tableName: string;
    primaryKey?: string[];
    indexes?: Array<{ columns: string[]; unique?: boolean }>;
  },
): string {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error("JSON data must be a non-empty array");
  }

  const { tableName, primaryKey, indexes } = options;
  const firstRow = jsonData[0];
  if (!firstRow || typeof firstRow !== "object" || firstRow === null) {
    throw new Error("JSON data must contain objects");
  }

  const columns = Object.keys(firstRow as Record<string, unknown>);
  const columnDefs = columns.map((col) => {
    const sampleValue = (firstRow as Record<string, unknown>)[col];
    const sqlType = _inferSqlType(sampleValue);
    return `  ${_escapeSqlIdentifier(col)} ${sqlType}`;
  });

  let statement = `CREATE TABLE ${_escapeSqlIdentifier(tableName)} (\n`;
  statement += columnDefs.join(",\n");

  if (primaryKey && primaryKey.length > 0) {
    const pkCols = primaryKey.map((col) => _escapeSqlIdentifier(col)).join(", ");
    statement += `,\n  PRIMARY KEY (${pkCols})`;
  }

  statement += "\n)";

  if (indexes && indexes.length > 0) {
    statement += ";\n\n";
    const indexStatements = indexes.map((idx) => {
      const idxType = idx.unique ? "UNIQUE INDEX" : "INDEX";
      const idxCols = idx.columns
        .map((col) => _escapeSqlIdentifier(col))
        .join(", ");
      return `CREATE ${idxType} idx_${tableName}_${idx.columns.join("_")} ON ${_escapeSqlIdentifier(tableName)} (${idxCols});`;
    });
    statement += indexStatements.join("\n");
  } else {
    statement += ";";
  }

  return statement;
}

/**
 * Infers appropriate SQL data type from a JavaScript value
 * @param value - The JavaScript value to infer type from
 * @returns SQL data type string (VARCHAR, INT, DECIMAL, DATE, etc.)
 */
function _inferSqlType(value: unknown): string {
  if (value === null || value === undefined) {
    return "VARCHAR(255)";
  }

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return "DATE";
    }
    if (value.length > 255) {
      return "TEXT";
    }
    return "VARCHAR(255)";
  }

  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) {
        return "BIGINT";
      }
      return "INT";
    }
    return "DECIMAL(10, 2)";
  }

  if (typeof value === "boolean") {
    return "BOOLEAN";
  }

  if (value instanceof Date) {
    return "DATETIME";
  }

  if (typeof value === "object") {
    return "JSON";
  }

  return "VARCHAR(255)";
}
