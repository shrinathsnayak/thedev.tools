/**
 * SQL query builder utilities
 */

export type SQLDialect = "mysql" | "postgresql" | "sqlite" | "mssql" | "oracle";
export type QueryType = "SELECT" | "INSERT" | "UPDATE" | "DELETE";

export interface SelectQuery {
  type: "SELECT";
  table: string;
  columns: string[] | "*";
  where?: WhereCondition[];
  orderBy?: OrderBy[];
  limit?: number;
  offset?: number;
  join?: Join[];
  groupBy?: string[];
  having?: WhereCondition[];
}

export interface InsertQuery {
  type: "INSERT";
  table: string;
  columns: string[];
  values: Array<string | number | boolean | null>;
  returning?: string[];
}

export interface UpdateQuery {
  type: "UPDATE";
  table: string;
  set: Record<string, string | number | boolean | null>;
  where?: WhereCondition[];
  returning?: string[];
}

export interface DeleteQuery {
  type: "DELETE";
  table: string;
  where?: WhereCondition[];
  returning?: string[];
}

export interface WhereCondition {
  column: string;
  operator:
    | "="
    | "!="
    | "<"
    | ">"
    | "<="
    | ">="
    | "LIKE"
    | "IN"
    | "NOT IN"
    | "IS NULL"
    | "IS NOT NULL";
  value?: string | number | boolean | null | Array<string | number>;
  logicalOperator?: "AND" | "OR";
}

export interface OrderBy {
  column: string;
  direction: "ASC" | "DESC";
}

export interface Join {
  type: "INNER" | "LEFT" | "RIGHT" | "FULL";
  table: string;
  on: { left: string; right: string };
}

export type SQLQuery = SelectQuery | InsertQuery | UpdateQuery | DeleteQuery;

/**
 * Builds SQL SELECT query
 * @param query - SELECT query object
 * @param dialect - SQL dialect
 * @returns SQL query string
 */
export function buildSelectQuery(
  query: SelectQuery,
  dialect: SQLDialect = "postgresql",
): string {
  const parts: string[] = [];

  const columns = query.columns === "*" ? "*" : query.columns.join(", ");
  parts.push(`SELECT ${columns}`);

  parts.push(`FROM ${_escapeIdentifier(query.table, dialect)}`);

  if (query.join && query.join.length > 0) {
    query.join.forEach((join) => {
      const joinType =
        join.type === "INNER" ? "INNER JOIN" : `${join.type} JOIN`;
      parts.push(
        `${joinType} ${_escapeIdentifier(join.table, dialect)} ON ${_escapeIdentifier(join.on.left, dialect)} = ${_escapeIdentifier(join.on.right, dialect)}`,
      );
    });
  }

  if (query.where && query.where.length > 0) {
    const whereClause = _buildWhereClause(query.where, dialect);
    parts.push(`WHERE ${whereClause}`);
  }

  if (query.groupBy && query.groupBy.length > 0) {
    parts.push(
      `GROUP BY ${query.groupBy.map((col) => _escapeIdentifier(col, dialect)).join(", ")}`,
    );
  }

  if (query.having && query.having.length > 0) {
    const havingClause = _buildWhereClause(query.having, dialect);
    parts.push(`HAVING ${havingClause}`);
  }

  if (query.orderBy && query.orderBy.length > 0) {
    const orderByClause = query.orderBy
      .map(
        (order) =>
          `${_escapeIdentifier(order.column, dialect)} ${order.direction}`,
      )
      .join(", ");
    parts.push(`ORDER BY ${orderByClause}`);
  }

  if (query.limit !== undefined) {
    if (dialect === "mssql") {
      parts.push(`TOP ${query.limit}`);
    } else {
      parts.push(`LIMIT ${query.limit}`);
    }
  }

  if (query.offset !== undefined && dialect !== "mssql") {
    parts.push(`OFFSET ${query.offset}`);
  }

  return parts.join(" ");
}

/**
 * Builds SQL INSERT query from query object
 * @param query - INSERT query object
 * @param dialect - SQL dialect
 * @returns SQL INSERT query string
 */
export function buildInsertQuery(
  query: InsertQuery,
  dialect: SQLDialect = "postgresql",
): string {
  const parts: string[] = [];

  parts.push(`INSERT INTO ${_escapeIdentifier(query.table, dialect)}`);
  parts.push(
    `(${query.columns.map((col) => _escapeIdentifier(col, dialect)).join(", ")})`,
  );
  parts.push("VALUES");

  const values = query.values.map((val) => _escapeValue(val, dialect));
  parts.push(`(${values.join(", ")})`);

  if (
    query.returning &&
    query.returning.length > 0 &&
    (dialect === "postgresql" || dialect === "sqlite")
  ) {
    parts.push(
      `RETURNING ${query.returning.map((col) => _escapeIdentifier(col, dialect)).join(", ")}`,
    );
  }

  return parts.join(" ");
}

/**
 * Builds SQL UPDATE query from query object
 * @param query - UPDATE query object
 * @param dialect - SQL dialect
 * @returns SQL UPDATE query string
 */
