/**
 * Shared type definitions for tools
 * Used across web app and formatters package
 */

export type ToolCategory =
  | "code"
  | "frontend"
  | "backend"
  | "content"
  | "seo"
  | "utilities"
  | "formatters"
  | "multimedia"
  | "security"
  | "workflow"
  | "database"
  | "infrastructure"
  | "api";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: string;
  path: string;
  tags?: string[];
  featured?: boolean;
  packages?: string[];
  action?: string;
  displayName?: string;
  typeDisplayName?: string;
  actionDisplayName?: string;
}

