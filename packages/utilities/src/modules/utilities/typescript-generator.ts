/**
 * TypeScript interface and type generator utilities
 */

export interface TypeScriptType {
  name: string;
  type: string;
  optional?: boolean;
  readonly?: boolean;
  description?: string;
}

export interface TypeScriptInterface {
  name: string;
  properties: TypeScriptType[];
  extends?: string[];
  export?: boolean;
  description?: string;
}

/**
 * Generates TypeScript interface or type from JSON object
 * @param name - Interface or type name
 * @param data - JSON object or JSON string
 * @param options - Generation options (export, indent, useType)
 * @returns TypeScript interface or type string
 */
export function generateInterfaceFromJSON(
  name: string,
  data: object | string,
  options: {
    export?: boolean;
    indent?: string;
    useType?: boolean;
  } = {},
): string {
  const obj = typeof data === "string" ? JSON.parse(data) : data;
  const {
    export: exportKeyword = true,
    indent = "  ",
    useType = false,
  } = options;

  const properties = _analyzeObject(obj, indent, 1);
  const keyword = useType ? "type" : "interface";

  const lines: string[] = [];

  if (exportKeyword) {
    lines.push(`export ${keyword} ${name} {`);
  } else {
    lines.push(`${keyword} ${name} {`);
  }

  lines.push(...properties);
  lines.push("}");

  return lines.join("\n");
}

/**
 * Analyzes object structure and generates TypeScript property definitions
 * @param obj - Object to analyze
 * @param indent - Indentation string
 * @param level - Current indentation level
 * @returns Array of property definition strings
 */
function _analyzeObject(obj: any, indent: string, level: number): string[] {
  const lines: string[] = [];
  const currentIndent = indent.repeat(level);

  if (obj === null) {
    return [`${currentIndent}[key: string]: any;`];
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return [`${currentIndent}[key: string]: any[];`];
    }
    const itemType = _inferType(obj[0], indent, level + 1);
    return [`${currentIndent}[key: string]: ${itemType}[];`];
  }

  if (typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      const optional = value === null || value === undefined;
      const type = _inferType(value, indent, level + 1);
      const optionalMarker = optional ? "?" : "";
      lines.push(`${currentIndent}${key}${optionalMarker}: ${type};`);
    });
  }

  return lines;
}

/**
 * Infers TypeScript type string from JavaScript value
 * @param value - Value to infer type from
 * @param indent - Indentation string
 * @param level - Current indentation level
 * @returns TypeScript type string
 */
function _inferType(value: any, indent: string, level: number): string {
  if (value === null || value === undefined) {
    return "any";
  }

  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? "number" : "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "any[]";
    }
    const itemType = _inferType(value[0], indent, level);
    return `${itemType}[]`;
  }

  if (typeof value === "object") {
    const props = _analyzeObject(value, indent, level);
    if (props.length === 0) {
      return "Record<string, any>";
    }
    return `{\n${props.join("\n")}\n${indent.repeat(level - 1)}}`;
  }

  return "any";
}

/**
 * Generates TypeScript type from JSON Schema object
 * @param schema - JSON Schema object
 * @param name - Type name
 * @returns TypeScript type definition string
 */
export function generateTypeFromSchema(schema: any, name: string): string {
  if (schema.type === "object" && schema.properties) {
    const properties: string[] = [];

    Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
      const required = schema.required?.includes(key) ?? false;
      const optionalMarker = required ? "" : "?";
      const type = _getTypeFromSchemaProperty(prop);
      properties.push(`  ${key}${optionalMarker}: ${type};`);
    });

    return `export type ${name} = {\n${properties.join("\n")}\n};`;
  }

  if (schema.type === "array" && schema.items) {
    const itemType = _getTypeFromSchemaProperty(schema.items);
    return `export type ${name} = ${itemType}[];`;
  }

  const type = _getTypeFromSchemaProperty(schema);
  return `export type ${name} = ${type};`;
}

/**
 * Gets TypeScript type string from JSON Schema property definition
 * @param prop - JSON Schema property object
 * @returns TypeScript type string
 */
function _getTypeFromSchemaProperty(prop: any): string {
  if (prop.type === "string") {
    if (prop.enum) {
      return prop.enum.map((v: string) => `"${v}"`).join(" | ");
    }
    return "string";
  }
  if (prop.type === "number" || prop.type === "integer") {
    return "number";
  }
  if (prop.type === "boolean") {
    return "boolean";
  }
  if (prop.type === "array") {
    const itemType = prop.items ? _getTypeFromSchemaProperty(prop.items) : "any";
    return `${itemType}[]`;
  }
  if (prop.type === "object") {
    return "Record<string, any>";
  }
  if (prop.$ref) {
    return prop.$ref.split("/").pop() || "any";
  }
  return "any";
}

/**
 * Generates TypeScript enum from array of values
 * @param name - Enum name
 * @param values - Array of string or number values
 * @param options - Generation options (export, stringEnum)
 * @returns TypeScript enum definition string
 */
export function generateEnum(
  name: string,
  values: string[] | number[],
  options: { export?: boolean; stringEnum?: boolean } = {},
): string {
  const { export: exportKeyword = true, stringEnum = false } = options;
  const lines: string[] = [];

  if (exportKeyword) {
    lines.push(`export enum ${name} {`);
  } else {
    lines.push(`enum ${name} {`);
  }

  values.forEach((value, index) => {
    if (stringEnum) {
      const key =
        typeof value === "string"
          ? value.toUpperCase().replace(/\s+/g, "_")
          : `VALUE_${index}`;
      lines.push(`  ${key} = "${value}",`);
    } else {
      const key =
        typeof value === "string"
          ? value.toUpperCase().replace(/\s+/g, "_")
          : `VALUE_${index}`;
      lines.push(
        `  ${key} = ${typeof value === "string" ? `"${value}"` : value},`,
      );
    }
  });

  lines.push("}");

  return lines.join("\n");
}

/**
 * Generates TypeScript type union from array of type strings
 * @param name - Type name
 * @param types - Array of type strings to union
 * @param options - Generation options (export)
 * @returns TypeScript type union definition string
 */
export function generateTypeUnion(
  name: string,
  types: string[],
  options: { export?: boolean } = {},
): string {
  const { export: exportKeyword = true } = options;
  const union = types.join(" | ");

  if (exportKeyword) {
    return `export type ${name} = ${union};`;
  }
  return `type ${name} = ${union};`;
}
