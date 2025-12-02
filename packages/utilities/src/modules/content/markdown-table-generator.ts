/**
 * Markdown Table Generator
 * Generates and formats Markdown tables
 */

export interface TableCell {
  content: string;
  align?: "left" | "center" | "right";
}

export interface TableRow {
  cells: TableCell[];
}

export interface MarkdownTable {
  headers: TableCell[];
  rows: TableRow[];
}

/**
 * Generates Markdown table from table data structure
 * @param table - Markdown table object with headers and rows
 * @returns Markdown table string
 * @throws Error if table has no headers or row cell count mismatch
 */
export function generateMarkdownTable(table: MarkdownTable): string {
  const { headers, rows } = table;

  if (headers.length === 0) {
    throw new Error("Table must have at least one header");
  }

  const headerRow = headers.map((cell) => cell.content).join(" | ");
  const headerLine = `| ${headerRow} |`;

  const separatorCells = headers.map((cell) => {
    const align = cell.align || "left";
    switch (align) {
      case "center":
        return ":---:";
      case "right":
        return "---:";
      default:
        return "---";
    }
  });
  const separatorLine = `| ${separatorCells.join(" | ")} |`;

  const dataRows = rows.map((row) => {
    if (row.cells.length !== headers.length) {
      throw new Error(
        `Row has ${row.cells.length} cells, expected ${headers.length}`,
      );
    }
    const cells = row.cells.map((cell) => cell.content).join(" | ");
    return `| ${cells} |`;
  });

  return [headerLine, separatorLine, ...dataRows].join("\n");
}

/**
 * Generates Markdown table from array of objects
 * @param data - Array of objects to convert to table
 * @param headers - Optional array of header names (defaults to object keys)
 * @param alignment - Optional object mapping header names to alignment
 * @returns Markdown table string
 * @throws Error if data array is empty
 */
export function generateTableFromObjects(
  data: Record<string, string | number>[],
  headers?: string[],
  alignment?: Record<string, "left" | "center" | "right">,
): string {
  if (data.length === 0) {
    throw new Error("Data array cannot be empty");
  }

  const keys = headers || Object.keys(data[0] || {});

  const markdownTable: MarkdownTable = {
    headers: keys.map((key) => ({
      content: key,
      align: alignment?.[key] || "left",
    })),
    rows: data.map((row) => ({
      cells: keys.map((key) => ({
        content: String(row[key] ?? ""),
      })),
    })),
  };

  return generateMarkdownTable(markdownTable);
}

/**
 * Parses Markdown table string into table data structure
 * @param markdown - Markdown table string to parse
 * @returns Parsed MarkdownTable object or null if invalid format
 */
export function parseMarkdownTable(markdown: string): MarkdownTable | null {
  const lines = markdown
    .trim()
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return null;
  }

  const headerLine = lines[0];
  if (!headerLine || !headerLine.startsWith("|") || !headerLine.endsWith("|")) {
    return null;
  }

  const headerCells = headerLine
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());

  const separatorLine = lines[1];
  if (
    !separatorLine ||
    !separatorLine.startsWith("|") ||
    !separatorLine.endsWith("|")
  ) {
    return null;
  }

  const separatorCells = separatorLine
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());

  const alignments: Array<"left" | "center" | "right"> = separatorCells.map(
    (cell) => {
      if (cell.startsWith(":") && cell.endsWith(":")) {
        return "center";
      }
      if (cell.endsWith(":")) {
        return "right";
      }
      return "left";
    },
  );

  const rows: TableRow[] = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.startsWith("|") || !line.endsWith("|")) {
      continue;
    }

    const cells = line
      .slice(1, -1)
      .split("|")
      .map((cell, index) => ({
        content: cell.trim(),
        align: alignments[index],
      }));

    if (cells.length === headerCells.length) {
      rows.push({ cells });
    }
  }

  return {
    headers: headerCells.map((content, index) => ({
      content,
      align: alignments[index],
    })),
    rows,
  };
}

/**
 * Formats existing Markdown table by reformatting alignment
 * @param markdown - Markdown table string to format
 * @returns Reformatted Markdown table string
 * @throws Error if table format is invalid
 */
export function formatMarkdownTable(markdown: string): string {
  const table = parseMarkdownTable(markdown);
  if (!table) {
    throw new Error("Invalid Markdown table format");
  }

  return generateMarkdownTable(table);
}

/**
 * Sorts Markdown table rows by specified column
 * @param markdown - Markdown table string to sort
 * @param columnIndex - Index of column to sort by
 * @param ascending - Whether to sort ascending (default: true)
 * @returns Sorted Markdown table string
 * @throws Error if table format is invalid
 */
export function sortMarkdownTable(
  markdown: string,
  columnIndex: number,
  ascending: boolean = true,
): string {
  const table = parseMarkdownTable(markdown);
  if (!table) {
    throw new Error("Invalid Markdown table format");
  }

  const sortedRows = [...table.rows].sort((a, b) => {
    const aValue = a.cells[columnIndex]?.content || "";
    const bValue = b.cells[columnIndex]?.content || "";

    const comparison = aValue.localeCompare(bValue);
    return ascending ? comparison : -comparison;
  });

  return generateMarkdownTable({
    ...table,
    rows: sortedRows,
  });
}

/**
 * Transposes Markdown table by swapping rows and columns
 * @param markdown - Markdown table string to transpose
 * @returns Transposed Markdown table string
 * @throws Error if table format is invalid
 */
export function transposeMarkdownTable(markdown: string): string {
  const table = parseMarkdownTable(markdown);
  if (!table) {
    throw new Error("Invalid Markdown table format");
  }

  const newHeaders: TableCell[] = [
    { content: "", align: "left" },
    ...table.rows.map((_, index) => ({
      content: `Row ${index + 1}`,
      align: "left" as const,
    })),
  ];

  const newRows: TableRow[] = table.headers.map((header, headerIndex) => ({
    cells: [
      { content: header.content, align: header.align },
      ...table.rows.map((row) => ({
        content: row.cells[headerIndex]?.content || "",
        align: row.cells[headerIndex]?.align,
      })),
    ],
  }));

  return generateMarkdownTable({
    headers: newHeaders,
    rows: newRows,
  });
}
