/**
 * @workspace/utilities
 *
 * Client-side utility functions for web development tools
 * All functions are pure and can run in the browser without backend support
 */

// Code utilities
export * from "./modules/code/html-minifier";
export * from "./modules/code/css-minifier";
export * from "./modules/code/js-minifier";

// Formatters
export * from "./modules/formatters/json-formatter";
export {
  formatXml,
  minifyXml,
  beautifyXml,
  validateXml,
  xmlToJson,
  xmlToYaml,
  extractTextFromXml,
  extractAttributesFromXml,
  getXmlStructure,
  validateXmlSchema,
} from "./modules/formatters/xml-formatter";
export * from "./modules/formatters/csv-formatter";
export * from "./modules/formatters/yaml-formatter";
export * from "./modules/formatters/sql-formatter";
export * from "./modules/formatters/json-schema-validator";
export * from "./modules/formatters/toml-formatter";
export {
  formatGraphQL,
  minifyGraphQL,
  validateGraphQL,
  extractOperationName,
  extractGraphQLVariables,
  extractFields,
} from "./modules/formatters/graphql-formatter";
export * from "./modules/formatters/code-snippet-formatter";
export * from "./modules/formatters/json-to-sql";
export * from "./modules/formatters/webhook-formatter";
export * from "./modules/formatters/api-response-formatter";
export * from "./modules/formatters/jsonpath-playground";
export {
  formatJavaScript,
  minifyJavaScript,
  validateJavaScript,
  extractImports as extractJavaScriptImports,
  convertToESM,
  convertToCommonJS,
  type JavaScriptFormatOptions,
  type JavaScriptMinifyOptions,
} from "./modules/formatters/javascript-formatter";
export * from "./modules/formatters/env-formatter";
export * from "./modules/formatters/ini-formatter";
export * from "./modules/formatters/package-json-formatter";
export * from "./modules/formatters/gitignore-formatter";

// Frontend tools
export * from "./modules/frontend/color-picker";
export * from "./modules/frontend/gradient-generator";
export * from "./modules/frontend/box-shadow-generator";
export * from "./modules/frontend/text-shadow-generator";
export * from "./modules/frontend/border-radius-generator";
export * from "./modules/frontend/transform-generator";
export {
  calculateContrast,
  checkContrast,
  getBestContrastColor,
  getReadableTextColor,
  hexToRgbColor,
  rgbToHexFromContrast as rgbToHexFromContrast,
} from "./modules/frontend/color-contrast-checker";
export * from "./modules/frontend/css-specificity-calculator";
export * from "./modules/frontend/aspect-ratio-calculator";
export * from "./modules/frontend/color-palette-generator";
export * from "./modules/frontend/font-pairing-generator";
export * from "./modules/frontend/css-animation-generator";

// Backend utilities
export * from "./modules/backend/jwt-decoder";
export * from "./modules/backend/hash-generator";
export * from "./modules/backend/uuid-generator";

// Content tools
export {
  extractCodeBlocks,
  extractLinks as extractMarkdownLinks,
  extractImages as extractMarkdownImages,
  extractTableOfContents,
  markdownToHtml,
  markdownToHtmlSync,
  validateMarkdown,
  extractFrontmatter,
  getMarkdownStats,
  stripMarkdown,
  beautifyMarkdown,
} from "./modules/content/markdown-preview";
export * from "./modules/content/lorem-generator";
export * from "./modules/content/slug-generator";
export * from "./modules/content/mock-data-generator";
export * from "./modules/content/html-to-markdown";
export * from "./modules/content/markdown-table-generator";
export {
  generateLoremIpsum,
  generatePlaceholderText,
  type LoremOptions as LoremIpsumOptions,
} from "./modules/content/lorem-ipsum-generator";

// SEO tools
export * from "./modules/seo/meta-tag-generator";
export * from "./modules/seo/robots-txt-generator";
export * from "./modules/seo/sitemap-generator";

// Multimedia processing
export * from "./modules/multimedia/index";
export * from "./modules/multimedia/image-resizer";
export * from "./modules/multimedia/image-optimizer";
export * from "./modules/multimedia/favicon-generator";

