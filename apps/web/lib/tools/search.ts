/**
 * Search functionality for tools
 * Uses fuse.js for fuzzy search
 */

import Fuse from "fuse.js";
import { tools } from "./tools";
import type { Tool } from "@workspace/types/tools";
import { FUSE_SEARCH_CONFIG, MIN_SEARCH_QUERY_LENGTH } from "@workspace/constants/tools";

// Fix: Spread the readonly keys array to satisfy Fuse's mutable array requirement
const fuse = new Fuse(
  tools,
  {
    ...FUSE_SEARCH_CONFIG,
    keys: [...FUSE_SEARCH_CONFIG.keys],
  }
);

/**
 * Searches tools with fuzzy matching
 */
export function searchTools(query: string): Tool[] {
  if (!query || query.trim().length < MIN_SEARCH_QUERY_LENGTH) {
    return [];
  }

  const results = fuse.search(query);
  return results.map((result) => result.item);
}

/**
 * Searches tools and returns results with score
 */
export function searchToolsWithScore(query: string): Array<{
  tool: Tool;
  score: number;
}> {
  if (!query || query.trim().length < MIN_SEARCH_QUERY_LENGTH) {
    return [];
  }

  const results = fuse.search(query);
  return results.map((result) => ({
    tool: result.item,
    score: result.score ?? 1,
  }));
}

/**
 * Gets featured tools
 */
export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured);
}

/**
 * Gets tools by tag
 */
export function getToolsByTag(tag: string): Tool[] {
  return tools.filter(
    (tool) => tool.tags?.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
  );
}

