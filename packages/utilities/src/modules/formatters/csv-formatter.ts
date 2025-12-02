/**
 * CSV parsing and formatting utilities
 * Uses 'papaparse' package for robust CSV handling
 */

import Papa from "papaparse";

export interface CsvOptions {
  delimiter?: string;
  headers?: boolean;
  escape?: string;
  quote?: string;
  skipEmptyLines?: boolean;
  trimHeaders?: boolean;
  trimValues?: boolean;
}

const defaultOptions: CsvOptions = {
  delimiter: ",",
  headers: true,
  escape: '"',
  quote: '"',
  skipEmptyLines: true,
  trimHeaders: true,
  trimValues: true,
};

/**
 * Converts CSV string to JSON array of objects
 * @param csvString - The CSV string to convert
 * @param options - Parsing options (delimiter, headers, trimming, etc.)
 * @returns Array of objects representing CSV rows
 */
export function csvToJson(
  csvString: string,
  options: CsvOptions = {},
): Array<Record<string, string>> {
  const config = { ...defaultOptions, ...options };

  if (!csvString || !csvString.trim()) {
    return [];
  }

  const parseOptions: Papa.ParseConfig = {
    header: config.headers ?? true,
    delimiter: config.delimiter || ",",
    skipEmptyLines: config.skipEmptyLines ? "greedy" : false,
    transformHeader: config.trimHeaders
      ? (header: string) => header.trim()
      : undefined,
    transform: config.trimValues
      ? (value: string) => (typeof value === "string" ? value.trim() : value)
      : undefined,
    quoteChar: config.quote || '"',
    escapeChar: config.escape || '"',
  };

  const result = Papa.parse<Record<string, string>>(csvString, parseOptions);

  if (result.errors.length > 0) {
    console.warn("CSV parse errors:", result.errors);
  }

  return result.data || [];
}

/**
 * Converts JSON array of objects to CSV string format
 * @param data - Array of objects to convert to CSV
 * @param options - CSV generation options (delimiter, headers, quotes, etc.)
 * @returns CSV string representation of the data
 */
export function jsonToCsv(
  data: Array<Record<string, unknown>>,
  options: CsvOptions = {},
): string {
  const config = { ...defaultOptions, ...options };

  if (data.length === 0) {
    return "";
  }

  const unparseOptions: Papa.UnparseConfig = {
    header: config.headers ?? true,
    delimiter: config.delimiter || ",",
    quotes: true,
    quoteChar: config.quote || '"',
    escapeChar: config.escape || '"',
  };

  return Papa.unparse(data, unparseOptions);
}

/**
 * Validates CSV format and checks for consistent column counts across rows
 * @param csvString - The CSV string to validate
 * @returns Validation result with row/column counts if valid, or error if invalid
 */
export function validateCsv(csvString: string): {
  valid: boolean;
  error?: string;
  rows?: number;
  columns?: number;
} {
  try {
    if (!csvString || !csvString.trim()) {
      return { valid: false, error: "CSV string is empty" };
    }

    const result = Papa.parse(csvString, {
      header: false,
      skipEmptyLines: false,
      preview: 0, // Parse all
    });

    if (result.errors.length > 0) {
      const error = result.errors[0];
      if (error) {
        return {
          valid: false,
          error: `Line ${error.row ?? "unknown"}: ${error.message ?? "Parse error"}`,
        };
      }
    }

    const data = result.data as string[][];
    if (data.length === 0) {
      return { valid: false, error: "No data rows found" };
    }

    const firstRow = data[0];
    if (!firstRow) {
      return { valid: false, error: "First line is empty" };
    }

    const firstLineColumns = firstRow.length;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row && row.length !== firstLineColumns) {
        return {
          valid: false,
          error: `Row ${i + 1} has ${row.length} columns, expected ${firstLineColumns}`,
        };
      }
    }

    return {
      valid: true,
      rows: data.length,
      columns: firstLineColumns,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid CSV format",
    };
  }
}

/**
 * Calculates statistics about a CSV file (rows, columns, size)
 * @param csvString - The CSV string to analyze
 * @returns Object containing row count, column count, header presence, and file size
 */
export function getCsvStats(csvString: string): {
  rows: number;
  columns: number;
  hasHeaders: boolean;
  fileSize: number;
} {
  const result = Papa.parse(csvString, {
    header: false,
    skipEmptyLines: false,
    preview: 0,
  });

  const data = result.data as string[][];
  const firstRow = data[0];
  const columns = firstRow ? firstRow.length : 0;

  return {
    rows: data.length,
    columns,
    hasHeaders: data.length > 0,
    fileSize: new Blob([csvString]).size,
  };
}
