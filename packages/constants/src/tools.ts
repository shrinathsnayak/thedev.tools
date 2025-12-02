/**
 * Shared constants for tools library
 * Used across web app and formatters package
 */

import type { ToolCategory } from "@workspace/types/tools";

/**
 * Individual tool category constants
 * Can be imported individually in apps
 */
export const TOOL_CATEGORY_CODE = "code" as const;
export const TOOL_CATEGORY_FRONTEND = "frontend" as const;
export const TOOL_CATEGORY_BACKEND = "backend" as const;
export const TOOL_CATEGORY_CONTENT = "content" as const;
export const TOOL_CATEGORY_SEO = "seo" as const;
export const TOOL_CATEGORY_UTILITIES = "utilities" as const;
export const TOOL_CATEGORY_FORMATTERS = "formatters" as const;
export const TOOL_CATEGORY_MULTIMEDIA = "multimedia" as const;
export const TOOL_CATEGORY_SECURITY = "security" as const;
export const TOOL_CATEGORY_WORKFLOW = "workflow" as const;
export const TOOL_CATEGORY_DATABASE = "database" as const;
export const TOOL_CATEGORY_INFRASTRUCTURE = "infrastructure" as const;
export const TOOL_CATEGORY_API = "api" as const;

/**
 * All available tool categories as an array
 * Uses the individual category constants above
 */
export const TOOL_CATEGORIES: ToolCategory[] = [
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
];

/**
 * Fuse.js search configuration
 */
export const FUSE_SEARCH_CONFIG = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.2 },
    { name: "category", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
} as const;

/**
 * Minimum query length for search
 */
export const MIN_SEARCH_QUERY_LENGTH = 2;

/**
 * Path parsing constants
 */
export const PATH_CONSTANTS = {
  TOOLS_PREFIX: "/tools",
  PATH_SEPARATOR: "/",
  DEFAULT_TYPE: "other",
} as const;

