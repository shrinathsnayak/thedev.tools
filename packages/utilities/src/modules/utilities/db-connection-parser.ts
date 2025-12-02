/**
 * Database connection string parser utilities
 */

export type DatabaseType =
  | "postgresql"
  | "mysql"
  | "mongodb"
  | "redis"
  | "sqlite"
  | "mssql"
  | "oracle";

export interface ConnectionInfo {
  type: DatabaseType;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  options?: Record<string, string>;
  raw: string;
}

/**
 * Parses PostgreSQL connection string
 * @param connectionString - PostgreSQL connection string
 * @returns Parsed connection info object
 */
function _parsePostgreSQL(connectionString: string): ConnectionInfo {
  const url = new URL(connectionString);
  const options: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    options[key] = value;
  });

  return {
    type: "postgresql",
    username: url.username || undefined,
    password: url.password || undefined,
    host: url.hostname || undefined,
    port: url.port ? parseInt(url.port, 10) : 5432,
    database: url.pathname.slice(1) || undefined,
    options: Object.keys(options).length > 0 ? options : undefined,
    raw: connectionString,
  };
}

/**
 * Parses MySQL connection string
 * @param connectionString - MySQL connection string
 * @returns Parsed connection info object
 */
function _parseMySQL(connectionString: string): ConnectionInfo {
  const url = new URL(connectionString);
  const options: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    options[key] = value;
  });

  return {
    type: "mysql",
    username: url.username || undefined,
    password: url.password || undefined,
    host: url.hostname || undefined,
    port: url.port ? parseInt(url.port, 10) : 3306,
    database: url.pathname.slice(1) || undefined,
    options: Object.keys(options).length > 0 ? options : undefined,
    raw: connectionString,
  };
}

/**
 * Parses MongoDB connection string
 * @param connectionString - MongoDB connection string
 * @returns Parsed connection info object
 */
function _parseMongoDB(connectionString: string): ConnectionInfo {
  const url = new URL(connectionString);
  const options: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    options[key] = value;
  });

  return {
    type: "mongodb",
    username: url.username || undefined,
    password: url.password || undefined,
    host: url.hostname || undefined,
    port: url.port ? parseInt(url.port, 10) : 27017,
    database: url.pathname.slice(1) || undefined,
    options: Object.keys(options).length > 0 ? options : undefined,
    raw: connectionString,
  };
}

/**
 * Parses Redis connection string
 * @param connectionString - Redis connection string
 * @returns Parsed connection info object
 */
function _parseRedis(connectionString: string): ConnectionInfo {
  const url = new URL(connectionString);
  const database = url.pathname.slice(1)
    ? parseInt(url.pathname.slice(1), 10)
    : 0;

  return {
    type: "redis",
    password: url.password || undefined,
    host: url.hostname || undefined,
    port: url.port ? parseInt(url.port, 10) : 6379,
    database: database ? String(database) : undefined,
    raw: connectionString,
  };
}

/**
 * Parses SQLite connection string
 * @param connectionString - SQLite connection string
 * @returns Parsed connection info object
 */
function _parseSQLite(connectionString: string): ConnectionInfo {
  const url = new URL(connectionString);
  const path = url.pathname;

  return {
    type: "sqlite",
    database: path || undefined,
    raw: connectionString,
  };
}

/**
 * Parses SQL Server (MSSQL) connection string
 * @param connectionString - SQL Server connection string
 * @returns Parsed connection info object
 */
function _parseMSSQL(connectionString: string): ConnectionInfo {
  const url = new URL(connectionString);
  const options: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    options[key] = value;
  });

  return {
    type: "mssql",
    username: url.username || undefined,
    password: url.password || undefined,
    host: url.hostname || undefined,
    port: url.port ? parseInt(url.port, 10) : 1433,
    database: url.pathname.slice(1) || undefined,
    options: Object.keys(options).length > 0 ? options : undefined,
    raw: connectionString,
  };
}