// General utilities
export * from "./modules/utilities/url-encoder-decoder";
export * from "./modules/utilities/base64-converter";
export * from "./modules/utilities/timestamp-converter";
export * from "./modules/utilities/text-case-converter";
export * from "./modules/utilities/text-analyzer";
export * from "./modules/utilities/html-entity";
export {
  parseQueryString,
  formatQueryString as stringifyQueryString,
  getQueryParam as getQueryParamFromString,
  removeQueryParam as removeQueryParamFromString,
  setQueryParam as addQueryParam,
  mergeQueryStrings,
  validateQueryString,
  type QueryParams,
} from "./modules/utilities/query-string";
export * from "./modules/utilities/password-generator";
export * from "./modules/utilities/regex-tester";
export {
  generateCurlCommand as generateCurlFromRequest,
  generatePrettyCurlCommand,
  parseCurlCommand,
  type HttpRequest as CurlHttpRequest,
} from "./modules/utilities/curl-generator";
export * from "./modules/utilities/qr-code-generator";
export * from "./modules/utilities/user-agent-parser";
export * from "./modules/utilities/code-diff";
export * from "./modules/utilities/text-deduplicator";
export {
  generateEnvFile,
  getEnvTemplate,
  getAllEnvTemplates,
  parseEnvFile as parseEnvFileContent,
  validateEnvFile as validateEnvFileFormat,
  ENV_TEMPLATES,
  type EnvVariable as EnvGeneratorVariable,
  type EnvTemplate,
} from "./modules/utilities/env-generator";
export * from "./modules/utilities/package-json-generator";
export * from "./modules/utilities/git-command-generator";
export * from "./modules/utilities/docker-command-generator";
export * from "./modules/utilities/http-status-codes";
export * from "./modules/utilities/timezone-converter";
export * from "./modules/utilities/cron-builder";
export * from "./modules/utilities/ip-analyzer";
export * from "./modules/utilities/hmac-generator";
export * from "./modules/utilities/semver-calculator";
export * from "./modules/utilities/git-commit-generator";
export * from "./modules/utilities/duration-calculator";
export * from "./modules/utilities/subnet-calculator";
export * from "./modules/utilities/jwt-builder";
export {
  escapeSQL,
  unescapeSQL,
  escapeSQLIdentifier,
  escapeSQLLikePattern,
  sanitizeSQL,
  getSQLPlaceholder,
  type SQLDialect as SQLDialectType,
  type EscapeOptions,
} from "./modules/utilities/sql-escape";
export * from "./modules/utilities/date-range-generator";
export * from "./modules/utilities/license-generator";
export * from "./modules/utilities/readme-generator";
export * from "./modules/utilities/changelog-generator";
export * from "./modules/utilities/dependency-analyzer";
export {
  buildHttpHeaders,
  buildHttpRequest as buildHttpRequestHeaders,
  generateCurlCommand as generateCurlFromHeaders,
  generateFetchCode as generateFetchFromHeaders,
  type HttpRequest as HttpHeaderRequest,
  type HttpMethod,
  type HttpHeader,
} from "./modules/utilities/http-header-builder";
export {
  parseURL as parseUrl,
  buildURL as buildUrl,
  validateURL as validateUrl,
  getQueryParam as getQueryParamFromUrl,
  removeQueryParam as removeQueryParamFromUrl,
  addQueryParam as addQueryParamToUrl,
  getAllQueryParams,
  setQueryParams,
  type ParsedURL as ParsedUrl,
} from "./modules/utilities/url-parser";
export * from "./modules/utilities/cookie-parser";
export * from "./modules/utilities/typescript-generator";
export * from "./modules/utilities/code-metrics";
export * from "./modules/utilities/npm-command-generator";
export {
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  buildSQLQuery,
  type SQLDialect as SQLQueryDialect,
  type SelectQuery,
  type InsertQuery,
  type UpdateQuery,
  type DeleteQuery,
  type SQLQuery,
} from "./modules/utilities/sql-query-builder";
export * from "./modules/utilities/db-connection-parser";
export {
  validateEnvFile as validateEnvFileContent,
  type EnvVariable as EnvValidatorVariable,
  type EnvValidationResult as EnvValidatorResult,
} from "./modules/utilities/env-validator";
export * from "./modules/utilities/rest-client-generator";
export * from "./modules/utilities/openapi-validator";
export * from "./modules/utilities/docker-compose-validator";
export * from "./modules/utilities/k8s-validator";
export {
  generateComponent,
  getAvailableFrameworks as getComponentFrameworks,
  type Framework as ComponentFramework,
  type ComponentOptions,
} from "./modules/utilities/component-generator";
export * from "./modules/utilities/api-route-generator";
export * from "./modules/utilities/jsonpath-builder";
export {
  hexToRgb as hexToRgbConverter,
  rgbToHex as rgbToHexConverter,
  rgbToHsl as rgbToHslConverter,
  hslToRgb as hslToRgbConverter,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
  convertColor,
  type ColorFormat,
  type RGB,
  type RGBA,
  type HSL,
  type HSLA,
  type HSV,
  type CMYK,
} from "./modules/utilities/color-converter";
export * from "./modules/utilities/browser-compatibility";

// Accessibility tools
export * from "./modules/accessibility/semantic-html-checker";
export * from "./modules/accessibility/aria-generator";

// Security tools
export * from "./modules/security/csp-header-generator";

// Document converters
export * from "./modules/document/index";
