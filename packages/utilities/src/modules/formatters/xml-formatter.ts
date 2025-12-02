import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { js2xml, xml2js } from "xml-js";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

/**
 * Comprehensive XML utilities: beautifier, formatter, validator, transformer, and more
 */

export interface XmlFormatOptions {
  indent?: number;
  indentChar?: string;
  newline?: string;
  preserveComments?: boolean;
  preserveAttributes?: boolean;
  attributeNamePrefix?: string;
  textNodeName?: string;
}

export interface XmlToJsonOptions {
  compact?: boolean;
  spaces?: number;
  ignoreAttributes?: boolean;
  ignoreDeclaration?: boolean;
  ignoreInstruction?: boolean;
  ignoreComment?: boolean;
  ignoreCdata?: boolean;
  ignoreDoctype?: boolean;
  ignoreText?: boolean;
}

const defaultOptions: XmlFormatOptions = {
  indent: 2,
  indentChar: " ",
  newline: "\n",
  preserveComments: true,
  preserveAttributes: true,
};

/**
 * Validates XML string and returns detailed error information if invalid
 * @param xmlString - The XML string to validate
 * @returns Validation result with error details if invalid
 */
export function validateXml(xmlString: string): {
  isValid: boolean;
  error?: string;
  errorPosition?: number;
} {
  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, "text/xml");
      const parseError = doc.querySelector("parsererror");

      if (parseError) {
        const errorText = parseError.textContent || "XML parsing error";
        return {
          isValid: false,
          error: errorText,
        };
      }
    }

    const validationResult = XMLValidator.validate(xmlString);
    if (validationResult !== true) {
      return {
        isValid: false,
        error: validationResult.err?.msg || "Invalid XML",
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid XML",
    };
  }
}

/**
 * Formats and beautifies XML with customizable indentation
 * @param xmlString - The XML string to format
 * @param options - Formatting options (indent, newline, etc.)
 * @returns Formatted XML string
 * @throws Error if XML is invalid
 */
export function formatXml(
  xmlString: string,
  options: XmlFormatOptions = {},
): string {
  const config = { ...defaultOptions, ...options };
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid XML");
  }

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: false,
      trimValues: true,
    });

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      indentBy: config.indentChar?.repeat(config.indent || 2),
      suppressEmptyNode: false,
    });

    const jsonObj = parser.parse(xmlString);
    return builder.build(jsonObj);
  } catch (error) {
    return _basicFormatXml(xmlString, config);
  }
}

/**
 * Basic XML formatter used as fallback when advanced formatting fails
 * @param xmlString - The XML string to format
 * @param options - Formatting options
 * @returns Formatted XML string
 */
function _basicFormatXml(xmlString: string, options: XmlFormatOptions): string {
  const unformatted = xmlString.replace(/>\s+</g, "><").trim();

  let formatted = "";
  let indent = 0;
  let current = "";

  for (let i = 0; i < unformatted.length; i++) {
    const char = unformatted[i];

    if (char === "<") {
      if (current.trim() && formatted) {
        formatted += options.newline || "\n";
        formatted += (options.indentChar || " ").repeat(
          indent * (options.indent || 2),
        );
      }

      if (unformatted[i + 1] === "/") {
        indent = Math.max(0, indent - 1);
        formatted += options.newline || "\n";
        formatted += (options.indentChar || " ").repeat(
          indent * (options.indent || 2),
        );
      }

      current = char;
    } else if (char === ">") {
      current += char;
      formatted += current;

      const isSelfClosing = current.includes("/>");

      if (!isSelfClosing && !current.includes("</")) {
        indent++;
      }

      current = "";
    } else {
      current += char;
    }
  }

  return formatted.trim();
}

/**
 * Beautifies XML with consistent formatting style
 * @param xmlString - The XML string to beautify
 * @param options - Beautification options (indent size, line length)
 * @returns Beautified XML string
 */
