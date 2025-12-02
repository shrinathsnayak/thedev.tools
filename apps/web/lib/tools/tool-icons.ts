/**
 * Icon mappings for tool categories
 */

import {
  IconCode,
  IconPalette,
  IconServer,
  IconFileText,
  IconSearch,
  IconSettings,
  IconFileCode,
  IconVideo,
  IconShield,
  IconGitBranch,
  IconDatabase,
  IconNetwork,
  IconWorld,
} from "@tabler/icons-react";

type TablerIcon = typeof IconCode;

export const categoryIcons: Record<string, TablerIcon> = {
  code: IconCode,
  frontend: IconPalette,
  backend: IconServer,
  content: IconFileText,
  seo: IconSearch,
  utilities: IconSettings,
  formatters: IconFileCode,
  multimedia: IconVideo,
  security: IconShield,
  workflow: IconGitBranch,
  database: IconDatabase,
  infrastructure: IconNetwork,
  api: IconWorld,
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
export function getCategoryIcon(category: string): TablerIcon {
  return categoryIcons[category] || IconSettings;
}

/**
 * Gets label for a category
 */
export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

