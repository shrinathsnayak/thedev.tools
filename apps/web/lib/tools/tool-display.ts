/**
 * Display name utilities for tools
 * Handles proper formatting of types, actions, and tool names
 */

import type { Tool } from "@workspace/types/tools";

/**
 * Common acronyms and their proper display formats
 */
const TYPE_DISPLAY_MAP: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
  ts: "TypeScript",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
  csv: "CSV",
  toml: "TOML",
  sql: "SQL",
  graphql: "GraphQL",
  md: "Markdown",
  pdf: "PDF",
  docx: "DOCX",
  gif: "GIF",
  jpg: "JPG",
  png: "PNG",
  svg: "SVG",
  webp: "WebP",
  mp4: "MP4",
  mp3: "MP3",
  wav: "WAV",
  aac: "AAC",
  flac: "FLAC",
  api: "API",
  url: "URL",
  uri: "URI",
  uuid: "UUID",
  jwt: "JWT",
  http: "HTTP",
  https: "HTTPS",
  ssl: "SSL",
  tls: "TLS",
  csp: "CSP",
  seo: "SEO",
  aria: "ARIA",
  wcag: "WCAG",
  dom: "DOM",
  css3: "CSS3",
  html5: "HTML5",
};

/**
 * Common action display names
 */
const ACTION_DISPLAY_MAP: Record<string, string> = {
  minify: "Minify",
  beautify: "Beautify",
  format: "Format",
  validate: "Validate",
  convert: "Convert",
  extract: "Extract",
  merge: "Merge",
  diff: "Diff",
  compare: "Compare",
  encode: "Encode",
  decode: "Decode",
  generate: "Generate",
  parse: "Parse",
  stringify: "Stringify",
  optimize: "Optimize",
  compress: "Compress",
  resize: "Resize",
  transform: "Transform",
};

/**
 * Formats a type name for display (handles acronyms)
 */
export function formatTypeName(type: string): string {
  const lowerType = type.toLowerCase();
  return TYPE_DISPLAY_MAP[lowerType] || capitalize(type);
}

/**
 * Formats an action name for display
 */
export function formatActionName(action: string): string {
  const lowerAction = action.toLowerCase();
  return (
    ACTION_DISPLAY_MAP[lowerAction] ||
    action
      .split("-")
      .map((word) => capitalize(word))
      .join(" ")
  );
}

/**
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a hyphenated string to title case
 */
export function formatHyphenated(str: string): string {
  return str
    .split("-")
    .map((word) => {
      const lower = word.toLowerCase();
      return TYPE_DISPLAY_MAP[lower] || capitalize(word);
    })
    .join(" ");
}

/**
 * Gets display name for a tool path segment
 */
export function getDisplayNameForPath(segment: string): string {
  // Check if it's a known type
  const typeDisplay = formatTypeName(segment);
  if (typeDisplay !== capitalize(segment)) {
    return typeDisplay;
  }

  // Check if it's a known action
  const actionDisplay = formatActionName(segment);
  if (actionDisplay !== capitalize(segment)) {
    return actionDisplay;
  }

  // Default: format hyphenated string
  return formatHyphenated(segment);
}

/**
 * Tool display name helpers
 */

/**
 * Gets the display name for a tool (uses displayName if available, otherwise name)
 */
export function getToolDisplayName(tool: Tool): string {
  return tool.displayName || tool.name;
}

/**
 * Gets the display name for a tool type (extracted from path)
 */
export function getToolTypeDisplayName(tool: Tool): string {
  if (tool.typeDisplayName) {
    return tool.typeDisplayName;
  }

  // Extract type from path (e.g., /tools/code/html/minify -> html)
  const pathParts = tool.path.split("/").filter(Boolean);
  const typeIndex = pathParts.indexOf("tools");
  const type = pathParts[typeIndex + 2]; // category, type, action

  return type ? formatTypeName(type) : "";
}

/**
 * Gets the display name for a tool action (extracted from path or action field)
 */
export function getToolActionDisplayName(tool: Tool): string {
  if (tool.actionDisplayName) {
    return tool.actionDisplayName;
  }

  const action = tool.action || tool.path.split("/").pop() || "";
  return action ? formatActionName(action) : "";
}