export function beautifyXml(
  xmlString: string,
  options: { indent_size?: number; wrap_line_length?: number } = {},
): string {
  return formatXml(xmlString, {
    indent: options.indent_size || 2,
    indentChar: " ",
  });
}

/**
 * Minifies XML by removing all unnecessary whitespace
 * @param xmlString - The XML string to minify
 * @returns Minified XML string
 */
export function minifyXml(xmlString: string): string {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: false,
      trimValues: true,
    });

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: false,
      suppressEmptyNode: false,
    });

    const jsonObj = parser.parse(xmlString);
    return builder.build(jsonObj);
  } catch {
    return xmlString.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
  }
}

/**
 * Converts XML string to JSON format
 * @param xmlString - The XML string to convert
 * @param options - Conversion options (compact mode, spacing, etc.)
 * @returns JSON string representation of the XML
 * @throws Error if XML is invalid or conversion fails
 */
export function xmlToJson(
  xmlString: string,
  options: XmlToJsonOptions = {},
): string {
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid XML");
  }

  try {
    const config = {
      compact: options.compact ?? true,
      spaces: options.spaces ?? 2,
      ignoreAttributes: options.ignoreAttributes ?? false,
      ignoreDeclaration: options.ignoreDeclaration ?? false,
      ignoreInstruction: options.ignoreInstruction ?? false,
      ignoreComment: options.ignoreComment ?? false,
      ignoreCdata: options.ignoreCdata ?? false,
      ignoreDoctype: options.ignoreDoctype ?? false,
      ignoreText: options.ignoreText ?? false,
    };

    const result = xml2js(xmlString, config);
    return JSON.stringify(result, null, config.spaces);
  } catch (error) {
    throw new Error(
      `Failed to convert XML to JSON: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts JSON string to XML format
 * @param jsonString - The JSON string to convert
 * @param options - Conversion options (compact mode, spacing)
 * @returns XML string representation of the JSON
 * @throws Error if JSON is invalid or conversion fails
 */
export function jsonToXmlFromString(
  jsonString: string,
  options: { compact?: boolean; spaces?: number } = {},
): string {
  try {
    const data = JSON.parse(jsonString);
    return js2xml(data, {
      compact: options.compact ?? true,
      spaces: options.spaces ?? 2,
      ignoreAttributes: false,
      textKey: "_",
      attributesKey: "$",
    });
  } catch (error) {
    throw new Error(
      `Failed to convert JSON to XML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Converts XML string to YAML format
 * @param xmlString - The XML string to convert
 * @param options - Conversion options (indent level)
 * @returns YAML string representation of the XML
 * @throws Error if XML is invalid or conversion fails
 */
export function xmlToYaml(
  xmlString: string,
  options: { indent?: number } = {},
): string {
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid XML");
  }

  try {
    const jsonString = xmlToJson(xmlString, { compact: true });
    const data = JSON.parse(jsonString);
    return stringifyYaml(data, { indent: options.indent || 2 });
  } catch (error) {
    throw new Error(
      `Failed to convert XML to YAML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts plain text content from XML by removing all tags
 * @param xmlString - The XML string to extract text from
 * @returns Plain text content without XML tags
 * @throws Error if XML is invalid
 */
export function extractTextFromXml(xmlString: string): string {
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid XML");
  }

  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, "text/xml");
      return doc.documentElement.textContent || "";
    }

    return xmlString.replace(/<[^>]*>/g, "").trim();
  } catch (error) {
    throw new Error(
      `Failed to extract text: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extracts all attributes from XML elements and groups them by name
 * @param xmlString - The XML string to extract attributes from
 * @returns Object mapping attribute names to arrays of their values
 * @throws Error if XML is invalid
 */
export function extractAttributesFromXml(
  xmlString: string,
): Record<string, string[]> {
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid XML");
  }

  const attributes: Record<string, string[]> = {};
  const attributeRegex = /(\w+)="([^"]+)"/g;
  let match;

  while ((match = attributeRegex.exec(xmlString)) !== null) {
    const name = match[1];
    const value = match[2];
    if (name && value) {
      if (!attributes[name]) {
        attributes[name] = [];
      }
      if (!attributes[name].includes(value)) {
        attributes[name].push(value);
      }
    }
  }

  return attributes;
}

/**
 * Analyzes XML structure and returns detailed information about elements and hierarchy
 * @param xmlString - The XML string to analyze
 * @returns Object containing root element, element counts, depth, and element names
 * @throws Error if XML is invalid
 */
export function getXmlStructure(xmlString: string): {
  rootElement?: string;
  totalElements: number;
  totalAttributes: number;
  depth: number;
  elements: string[];
} {
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid XML");
  }

  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, "text/xml");

      const allElements = doc.getElementsByTagName("*");
      const elements: string[] = [];
      const elementSet = new Set<string>();

      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        if (el && el.tagName) {
          elements.push(el.tagName);
          elementSet.add(el.tagName);
        }
      }

      const rootElement = doc.documentElement.tagName;
      const attributes = extractAttributesFromXml(xmlString);
      const totalAttributes = Object.values(attributes).reduce(
        (sum, vals) => sum + vals.length,
        0,
      );

      return {
        rootElement,
        totalElements: allElements.length,
        totalAttributes,
        depth: _calculateXmlDepth(doc.documentElement),
        elements: Array.from(elementSet),
      };
    }
  } catch {
  }

  return _getXmlStructureFallback(xmlString);
}

