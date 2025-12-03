/**
 * Icon mappings for tool categories
 */

import {
  Code,
  Palette,
  Server,
  FileText,
  Search,
  Settings,
  FileCode,
  Video,
  Shield,
  GitBranch,
  Database,
  Network,
  Globe,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  code: Code,
  frontend: Palette,
  backend: Server,
  content: FileText,
  seo: Search,
  utilities: Settings,
  formatters: FileCode,
  multimedia: Video,
  security: Shield,
  workflow: GitBranch,
  database: Database,
  infrastructure: Network,
  api: Globe,
};

export const categoryLabels: Record<string, string> = {
  code: "Code",
  frontend: "Frontend",
  backend: "Backend",
  content: "Content",
  seo: "SEO",
  utilities: "Utilities",
  formatters: "Formatters",
  multimedia: "Multimedia",
  security: "Security",
  workflow: "Workflow",
  database: "Database",
  infrastructure: "Infrastructure",
  api: "API",
};

/**
 * Gets icon for a category
 */
export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcons[category] || Settings;
}

/**
 * Gets label for a category
 */
export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}