export function buildUpdateQuery(
  query: UpdateQuery,
  dialect: SQLDialect = "postgresql",
): string {
  const parts: string[] = [];

  parts.push(`UPDATE ${_escapeIdentifier(query.table, dialect)}`);
  parts.push("SET");

  const setClause = Object.entries(query.set)
    .map(
      ([key, value]) =>
        `${_escapeIdentifier(key, dialect)} = ${_escapeValue(value, dialect)}`,
    )
    .join(", ");
  parts.push(setClause);

  if (query.where && query.where.length > 0) {
    const whereClause = _buildWhereClause(query.where, dialect);
    parts.push(`WHERE ${whereClause}`);
  }

  if (
    query.returning &&
    query.returning.length > 0 &&
    (dialect === "postgresql" || dialect === "sqlite")
  ) {
    parts.push(
      `RETURNING ${query.returning.map((col) => _escapeIdentifier(col, dialect)).join(", ")}`,
    );
  }

  return parts.join(" ");
}

/**
 * Builds SQL DELETE query from query object
 * @param query - DELETE query object
 * @param dialect - SQL dialect
 * @returns SQL DELETE query string
 */
export function buildDeleteQuery(
  query: DeleteQuery,
  dialect: SQLDialect = "postgresql",
): string {
  const parts: string[] = [];

  parts.push(`DELETE FROM ${_escapeIdentifier(query.table, dialect)}`);

  if (query.where && query.where.length > 0) {
    const whereClause = _buildWhereClause(query.where, dialect);
    parts.push(`WHERE ${whereClause}`);
  }

  if (
    query.returning &&
    query.returning.length > 0 &&
    (dialect === "postgresql" || dialect === "sqlite")
  ) {
    parts.push(
      `RETURNING ${query.returning.map((col) => _escapeIdentifier(col, dialect)).join(", ")}`,
    );
  }

  return parts.join(" ");
}

/**
 * Builds WHERE clause from conditions array
 * @param conditions - Array of WHERE conditions
 * @param dialect - SQL dialect
 * @returns WHERE clause string
 */
function _buildWhereClause(
  conditions: WhereCondition[],
  dialect: SQLDialect,
): string {
  return conditions
    .map((condition, index) => {
      const column = _escapeIdentifier(condition.column, dialect);
      let clause = "";

      switch (condition.operator) {
        case "IS NULL":
        case "IS NOT NULL":
          clause = `${column} ${condition.operator}`;
          break;
        case "IN":
        case "NOT IN":
          const values = Array.isArray(condition.value)
            ? condition.value.map((v) => _escapeValue(v, dialect)).join(", ")
            : _escapeValue(condition.value, dialect);
          clause = `${column} ${condition.operator} (${values})`;
          break;
        default:
          clause = `${column} ${condition.operator} ${_escapeValue(condition.value, dialect)}`;
      }

      if (index > 0 && condition.logicalOperator) {
        return `${condition.logicalOperator} ${clause}`;
      }
      return clause;
    })
    .join(" ");
}

/**
 * Escapes SQL identifier based on dialect
 * @param identifier - Identifier to escape
 * @param dialect - SQL dialect
 * @returns Escaped identifier
 */
function _escapeIdentifier(identifier: string, dialect: SQLDialect): string {
  switch (dialect) {
    case "mysql":
      return `\`${identifier}\``;
    case "postgresql":
    case "sqlite":
    case "oracle":
      return `"${identifier}"`;
    case "mssql":
      return `[${identifier}]`;
    default:
      return identifier;
  }
}

/**
 * Escapes SQL value based on type and dialect
 * @param value - Value to escape
 * @param dialect - SQL dialect
 * @returns Escaped value string
 */
function _escapeValue(value: any, dialect: SQLDialect): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (typeof value === "boolean") {
    return dialect === "mysql" || dialect === "postgresql"
      ? value.toString()
      : value
        ? "1"
        : "0";
  }
  return String(value);
}

/**
 * Builds SQL query from query object (SELECT, INSERT, UPDATE, or DELETE)
 * @param query - SQL query object
 * @param dialect - SQL dialect
 * @returns SQL query string
 * @throws Error if query type is unsupported
 */
export function buildSQLQuery(
  query: SQLQuery,
  dialect: SQLDialect = "postgresql",
): string {
  switch (query.type) {
    case "SELECT":
      return buildSelectQuery(query, dialect);
    case "INSERT":
      return buildInsertQuery(query, dialect);
    case "UPDATE":
      return buildUpdateQuery(query, dialect);
    case "DELETE":
      return buildDeleteQuery(query, dialect);
    default:
      throw new Error(`Unsupported query type: ${(query as any).type}`);
  }
}

/**
 * Validates SQL query object for required fields and basic correctness
 * @param query - SQL query object to validate
 * @returns Validation result with errors array
 */
export function validateSQLQuery(query: SQLQuery): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!query.table || query.table.trim() === "") {
    errors.push("Table name is required");
  }

  if (query.type === "SELECT") {
    if (
      !query.columns ||
      (Array.isArray(query.columns) && query.columns.length === 0)
    ) {
      errors.push("SELECT requires at least one column");
    }
  }

  if (query.type === "INSERT") {
    if (!query.columns || query.columns.length === 0) {
      errors.push("INSERT requires columns");
    }
    if (!query.values || query.values.length === 0) {
      errors.push("INSERT requires values");
    }
    if (query.columns.length !== query.values.length) {
      errors.push("Number of columns must match number of values");
    }
  }

  if (query.type === "UPDATE") {
    if (!query.set || Object.keys(query.set).length === 0) {
      errors.push("UPDATE requires at least one SET clause");
    }
    if (!query.where || query.where.length === 0) {
      errors.push(
        "UPDATE should have a WHERE clause to prevent updating all rows",
      );
    }
  }

  if (query.type === "DELETE") {
    if (!query.where || query.where.length === 0) {
      errors.push(
        "DELETE should have a WHERE clause to prevent deleting all rows",
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