/**
 * Fallback method to calculate XML structure when DOMParser is unavailable
 * @param xmlString - The XML string to analyze
 * @returns Basic structure information
 */
function _getXmlStructureFallback(xmlString: string): {
  rootElement?: string;
  totalElements: number;
  totalAttributes: number;
  depth: number;
  elements: string[];
} {
  const elementMatches = xmlString.match(/<[^\/][^>]*>/g) || [];
  const uniqueElements = new Set<string>();
  for (const tag of elementMatches) {
    const match = tag.match(/<(\w+)/);
    if (match && match[1]) {
      uniqueElements.add(match[1]);
    }
  }

  return {
    rootElement: undefined,
    totalElements: elementMatches.length,
    totalAttributes: 0,
    depth: 0,
    elements: Array.from(uniqueElements).filter(
      (e): e is string => typeof e === "string",
    ),
  };
}

/**
 * Calculates the maximum nesting depth of an XML element tree
 * @param element - The root element to analyze
 * @param currentDepth - Current depth level (used in recursion)
 * @returns Maximum depth found in the tree
 */
function _calculateXmlDepth(element: Element, currentDepth: number = 0): number {
  let maxDepth = currentDepth;

  for (const child of Array.from(element.children)) {
    const depth = _calculateXmlDepth(child, currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;
}

/**
 * Validates XML against custom schema rules (required elements, allowed elements, max depth)
 * @param xmlString - The XML string to validate
 * @param rules - Schema validation rules
 * @returns Validation result with list of errors if invalid
 */
export function validateXmlSchema(
  xmlString: string,
  rules: {
    requiredElements?: string[];
    allowedElements?: string[];
    maxDepth?: number;
  } = {},
): {
  valid: boolean;
  errors: string[];
} {
  const validation = validateXml(xmlString);

  if (!validation.isValid) {
    return {
      valid: false,
      errors: [validation.error || "Invalid XML"],
    };
  }

  const errors: string[] = [];
  const structure = getXmlStructure(xmlString);

  if (rules.requiredElements) {
    for (const required of rules.requiredElements) {
      if (!structure.elements.includes(required)) {
        errors.push(`Required element '${required}' not found`);
      }
    }
  }

  if (rules.allowedElements) {
    for (const element of structure.elements) {
      if (!rules.allowedElements.includes(element)) {
        errors.push(`Element '${element}' is not allowed`);
      }
    }
  }

  if (rules.maxDepth && structure.depth > rules.maxDepth) {
    errors.push(
      `XML depth ${structure.depth} exceeds maximum ${rules.maxDepth}`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
