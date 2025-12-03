import {
  TOOL_CATEGORIES,
  TOOL_CATEGORY_CODE,
  TOOL_CATEGORY_FRONTEND,
  TOOL_CATEGORY_BACKEND,
  TOOL_CATEGORY_CONTENT,
  TOOL_CATEGORY_SEO,
  TOOL_CATEGORY_UTILITIES,
  TOOL_CATEGORY_FORMATTERS,
  TOOL_CATEGORY_MULTIMEDIA,
  TOOL_CATEGORY_SECURITY,
  TOOL_CATEGORY_WORKFLOW,
  TOOL_CATEGORY_DATABASE,
  TOOL_CATEGORY_INFRASTRUCTURE,
  TOOL_CATEGORY_API,
} from "@workspace/constants/tools";
import type { Tool, ToolCategory } from "@workspace/types/tools";

// Re-export types for convenience
export type { Tool, ToolCategory };

/**
 * 🧰 Master list of tools for thewebdev.tools
 * All tools are grouped by category with sub-actions for granular functionality.
 */
export const tools: Tool[] = [
  // ===========================
  // 🧩 Code Utilities - HTML
  // ===========================
  {
    slug: "html-minify",
    name: "HTML Minifier",
    description: "Minify and compress HTML files for faster page loads.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/minify",
    tags: ["html", "minify", "performance"],
    action: "minify",
    packages: ["html-minifier-terser"],
  },
  {
    slug: "html-beautify",
    name: "HTML Beautifier",
    description: "Beautify and format HTML code with proper indentation.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/beautify",
    tags: ["html", "beautify", "format"],
    action: "beautify",
    packages: ["js-beautify"],
  },
  {
    slug: "html-validate",
    name: "HTML Validator",
    description: "Validate HTML syntax and structure.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/validate",
    tags: ["html", "validate", "lint"],
    action: "validate",
    packages: [],
  },
  {
    slug: "html-extract-links",
    name: "HTML Link Extractor",
    description: "Extract all links (href) from HTML documents.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/extract-links",
    tags: ["html", "extract", "links"],
    action: "extract-links",
    packages: [],
  },
  {
    slug: "html-extract-images",
    name: "HTML Image Extractor",
    description: "Extract all image sources from HTML documents.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/extract-images",
    tags: ["html", "extract", "images"],
    action: "extract-images",
    packages: [],
  },
  {
    slug: "html-extract-meta",
    name: "HTML Meta Extractor",
    description: "Extract meta tags and their values from HTML documents.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/extract-meta",
    tags: ["html", "extract", "meta", "seo"],
    action: "extract-meta",
    packages: [],
  },
  {
    slug: "html-stats",
    name: "HTML Statistics",
    description:
      "Get detailed statistics about HTML documents (tags, attributes, size).",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/html/stats",
    tags: ["html", "stats", "analysis"],
    action: "stats",
    packages: [],
  },

  // ===========================
  // 🧩 Code Utilities - CSS
  // ===========================
  {
    slug: "css-minify",
    name: "CSS Minifier",
    description: "Minify and optimize CSS code for production.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/minify",
    tags: ["css", "minify"],
    action: "minify",
    packages: ["clean-css"],
  },
  {
    slug: "css-beautify",
    name: "CSS Beautifier",
    description: "Beautify and format CSS code with proper indentation.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/beautify",
    tags: ["css", "beautify", "format"],
    action: "beautify",
    packages: ["js-beautify"],
  },
  {
    slug: "css-validate",
    name: "CSS Validator",
    description: "Validate CSS syntax and find errors.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/validate",
    tags: ["css", "validate", "lint"],
    action: "validate",
    packages: ["clean-css"],
  },
  {
    slug: "css-extract-selectors",
    name: "CSS Selector Extractor",
    description: "Extract all CSS selectors from a stylesheet.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/extract-selectors",
    tags: ["css", "extract", "selectors"],
    action: "extract-selectors",
    packages: [],
  },
  {
    slug: "css-extract-properties",
    name: "CSS Property Extractor",
    description: "Extract all CSS properties from a stylesheet.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/extract-properties",
    tags: ["css", "extract", "properties"],
    action: "extract-properties",
    packages: [],
  },
  {
    slug: "css-extract-media",
    name: "CSS Media Query Extractor",
    description: "Extract all media queries from a stylesheet.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/extract-media",
    tags: ["css", "extract", "media-queries"],
    action: "extract-media",
    packages: [],
  },
  {
    slug: "css-remove-unused",
    name: "CSS Unused Remover",
    description: "Remove unused CSS rules (basic implementation).",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/remove-unused",
    tags: ["css", "optimize", "remove"],
    action: "remove-unused",
    packages: [],
  },
  {
    slug: "css-stats",
    name: "CSS Statistics",
    description: "Get detailed statistics about CSS (selectors, rules, size).",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/css/stats",
    tags: ["css", "stats", "analysis"],
    action: "stats",
    packages: [],
  },

  // ===========================
  // 🧩 Code Utilities - JavaScript
  // ===========================
  {
    slug: "js-minify",
    name: "JavaScript Minifier",
    description:
      "Minify JavaScript to reduce file size and improve load speed.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/minify",
    tags: ["javascript", "minify", "uglify"],
    action: "minify",
    packages: ["terser"],
  },
  {
    slug: "js-beautify",
    name: "JavaScript Beautifier",
    description: "Beautify and format JavaScript code with proper indentation.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/beautify",
    tags: ["javascript", "beautify", "format"],
    action: "beautify",
    packages: ["js-beautify"],
  },
  {
    slug: "js-validate",
    name: "JavaScript Validator",
    description: "Validate JavaScript syntax and find errors.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/validate",
    tags: ["javascript", "validate", "lint"],
    action: "validate",
    packages: ["terser"],
  },
  {
    slug: "js-extract-functions",
    name: "JavaScript Function Extractor",
    description: "Extract all function declarations from JavaScript code.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/extract-functions",
    tags: ["javascript", "extract", "functions"],
    action: "extract-functions",
    packages: [],
  },
  {
    slug: "js-extract-variables",
    name: "JavaScript Variable Extractor",
    description: "Extract all variable declarations from JavaScript code.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/extract-variables",
    tags: ["javascript", "extract", "variables"],
    action: "extract-variables",
    packages: [],
  },
  {
    slug: "js-extract-imports",
    name: "JavaScript Import Extractor",
    description: "Extract all import statements from JavaScript code.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/extract-imports",
    tags: ["javascript", "extract", "imports"],
    action: "extract-imports",
    packages: [],
  },
  {
    slug: "js-stats",
    name: "JavaScript Statistics",
    description:
      "Get detailed statistics about JavaScript code (functions, variables, size).",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/js/stats",
    tags: ["javascript", "stats", "analysis"],
    action: "stats",
    packages: [],
  },
  {
    slug: "code-diff",
    name: "Code Diff Viewer",
    description:
      "Compare two code blocks and visualize differences with highlighting.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/code-diff",
    tags: ["diff", "compare", "code"],
    packages: ["diff"],
  },

  // ===========================
  // 📄 Formatters - JSON
  // ===========================
  {
    slug: "json-format",
    name: "JSON Formatter",
    description: "Format JSON with custom indentation and options.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/format",
    tags: ["json", "formatter"],
    action: "format",
    featured: true,
    packages: [], // Native JSON.stringify
  },
  {
    slug: "json-beautify",
    name: "JSON Beautifier",
    description: "Beautify JSON data using js-beautify.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/beautify",
    tags: ["json", "beautify"],
    action: "beautify",
    packages: ["js-beautify"],
  },
  {
    slug: "json-validate",
    name: "JSON Validator",
    description: "Validate JSON syntax with detailed error information.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/validate",
    tags: ["json", "validator"],
    action: "validate",
    packages: [], // Native JSON.parse
  },
  {
    slug: "json-minify",
    name: "JSON Minifier",
    description: "Minify JSON by removing all whitespace.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/minify",
    tags: ["json", "minify"],
    action: "minify",
    packages: [],
  },
  {
    slug: "json-flatten",
    name: "JSON Flattener",
    description: "Flatten nested JSON objects into a single level.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/flatten",
    tags: ["json", "flatten", "transform"],
    action: "flatten",
    packages: [],
  },
  {
    slug: "json-unflatten",
    name: "JSON Unflattener",
    description: "Convert flat JSON objects back to nested structure.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/unflatten",
    tags: ["json", "unflatten", "transform"],
    action: "unflatten",
    packages: [],
  },
  {
    slug: "json-merge",
    name: "JSON Merger",
    description: "Merge multiple JSON objects using JSON Merge Patch.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/merge",
    tags: ["json", "merge", "combine"],
    action: "merge",
    packages: ["json-merge-patch"],
  },
  {
    slug: "json-diff",
    name: "JSON Diff",
    description: "Compare two JSON objects and show differences.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/diff",
    tags: ["json", "diff", "compare"],
    action: "diff",
    packages: ["json-diff"],
  },
  {
    slug: "json-to-yaml",
    name: "JSON to YAML",
    description: "Convert JSON to YAML format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/to-yaml",
    tags: ["json", "yaml", "converter"],
    action: "to-yaml",
    packages: ["yaml"],
  },
  {
    slug: "json-to-xml",
    name: "JSON to XML",
    description: "Convert JSON to XML format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/to-xml",
    tags: ["json", "xml", "converter"],
    action: "to-xml",
    packages: ["xml-js"],
  },
  {
    slug: "json-extract-types",
    name: "JSON Type Extractor",
    description: "Extract type information from JSON objects.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/extract-types",
    tags: ["json", "types", "schema"],
    action: "extract-types",
    packages: [],
  },
  {
    slug: "json-escape-html",
    name: "JSON HTML Escaper",
    description: "Escape JSON strings for safe embedding in HTML and scripts.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/escape-html",
    tags: ["json", "escape", "html", "security"],
    action: "escape-html",
    packages: [],
  },
  {
    slug: "json-size-stats",
    name: "JSON Size Statistics",
    description:
      "Compare JSON sizes before and after formatting to see compression ratios.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/size-stats",
    tags: ["json", "stats", "size", "compression"],
    action: "size-stats",
    packages: [],
  },
  {
    slug: "json-sort-keys",
    name: "JSON Key Sorter",
    description: "Sort JSON object keys alphabetically recursively.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/sort-keys",
    tags: ["json", "sort", "keys", "organize"],
    action: "sort-keys",
    packages: [],
  },
  {
    slug: "json-remove-null",
    name: "JSON Null Remover",
    description: "Remove null properties from JSON objects.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/remove-null",
    tags: ["json", "clean", "transform"],
    action: "remove-null",
    packages: [],
  },
  {
    slug: "json-schema-validator",
    name: "JSON Schema Validator",
    description: "Validate JSON data against JSON Schema specifications.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json/schema-validate",
    tags: ["json", "schema", "validation"],
    packages: ["ajv", "ajv-formats"],
  },

  // ===========================
  // 📄 Formatters - XML
  // ===========================
  {
    slug: "xml-format",
    name: "XML Formatter",
    description: "Format and beautify XML with proper indentation.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/format",
    tags: ["xml", "formatter"],
    action: "format",
    packages: ["fast-xml-parser"],
  },
  {
    slug: "xml-beautify",
    name: "XML Beautifier",
    description: "Beautify XML documents with enhanced formatting.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/beautify",
    tags: ["xml", "beautify"],
    action: "beautify",
    packages: ["fast-xml-parser"],
  },
  {
    slug: "xml-minify",
    name: "XML Minifier",
    description: "Minify XML by removing unnecessary whitespace.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/minify",
    tags: ["xml", "minify"],
    action: "minify",
    packages: ["fast-xml-parser"],
  },
  {
    slug: "xml-validate",
    name: "XML Validator",
    description: "Validate XML syntax and structure.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/validate",
    tags: ["xml", "validator"],
    action: "validate",
    packages: ["fast-xml-parser"],
  },
  {
    slug: "xml-to-json",
    name: "XML to JSON",
    description: "Convert XML documents to JSON format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/to-json",
    tags: ["xml", "json", "converter"],
    action: "to-json",
    packages: ["fast-xml-parser", "xml-js"],
  },
  {
    slug: "xml-to-yaml",
    name: "XML to YAML",
    description: "Convert XML documents to YAML format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/to-yaml",
    tags: ["xml", "yaml", "converter"],
    action: "to-yaml",
    packages: ["xml-js", "yaml"],
  },
  {
    slug: "xml-extract-text",
    name: "XML Text Extractor",
    description: "Extract plain text content from XML documents.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/extract-text",
    tags: ["xml", "extract", "text"],
    action: "extract-text",
    packages: [],
  },
  {
    slug: "xml-extract-attributes",
    name: "XML Attribute Extractor",
    description: "Extract all attributes from XML elements.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/extract-attributes",
    tags: ["xml", "extract", "attributes"],
    action: "extract-attributes",
    packages: [],
  },
  {
    slug: "xml-analyze",
    name: "XML Structure Analyzer",
    description: "Analyze XML document structure and hierarchy.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/analyze",
    tags: ["xml", "analyze", "structure"],
    action: "analyze",
    packages: [],
  },
  {
    slug: "xml-validate-schema",
    name: "XML Schema Validator",
    description: "Validate XML against XSD schema definitions.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/xml/validate-schema",
    tags: ["xml", "schema", "validation"],
    action: "validate-schema",
    packages: ["fast-xml-parser"],
  },

  // ===========================
  // 📄 Formatters - CSV
  // ===========================
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV data to JSON format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/csv/to-json",
    tags: ["csv", "json", "converter"],
    action: "to-json",
    packages: ["papaparse"],
  },
  {
    slug: "csv-from-json",
    name: "JSON to CSV",
    description: "Convert JSON data to CSV format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/csv/from-json",
    tags: ["csv", "json", "converter"],
    action: "from-json",
    packages: ["papaparse"],
  },
  {
    slug: "csv-validate",
    name: "CSV Validator",
    description: "Validate CSV format and structure.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/csv/validate",
    tags: ["csv", "validator"],
    action: "validate",
    packages: ["papaparse"],
  },
  {
    slug: "csv-stats",
    name: "CSV Statistics",
    description: "Get statistics about CSV data (rows, columns, size).",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/csv/stats",
    tags: ["csv", "stats", "analysis"],
    action: "stats",
    packages: ["papaparse"],
  },

  // ===========================
  // 📄 Formatters - YAML
  // ===========================
  {
    slug: "yaml-format",
    name: "YAML Formatter",
    description: "Format YAML with custom indentation and options.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/yaml/format",
    tags: ["yaml", "formatter"],
    action: "format",
    packages: ["yaml"],
  },
  {
    slug: "yaml-validate",
    name: "YAML Validator",
    description: "Validate YAML syntax and structure.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/yaml/validate",
    tags: ["yaml", "validator"],
    action: "validate",
    packages: ["yaml"],
  },
  {
    slug: "yaml-minify",
    name: "YAML Minifier",
    description: "Minify YAML to compact format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/yaml/minify",
    tags: ["yaml", "minify"],
    action: "minify",
    packages: ["yaml"],
  },
  {
    slug: "yaml-beautify",
    name: "YAML Beautifier",
    description: "Beautify YAML with enhanced formatting.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/yaml/beautify",
    tags: ["yaml", "beautify"],
    action: "beautify",
    packages: ["yaml"],
  },
  {
    slug: "yaml-to-json",
    name: "YAML to JSON",
    description: "Convert YAML to JSON format.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/yaml/to-json",
    tags: ["yaml", "json", "converter"],
    action: "to-json",
    packages: ["yaml"],
  },
  {
    slug: "yaml-structure",
    name: "YAML Structure Analyzer",
    description: "Analyze YAML document structure and keys.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/yaml/structure",
    tags: ["yaml", "analyze", "structure"],
    action: "structure",
    packages: ["yaml"],
  },

  // ===========================
  // 📄 Formatters - SQL
  // ===========================
  {
    slug: "sql-format",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries with proper indentation.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/sql/format",
    tags: ["sql", "formatter", "database"],
    action: "format",
    packages: ["sql-formatter"],
  },
  {
    slug: "sql-validate",
    name: "SQL Validator",
    description: "Validate SQL syntax (basic validation).",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/sql/validate",
    tags: ["sql", "validator"],
    action: "validate",
    packages: [],
  },
  {
    slug: "sql-minify",
    name: "SQL Minifier",
    description: "Minify SQL queries by removing unnecessary whitespace.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/sql/minify",
    tags: ["sql", "minify"],
    action: "minify",
    packages: ["sql-formatter"],
  },

  // ===========================
  // 🎨 Frontend Tools
  // ===========================
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick and convert colors between HEX, RGB, and HSL.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/color-picker",
    tags: ["color", "design", "frontend"],
    packages: [],
  },
  {
    slug: "gradient-generator",
    name: "Gradient Generator",
    description: "Create and preview CSS gradients visually.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/gradient-generator",
    packages: [],
  },
  {
    slug: "box-shadow-generator",
    name: "Box Shadow Generator",
    description: "Design and preview CSS box-shadow styles.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/box-shadow-generator",
    packages: [],
  },
  {
    slug: "text-shadow-generator",
    name: "Text Shadow Generator",
    description: "Create and preview CSS text-shadow effects.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/text-shadow-generator",
    tags: ["css", "text-shadow", "design"],
    packages: [],
  },
  {
    slug: "border-radius-generator",
    name: "Border Radius Generator",
    description: "Generate CSS border-radius values with visual preview.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/border-radius-generator",
    tags: ["css", "border-radius", "design"],
    packages: [],
  },
  {
    slug: "transform-generator",
    name: "CSS Transform Generator",
    description: "Create CSS transform properties with preview.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/transform-generator",
    tags: ["css", "transform", "animation"],
    packages: [],
  },
  {
    slug: "css-flexbox-playground",
    name: "Flexbox Playground",
    description: "Experiment with CSS Flexbox layout properties live.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/flexbox-playground",
    packages: [],
  },
  {
    slug: "color-contrast-checker",
    name: "Color Contrast Checker",
    description:
      "Check color contrast ratios for WCAG accessibility compliance (AA/AAA).",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/color-contrast-checker",
    tags: ["color", "accessibility", "wcag", "contrast"],
    featured: true,
    packages: [], // Pure calculations
  },
  {
    slug: "css-specificity-calculator",
    name: "CSS Specificity Calculator",
    description: "Calculate CSS selector specificity and compare selectors.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/css-specificity-calculator",
    tags: ["css", "specificity", "selector"],
    packages: [], // Pure parsing
  },
  {
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    displayName: "Aspect Ratio Calculator",
    description:
      "Calculate and convert aspect ratios, find closest preset ratios.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/aspect-ratio-calculator",
    tags: ["aspect-ratio", "responsive", "design"],
    packages: [], // Pure calculations
  },

  // ===========================
  // ⚙️ Backend Tools
  // ===========================
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate versioned UUIDs for identifiers.",
    category: TOOL_CATEGORY_BACKEND,
    path: "/tools/backend/uuid-generator",
    packages: [], // Uses native crypto.randomUUID
  },

  // ===========================
  // 🧠 Content Tools
  // ===========================
  {
    slug: "markdown-preview",
    name: "Markdown Previewer",
    description: "Preview Markdown to HTML instantly.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/preview",
    packages: ["marked", "gray-matter"],
  },
  {
    slug: "markdown-validate",
    name: "Markdown Validator",
    description:
      "Validate Markdown structure, check for syntax errors and warnings.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/validate",
    tags: ["markdown", "validate", "lint"],
    packages: ["marked", "gray-matter"],
  },
  {
    slug: "markdown-extract-frontmatter",
    name: "Markdown Frontmatter Extractor",
    description: "Extract YAML frontmatter from Markdown documents.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/extract-frontmatter",
    tags: ["markdown", "frontmatter", "yaml", "extract"],
    packages: ["gray-matter"],
  },
  {
    slug: "markdown-extract-toc",
    name: "Markdown Table of Contents Generator",
    description:
      "Extract and generate table of contents from Markdown headers.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/extract-toc",
    tags: ["markdown", "toc", "table-of-contents", "extract"],
    packages: ["marked"],
  },
  {
    slug: "markdown-extract-code",
    name: "Markdown Code Block Extractor",
    description:
      "Extract all code blocks from Markdown documents with language detection.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/extract-code",
    tags: ["markdown", "code", "extract"],
    packages: ["marked"],
  },
  {
    slug: "markdown-extract-links",
    name: "Markdown Link Extractor",
    description: "Extract all links from Markdown documents.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/extract-links",
    tags: ["markdown", "links", "extract"],
    packages: ["marked"],
  },
  {
    slug: "markdown-extract-images",
    name: "Markdown Image Extractor",
    description: "Extract all image references from Markdown documents.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/extract-images",
    tags: ["markdown", "images", "extract"],
    packages: ["marked"],
  },
  {
    slug: "markdown-beautify",
    name: "Markdown Beautifier",
    description:
      "Beautify and format Markdown with consistent spacing and structure.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/beautify",
    tags: ["markdown", "beautify", "format"],
    packages: ["marked"],
  },
  {
    slug: "markdown-strip",
    name: "Markdown to Plain Text",
    description: "Strip Markdown syntax to extract plain text content.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/strip",
    tags: ["markdown", "text", "strip", "extract"],
    packages: ["marked"],
  },
  {
    slug: "markdown-stats",
    name: "Markdown Statistics",
    description:
      "Get detailed statistics about Markdown documents (words, characters, headers, links, etc.).",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown/stats",
    tags: ["markdown", "stats", "analysis"],
    packages: ["marked"],
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description: "Convert text or titles into clean URL slugs.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/slug-generator",
    packages: ["slugify"],
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    description:
      "Convert text between different case styles (camelCase, PascalCase, snake_case, etc.).",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/text-case-converter",
    tags: ["text", "case", "converter"],
    packages: ["change-case"],
  },
  {
    slug: "text-analyzer",
    name: "Text Analyzer",
    description:
      "Analyze text statistics: word count, character count, reading time, and more.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/text-analyzer",
    tags: ["text", "analysis", "stats"],
    packages: [],
  },
  {
    slug: "mock-data-generator",
    name: "Mock Data Generator",
    description:
      "Generate realistic mock data using faker.js with custom schemas and presets.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/mock-data-generator",
    tags: ["mock", "data", "faker", "testing"],
    featured: true,
    packages: ["@faker-js/faker"],
  },
  {
    slug: "video-converter",
    name: "Video Converter",
    description:
      "Convert videos between formats: MP4, WebM, AVI, MOV, MKV, GIF and more.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/video-converter",
    tags: ["video", "ffmpeg", "multimedia", "conversion"],
    featured: true,
    packages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    description:
      "Convert audio between formats: MP3, WAV, AAC, OGG, FLAC and more.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/audio-converter",
    tags: ["audio", "ffmpeg", "multimedia", "conversion"],
    featured: true,
    packages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description:
      "Convert images between formats: JPEG, PNG, WebP, GIF, BMP and more.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/image-converter",
    tags: ["image", "multimedia", "conversion"],
    featured: true,
    packages: [], // Uses native Canvas API
  },

  // ===========================
  // 🔍 SEO Tools
  // ===========================
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate and preview meta tags for SEO and social media.",
    category: TOOL_CATEGORY_SEO,
    path: "/tools/seo/meta-tag-generator",
    featured: true,
    packages: [],
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    description: "Easily generate robots.txt files for your website.",
    category: TOOL_CATEGORY_SEO,
    path: "/tools/seo/robots-txt-generator",
    packages: [],
  },
  {
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    description: "Create XML sitemaps for your website automatically.",
    category: TOOL_CATEGORY_SEO,
    path: "/tools/seo/sitemap-generator",
    packages: [],
  },

  // ===========================
  // 🧮 General Utilities
  // ===========================
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert UNIX timestamps to human-readable dates.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/timestamp-converter",
    packages: ["dayjs"],
  },
  {
    slug: "query-string-parser",
    name: "Query String Parser",
    description: "Parse, format, and manipulate URL query strings.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/query-string-parser",
    tags: ["url", "query", "parser"],
    packages: ["query-string", "qs"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test and validate regular expressions with live matching.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/regex-tester",
    tags: ["regex", "pattern", "test"],
    packages: ["regex-parser"],
  },
  {
    slug: "curl-generator",
    name: "cURL Command Generator",
    description: "Convert HTTP requests to cURL commands and vice versa.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/curl-generator",
    tags: ["curl", "http", "api", "request"],
    packages: [], // Pure string formatting
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes from text, URLs, or any string data.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/qr-code-generator",
    tags: ["qr-code", "barcode", "generator"],
    packages: ["qrcode"],
  },
  {
    slug: "user-agent-parser",
    name: "User Agent Parser",
    description:
      "Parse user agent strings to extract browser, OS, and device information.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/user-agent-parser",
    tags: ["user-agent", "browser", "parser"],
    packages: ["ua-parser-js"],
  },
  // ===========================
  // 🆕 New Tools (Batch 2)
  // ===========================
  {
    slug: "toml-formatter",
    name: "TOML Formatter",
    description: "Format, validate, and convert TOML configuration files.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/toml",
    tags: ["toml", "config", "format"],
    packages: ["@iarna/toml"],
  },
  {
    slug: "graphql-formatter",
    name: "GraphQL Formatter",
    description: "Format, validate, and minify GraphQL queries and schemas.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/graphql",
    tags: ["graphql", "query", "schema"],
    packages: ["graphql"],
  },
  {
    slug: "html-to-markdown",
    name: "HTML to Markdown",
    description:
      "Convert HTML content to Markdown format with customizable options.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/html-to-markdown",
    tags: ["html", "markdown", "convert"],
    packages: ["turndown"],
  },
  {
    slug: "html-to-text",
    name: "HTML to Text",
    description:
      "Extract plain text from HTML content, stripping all tags and formatting.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/html-to-text",
    tags: ["html", "text", "extract"],
    packages: ["turndown"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description:
      "Resize images client-side without backend. Supports all common formats.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/image-resizer",
    tags: ["image", "resize", "canvas"],
    packages: [], // Uses Canvas API
  },
  {
    slug: "image-optimizer",
    name: "Image Optimizer",
    description:
      "Optimize and compress images with format conversion and quality adjustment.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/image-optimizer",
    tags: ["image", "optimize", "compress"],
    packages: [], // Uses Canvas API
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    description: "Generate favicons in multiple sizes from any image source.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/favicon-generator",
    tags: ["favicon", "icon", "generate"],
    packages: [], // Uses Canvas API
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    description:
      "Generate harmonious color palettes using color theory (complementary, triadic, etc.).",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/color-palette-generator",
    tags: ["color", "palette", "design"],
    packages: [], // Pure color theory calculations
  },
  {
    slug: "font-pairing-generator",
    name: "Font Pairing Generator",
    description:
      "Get suggested font pairings for headings and body text with CSS examples.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/font-pairing-generator",
    tags: ["font", "typography", "pairing"],
    packages: [], // Preset data
  },
  {
    slug: "css-animation-generator",
    name: "CSS Animation Generator",
    description:
      "Generate CSS keyframe animations and transitions (fade, slide, bounce, etc.).",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/css-animation-generator",
    tags: ["css", "animation", "keyframes"],
    packages: [], // CSS generation
  },
  {
    slug: "env-generator",
    name: "Environment Variable Generator",
    description:
      "Generate .env files with templates for Node.js, Next.js, React, and more.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/env-generator",
    tags: ["env", "environment", "config"],
    packages: [], // Template generation
  },
  {
    slug: "package-json-generator",
    name: "Package.json Generator",
    description:
      "Generate package.json files with templates for various project types.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/package-json-generator",
    tags: ["package", "npm", "json"],
    packages: [], // Template generation
  },
  {
    slug: "git-command-generator",
    name: "Git Command Generator",
    description:
      "Generate Git commands interactively (clone, commit, push, branch, etc.).",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/git-command-generator",
    tags: ["git", "command", "generator"],
    packages: [], // Command string generation
  },
  {
    slug: "docker-command-generator",
    name: "Docker Command Generator",
    description:
      "Generate Docker and docker-compose commands with all options.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/docker-command-generator",
    tags: ["docker", "command", "container"],
    packages: [], // Command string generation
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Code Reference",
    description:
      "Comprehensive reference guide for all HTTP status codes with use cases.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/http-status-codes",
    tags: ["http", "status", "reference"],
    packages: [], // Static reference data
  },
  {
    slug: "semantic-html-checker",
    name: "Semantic HTML Checker",
    description:
      "Validate HTML for semantic correctness and accessibility best practices.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/semantic-html-checker",
    tags: ["html", "semantic", "accessibility", "frontend"],
    packages: [], // DOM parsing
  },
  {
    slug: "aria-generator",
    name: "ARIA Generator",
    description:
      "Generate ARIA attributes for improved accessibility with validation.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/aria-generator",
    tags: ["aria", "accessibility", "a11y", "frontend"],
    packages: [], // ARIA attribute generation
  },
  {
    slug: "markdown-table-generator",
    name: "Markdown Table Generator",
    description: "Generate and format Markdown tables with alignment options.",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/markdown-table-generator",
    tags: ["markdown", "table", "format"],
    packages: [], // Table formatting
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description:
      "Generate placeholder text in multiple styles (Latin, Bacon, Cat, Pirate, Hipster).",
    category: TOOL_CATEGORY_CONTENT,
    path: "/tools/content/lorem-ipsum-generator",
    tags: ["lorem", "placeholder", "text"],
    packages: [], // Text generation
  },
  {
    slug: "text-deduplicator",
    name: "Text Deduplicator",
    description: "Remove duplicate lines, words, or characters from text.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/text-deduplicator",
    tags: ["text", "deduplicate", "clean"],
    packages: [], // Text processing
  },
  {
    slug: "code-snippet-formatter",
    name: "Code Snippet Formatter",
    description:
      "Format code snippets for GitHub, Gist, Pastebin, and more with syntax highlighting.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/snippet-formatter",
    tags: ["code", "snippet", "format"],
    packages: [], // Code formatting
  },
  {
    slug: "json-to-sql",
    name: "JSON to SQL Insert",
    description:
      "Convert JSON arrays to SQL INSERT statements with batching and options.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/json-to-sql",
    tags: ["json", "sql", "convert"],
    packages: [], // SQL generation
  },
  {
    slug: "webhook-formatter",
    name: "Webhook Payload Formatter",
    description:
      "Format webhook payloads as cURL, fetch, or axios code with validation.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/webhook-formatter",
    tags: ["webhook", "api", "format"],
    packages: [], // HTTP request formatting
  },
  {
    slug: "api-response-formatter",
    name: "API Response Formatter",
    description:
      "Format API responses in standard, minimal, or verbose styles (JSON, XML, YAML).",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/api-response",
    tags: ["api", "response", "format"],
    packages: [], // Response formatting
  },
  {
    slug: "jsonpath-playground",
    name: "JSONPath Playground",
    description:
      "Query and manipulate JSON with JSONPath expressions and examples.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/jsonpath-playground",
    tags: ["json", "jsonpath", "query"],
    packages: ["jsonpath-plus"],
  },
  // ===========================
  // 🔒 Security Tools
  // ===========================
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and verify JSON Web Tokens safely.",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/jwt-decoder",
    tags: ["jwt", "token", "security", "decode"],
    packages: ["jwt-decode"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description:
      "Generate MD5, SHA1, SHA256, SHA512 and other cryptographic hashes.",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/hash-generator",
    tags: ["hash", "crypto", "security", "md5", "sha"],
    packages: ["crypto-js"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Generate secure random passwords with customizable options (length, characters, symbols).",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/password-generator",
    tags: ["password", "security", "generator", "random"],
    featured: true,
    packages: [], // Uses native crypto.getRandomValues
  },
  {
    slug: "csp-header-generator",
    name: "CSP Header Generator",
    description:
      "Generate Content Security Policy headers with customizable directives for security.",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/csp-header-generator",
    tags: ["security", "csp", "headers", "content-security-policy"],
    featured: true,
    packages: [], // Pure string generation
  },
  {
    slug: "html-entity-encoder",
    name: "HTML Entity Encoder/Decoder",
    description:
      "Encode and decode HTML entities to prevent XSS attacks and ensure safe HTML rendering.",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/html-entity-encoder",
    tags: ["html", "entity", "encode", "decode", "security", "xss"],
    packages: ["he"],
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode or decode URLs safely to prevent injection attacks and ensure proper URL handling.",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/url-encoder-decoder",
    tags: ["url", "encode", "decode", "security"],
    packages: [], // Uses native encodeURIComponent/decodeURIComponent
  },
  {
    slug: "base64-converter",
    name: "Base64 Converter",
    description: "Convert text to and from Base64 encoding securely.",
    category: TOOL_CATEGORY_SECURITY,
    path: "/tools/security/base64-converter",
    tags: ["base64", "encode", "decode", "security"],
    packages: [], // Uses native btoa/atob
  },

  // ===========================
  // 📄 Document Converters (Multimedia/File Conversion)
  // ===========================
  {
    slug: "docx-to-html",
    name: "DOCX to HTML",
    description:
      "Convert Word documents (DOCX) to HTML format with formatting preservation.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/docx-to-html",
    tags: ["docx", "word", "html", "convert", "document"],
    packages: ["mammoth"],
  },
  {
    slug: "docx-to-markdown",
    name: "DOCX to Markdown",
    description: "Convert Word documents (DOCX) to Markdown format.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/docx-to-markdown",
    tags: ["docx", "word", "markdown", "convert", "document"],
    packages: ["mammoth"],
  },
  {
    slug: "docx-to-text",
    name: "DOCX to Text",
    description: "Extract plain text from Word documents (DOCX).",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/docx-to-text",
    tags: ["docx", "word", "text", "extract", "document"],
    packages: ["mammoth"],
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description:
      "Convert HTML content to PDF with customizable formatting options.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/html-to-pdf",
    tags: ["html", "pdf", "convert", "document"],
    packages: ["jspdf", "html2pdf"],
  },
  {
    slug: "markdown-to-pdf",
    name: "Markdown to PDF",
    description: "Convert Markdown documents to PDF format.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/markdown-to-pdf",
    tags: ["markdown", "pdf", "convert", "document"],
    packages: ["jspdf", "html2pdf", "marked"],
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    description:
      "Convert plain text to PDF with customizable font and layout options.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/text-to-pdf",
    tags: ["text", "pdf", "convert", "document"],
    packages: ["jspdf"],
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    description:
      "Extract text content from PDF files with page-by-page extraction.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/pdf-to-text",
    tags: ["pdf", "text", "extract", "document"],
    packages: ["pdfjs-dist"],
  },
  {
    slug: "docx-to-pdf",
    name: "DOCX to PDF",
    description:
      "Convert Word documents (DOCX) to PDF format. Note: Complex formatting may not be perfectly preserved.",
    category: TOOL_CATEGORY_MULTIMEDIA,
    path: "/tools/multimedia/docx-to-pdf",
    tags: ["docx", "word", "pdf", "convert", "document"],
    packages: ["mammoth", "jspdf", "html2pdf"],
  },

  // ===========================
  // ⏰ Workflow Tools
  // ===========================
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    description:
      "Convert timestamps between timezones with UTC offset calculations.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/timezone-converter",
    tags: ["timezone", "time", "date", "converter"],
    featured: true,
    packages: ["dayjs", "date-fns-tz"],
  },
  {
    slug: "cron-builder",
    name: "Cron Expression Builder",
    description:
      "Visual builder for cron expressions with validation and preview.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/cron-builder",
    tags: ["cron", "schedule", "task", "automation"],
    featured: true,
    packages: ["cron-parser"],
  },
  {
    slug: "duration-calculator",
    name: "Duration Calculator",
    description:
      "Calculate differences between dates and format durations (ISO 8601, human-readable).",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/duration-calculator",
    tags: ["duration", "time", "date", "calculation"],
    packages: ["dayjs"],
  },
  {
    slug: "date-range-generator",
    name: "Date Range Generator",
    description:
      "Generate date ranges, sequences, and intervals for testing and data generation.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/date-range-generator",
    tags: ["date", "range", "generator", "testing"],
    packages: ["dayjs"],
  },
  {
    slug: "semver-calculator",
    name: "Semantic Version Calculator",
    description:
      "Calculate next version (major/minor/patch), compare versions, and check version ranges.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/semver-calculator",
    tags: ["version", "semver", "semantic", "release"],
    featured: true,
    packages: ["semver"],
  },
  {
    slug: "git-commit-generator",
    name: "Git Commit Message Generator",
    description:
      "Generate conventional commit messages with templates for consistent commits.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/git-commit-generator",
    tags: ["git", "commit", "conventional", "message"],
    featured: true,
    packages: [],
  },
  {
    slug: "changelog-generator",
    name: "Changelog Generator",
    description:
      "Generate CHANGELOG.md from git commits or manual input (Keep a Changelog format).",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/changelog-generator",
    tags: ["changelog", "release", "notes", "documentation"],
    packages: [],
  },
  {
    slug: "readme-generator",
    name: "README Generator",
    description:
      "Generate README.md files with templates for various project types.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/readme-generator",
    tags: ["readme", "documentation", "generator", "template"],
    featured: true,
    packages: [],
  },
  {
    slug: "license-generator",
    name: "License Generator",
    description:
      "Generate license files (MIT, Apache, GPL, BSD, ISC, etc.) with customization.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/license-generator",
    tags: ["license", "legal", "generator", "template"],
    packages: [],
  },
  {
    slug: "npm-command-generator",
    name: "NPM Command Generator",
    description: "Generate npm commands with all options interactively.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/npm-command-generator",
    tags: ["npm", "command", "generator", "package"],
    packages: [],
  },
  {
    slug: "dependency-analyzer",
    name: "Dependency Analyzer",
    description:
      "Analyze package.json dependencies, find duplicates, and validate versions.",
    category: TOOL_CATEGORY_WORKFLOW,
    path: "/tools/workflow/dependency-analyzer",
    tags: ["dependencies", "package.json", "npm", "analysis"],
    packages: [],
  },

  // ===========================
  // 🗄️ Database Tools
  // ===========================
  {
    slug: "sql-query-builder",
    name: "SQL Query Builder",
    description:
      "Build SELECT, INSERT, UPDATE, DELETE queries with WHERE, JOIN, ORDER BY, etc.",
    category: TOOL_CATEGORY_DATABASE,
    path: "/tools/database/sql-query-builder",
    tags: ["sql", "query", "builder", "database"],
    featured: true,
    packages: ["sql-formatter"],
  },
  {
    slug: "sql-escape",
    name: "SQL Escape/Unescape",
    description:
      "Escape SQL strings to prevent injection, unescape escaped strings.",
    category: TOOL_CATEGORY_DATABASE,
    path: "/tools/database/sql-escape",
    tags: ["sql", "escape", "security", "injection"],
    packages: [],
  },
  {
    slug: "db-connection-parser",
    name: "Database Connection String Parser",
    description:
      "Parse and validate database connection strings (PostgreSQL, MySQL, MongoDB, etc.).",
    category: TOOL_CATEGORY_DATABASE,
    path: "/tools/database/connection-parser",
    tags: ["database", "connection", "parser", "validate"],
    packages: ["pg-connection-string", "mysql-connection-string-parser"],
  },

  // ===========================
  // 🏗️ Infrastructure Tools
  // ===========================
  {
    slug: "docker-compose-validator",
    name: "Docker Compose Validator",
    description: "Validate docker-compose.yml syntax and structure.",
    category: TOOL_CATEGORY_INFRASTRUCTURE,
    path: "/tools/infrastructure/docker-compose-validator",
    tags: ["docker", "compose", "validator", "yaml"],
    packages: ["yaml"],
  },
  {
    slug: "k8s-validator",
    name: "Kubernetes YAML Validator",
    description:
      "Validate Kubernetes manifests (Deployment, Service, ConfigMap, etc.).",
    category: TOOL_CATEGORY_INFRASTRUCTURE,
    path: "/tools/infrastructure/k8s-validator",
    tags: ["kubernetes", "k8s", "yaml", "validator"],
    packages: ["yaml"],
  },
  {
    slug: "env-validator",
    name: "Environment Variable Validator",
    description:
      "Validate .env files for common issues, duplicate keys, and format.",
    category: TOOL_CATEGORY_INFRASTRUCTURE,
    path: "/tools/infrastructure/env-validator",
    tags: ["env", "environment", "validator", "config"],
    packages: ["dotenv"],
  },
  {
    slug: "subnet-calculator",
    name: "Subnet Calculator",
    description:
      "Calculate subnet masks, network addresses, broadcast addresses, and host ranges.",
    category: TOOL_CATEGORY_INFRASTRUCTURE,
    path: "/tools/infrastructure/subnet-calculator",
    tags: ["subnet", "network", "ip", "calculator"],
    packages: [],
  },

  // ===========================
  // 🌐 API Tools
  // ===========================
  {
    slug: "openapi-validator",
    name: "OpenAPI/Swagger Validator",
    description: "Validate OpenAPI 2.0/3.0/3.1 and Swagger specifications.",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/openapi-validator",
    tags: ["openapi", "swagger", "api", "validator"],
    featured: true,
    packages: ["swagger-parser", "ajv"],
  },
  {
    slug: "rest-client-generator",
    name: "REST Client Code Generator",
    description:
      "Generate code for fetch, axios, node-fetch, cURL, HTTPie, Python requests, Go HTTP.",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/rest-client-generator",
    tags: ["rest", "api", "client", "generator"],
    featured: true,
    packages: ["openapi-to-typescript"],
  },
  {
    slug: "http-header-builder",
    name: "HTTP Header Builder",
    description:
      "Build and validate HTTP headers with common presets and generate cURL/fetch code.",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/http-header-builder",
    tags: ["http", "header", "api", "request"],
    packages: [],
  },
  {
    slug: "cookie-parser",
    name: "Cookie Parser/Editor",
    description:
      "Parse, edit, and generate Set-Cookie headers with validation.",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/cookie-parser",
    tags: ["cookie", "http", "parser", "header"],
    packages: ["cookie"],
  },
  {
    slug: "url-parser",
    name: "URL Parser/Builder",
    description:
      "Parse, build, validate, and manipulate URLs with query parameter management.",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/url-parser",
    tags: ["url", "parser", "builder", "query"],
    packages: ["url-pattern"],
  },
  {
    slug: "hmac-generator",
    name: "HMAC Generator",
    description:
      "Generate HMAC signatures for various algorithms (SHA256, SHA512, etc.).",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/hmac-generator",
    tags: ["hmac", "signature", "crypto", "api"],
    packages: [],
  },
  {
    slug: "jwt-builder",
    name: "JWT Builder",
    description:
      "Build and sign JWT tokens with custom claims (complement to JWT Decoder).",
    category: TOOL_CATEGORY_API,
    path: "/tools/api/jwt-builder",
    tags: ["jwt", "token", "builder", "security"],
    packages: ["jose"],
  },

  // ===========================
  // 🛠️ Additional Utilities
  // ===========================
  {
    slug: "ip-analyzer",
    name: "IP Address Analyzer",
    description:
      "Parse IP addresses, check if private/public, validate CIDR notation.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/ip-analyzer",
    tags: ["ip", "address", "network", "analyzer"],
    packages: ["ip-address"],
  },
  {
    slug: "typescript-generator",
    name: "TypeScript Interface Generator",
    description:
      "Generate TypeScript interfaces/types from JSON objects or schemas.",
    category: TOOL_CATEGORY_UTILITIES,
    path: "/tools/utilities/typescript-generator",
    tags: ["typescript", "interface", "generator", "type"],
    packages: ["json-to-ts", "quicktype"],
  },
  {
    slug: "code-metrics",
    name: "Code Metrics Calculator",
    description:
      "Calculate LOC, comment ratio, function count, complexity metrics.",
    category: TOOL_CATEGORY_CODE,
    path: "/tools/code/metrics-calculator",
    tags: ["code", "metrics", "analysis", "quality"],
    packages: ["complexity-report", "plato"],
  },
  {
    slug: "component-generator",
    name: "Component Generator",
    description:
      "Generate React, Vue, Svelte, Angular, HTML component boilerplate.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/component-generator",
    tags: ["component", "generator", "react", "vue"],
    packages: [],
  },
  {
    slug: "api-route-generator",
    name: "API Route Generator",
    description:
      "Generate API route handlers for Next.js, Express, Fastify, Koa, Hapi.",
    category: TOOL_CATEGORY_BACKEND,
    path: "/tools/backend/api-route-generator",
    tags: ["api", "route", "generator", "backend"],
    packages: [],
  },
  {
    slug: "javascript-formatter",
    name: "JavaScript/TypeScript Formatter",
    description:
      "Format, beautify, minify, and validate JavaScript/TypeScript code. Convert between ESM and CommonJS.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/javascript",
    tags: ["javascript", "typescript", "format", "beautify", "minify"],
    packages: ["js-beautify", "terser"],
  },
  {
    slug: "env-formatter",
    name: ".env File Formatter",
    description:
      "Format, validate, and convert .env files. Sort variables, remove duplicates, validate syntax.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/env",
    tags: ["env", "environment", "config", "format"],
    packages: ["envfile"],
  },
  {
    slug: "ini-formatter",
    name: "INI/Properties Formatter",
    description:
      "Format and validate INI and Properties files. Convert between INI and JSON formats.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/ini",
    tags: ["ini", "properties", "config", "format"],
    packages: ["ini"],
  },
  {
    slug: "package-json-formatter",
    name: "package.json Formatter",
    description:
      "Format, validate, and analyze package.json files. Sort dependencies, validate structure.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/package-json",
    tags: ["package.json", "npm", "node", "format", "validate"],
    packages: ["sort-package-json"],
  },
  {
    slug: "gitignore-formatter",
    name: ".gitignore Formatter",
    description:
      "Format and validate .gitignore files. Sort patterns, remove duplicates, generate templates.",
    category: TOOL_CATEGORY_FORMATTERS,
    path: "/tools/formatters/gitignore",
    tags: ["gitignore", "git", "format", "validate"],
    packages: ["parse-gitignore"],
  },
  {
    slug: "color-converter",
    name: "Color Format Converter",
    description: "Convert colors between HEX, RGB, HSL, HSV, CMYK formats.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/color-converter",
    tags: ["color", "converter", "hex", "rgb", "hsl"],
    packages: ["color", "color-convert"],
  },
  {
    slug: "browser-compatibility",
    name: "Browser Compatibility Checker",
    description:
      "Check feature support across browsers using static compatibility data.",
    category: TOOL_CATEGORY_FRONTEND,
    path: "/tools/frontend/browser-compatibility",
    tags: ["browser", "compatibility", "feature", "support"],
    packages: ["caniuse-api", "browserslist"],
  },
];

export const groupedTools = tools.reduce<Record<ToolCategory, Tool[]>>(
  (acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  },
  TOOL_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = [];
      return acc;
    },
    {} as Record<ToolCategory, Tool[]>,
  ),
);

// Re-export utility functions
export { getCategoryIcon, getCategoryLabel } from "./tool-icons";
export {
  getAllToolsByCategoryAndType,
  getToolsByCategory,
  getToolsByCategoryAndType,
  extractCategoryFromPath,
  extractTypeFromPath,
  extractActionFromPath,
  parseToolPath,
  getTypesInCategory,
  getCategoryPath,
  getTypePath,
} from "./tool-utils";
export {
  getToolDisplayName,
  getToolTypeDisplayName,
  getToolActionDisplayName,
} from "./tool-display";
