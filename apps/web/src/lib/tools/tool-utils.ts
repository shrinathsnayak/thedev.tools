/**
 * Utility functions for tools navigation and organization
 */

import { groupedTools, tools } from "./tools";
import type { Tool, ToolCategory } from "@workspace/types/tools";
import { TOOL_CATEGORIES, PATH_CONSTANTS } from "@workspace/constants/tools";

/**
 * Groups tools by category, then by type (e.g., html, css, js)
 */
export function getAllToolsByCategoryAndType(): Record<
  ToolCategory,
  Record<string, Tool[]>
> {
  // Initialize result with all categories
  const result = TOOL_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = {};
      return acc;
    },
    {} as Record<ToolCategory, Record<string, Tool[]>>,
  );

  for (const tool of tools) {
    if (!result[tool.category]) {
      result[tool.category] = {};
    }

    // Extract type from path (e.g., /tools/code/html/minify -> html)
    const pathParts = tool.path
      .split(PATH_CONSTANTS.PATH_SEPARATOR)
      .filter(Boolean);
    const typeIndex = pathParts.indexOf("tools");
    const type = pathParts[typeIndex + 2] || PATH_CONSTANTS.DEFAULT_TYPE; // category, type, action

    if (!result[tool.category]![type]) {
      result[tool.category]![type] = [];
    }

    result[tool.category]![type]!.push(tool);
  }

  return result;
}

/**
 * Gets tools for a specific category
 */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return groupedTools[category] || [];
}

/**
 * Gets tools for a category and type (e.g., code/html)
 */
export function getToolsByCategoryAndType(
  category: ToolCategory,
  type: string,
): Tool[] {
  const allTools = getAllToolsByCategoryAndType();
  return allTools[category]?.[type] || [];
}

/**
 * Extracts category from path
 */
export function extractCategoryFromPath(path: string): ToolCategory | null {
  const match = path.match(/\/tools\/([^\/]+)/);
  if (match && match[1]) {
    const category = match[1] as ToolCategory;
    if (Object.keys(groupedTools).includes(category)) {
      return category;
    }
  }
  return null;
}

/**
 * Extracts type from path (e.g., html, css, js)
 */
export function extractTypeFromPath(path: string): string | null {
  const match = path.match(/\/tools\/[^\/]+\/([^\/]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Extracts action from path (e.g., minify, beautify, validate)
 */
export function extractActionFromPath(path: string): string | null {
  const match = path.match(/\/tools\/[^\/]+\/[^\/]+\/([^\/]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Parses tool path into parts
 */
export function parseToolPath(path: string): {
  category: ToolCategory | null;
  type: string | null;
  action: string | null;
} {
  return {
    category: extractCategoryFromPath(path),
    type: extractTypeFromPath(path),
    action: extractActionFromPath(path),
  };
}

/**
 * Gets all unique types in a category
 */
export function getTypesInCategory(category: ToolCategory): string[] {
  const toolsByType = getAllToolsByCategoryAndType();
  const types = Object.keys(toolsByType[category] || {});
  return types.sort();
}

/**
 * Gets category path
 */
export function getCategoryPath(category: ToolCategory): string {
  return `${PATH_CONSTANTS.TOOLS_PREFIX}/${category}`;
}

/**
 * Gets type path within category
 */
export function getTypePath(category: ToolCategory, type: string): string {
  return `${PATH_CONSTANTS.TOOLS_PREFIX}/${category}/${type}`;
}