/**
 * Parses database connection string and detects database type
 * @param connectionString - Database connection string
 * @returns Parsed connection info object
 * @throws Error if connection string format is invalid or database type cannot be determined
 */
export function parseConnectionString(
  connectionString: string,
): ConnectionInfo {
  try {
    const lower = connectionString.toLowerCase().trim();

    if (lower.startsWith("postgresql://") || lower.startsWith("postgres://")) {
      return _parsePostgreSQL(connectionString);
    }
    if (lower.startsWith("mysql://")) {
      return _parseMySQL(connectionString);
    }
    if (lower.startsWith("mongodb://") || lower.startsWith("mongodb+srv://")) {
      return _parseMongoDB(connectionString);
    }
    if (lower.startsWith("redis://")) {
      return _parseRedis(connectionString);
    }
    if (lower.startsWith("sqlite://")) {
      return _parseSQLite(connectionString);
    }
    if (lower.startsWith("sqlserver://") || lower.startsWith("mssql://")) {
      return _parseMSSQL(connectionString);
    }

    if (lower.includes("postgresql") || lower.includes("postgres")) {
      return _parsePostgreSQL(connectionString);
    }
    if (lower.includes("mysql")) {
      return _parseMySQL(connectionString);
    }
    if (lower.includes("mongodb")) {
      return _parseMongoDB(connectionString);
    }
    if (lower.includes("redis")) {
      return _parseRedis(connectionString);
    }
    if (lower.includes("sqlite")) {
      return _parseSQLite(connectionString);
    }
    if (lower.includes("sqlserver") || lower.includes("mssql")) {
      return _parseMSSQL(connectionString);
    }

    throw new Error("Unable to determine database type");
  } catch (error) {
    throw new Error(
      `Invalid connection string: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validates database connection string format and returns parsed info if valid
 * @param connectionString - Connection string to validate
 * @returns Validation result with parsed connection info if valid
 */
export function validateConnectionString(connectionString: string): {
  valid: boolean;
  error?: string;
  info?: ConnectionInfo;
} {
  try {
    const info = parseConnectionString(connectionString);
    return {
      valid: true,
      info,
    };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : "Invalid connection string",
    };
  }
}

/**
 * Builds database connection string from connection info components
 * @param info - Connection info object with type and optional connection details
 * @returns Formatted connection string
 */
export function buildConnectionString(
  info: Partial<ConnectionInfo> & { type: DatabaseType },
): string {
  const { type, host, port, database, username, password, options } = info;

  let protocol = "";
  let defaultPort = 0;

  switch (type) {
    case "postgresql":
      protocol = "postgresql://";
      defaultPort = 5432;
      break;
    case "mysql":
      protocol = "mysql://";
      defaultPort = 3306;
      break;
    case "mongodb":
      protocol = "mongodb://";
      defaultPort = 27017;
      break;
    case "redis":
      protocol = "redis://";
      defaultPort = 6379;
      break;
    case "sqlite":
      return `sqlite://${database || "/path/to/database.db"}`;
    case "mssql":
      protocol = "sqlserver://";
      defaultPort = 1433;
      break;
  }

  const auth =
    username || password ? `${username || ""}:${password || ""}@` : "";
  const hostPort = host
    ? `${host}${port && port !== defaultPort ? `:${port}` : ""}`
    : "localhost";
  const db = database ? `/${database}` : "";
  const opts =
    options && Object.keys(options).length > 0
      ? "?" + new URLSearchParams(options).toString()
      : "";

  return `${protocol}${auth}${hostPort}${db}${opts}`;
}

/**
 * Masks sensitive information (passwords) in connection string
 * @param connectionString - Connection string to mask
 * @returns Connection string with password masked as "***"
 */
export function maskConnectionString(connectionString: string): string {
  try {
    const info = parseConnectionString(connectionString);
    const masked = buildConnectionString({
      ...info,
      password: info.password ? "***" : undefined,
    });
    return masked;
  } catch {
    return connectionString.replace(/:([^:@/]+)@/g, ":***@");
  }
}
