/**
 * Package.json Generator
 * Generates package.json files with common configurations
 */

import type { PackageJsonConfig, PackageJsonTemplate } from "@workspace/types/package";
import { PACKAGE_TEMPLATES } from "@workspace/constants/package";

// Re-export for backward compatibility
export type { PackageJsonConfig, PackageJsonTemplate } from "@workspace/types/package";
export { PACKAGE_TEMPLATES } from "@workspace/constants/package";

/**
 * Generates package.json content
 */
export function generatePackageJson(config: PackageJsonConfig): string {
  const packageJson: Record<string, unknown> = {
    name: config.name || "my-package",
    version: config.version || "1.0.0",
    description: config.description || "",
    main: config.main || "index.js",
    type: config.type || "commonjs",
    scripts: config.scripts || {},
    dependencies: config.dependencies || {},
    devDependencies: config.devDependencies || {},
    keywords: config.keywords || [],
    author: config.author || "",
    license: config.license || "MIT",
  };

  if (config.private !== undefined) {
    packageJson.private = config.private;
  }

  // Remove empty arrays/objects
  if (packageJson.keywords && (packageJson.keywords as string[]).length === 0) {
    delete packageJson.keywords;
  }
  if (
    packageJson.dependencies &&
    Object.keys(packageJson.dependencies).length === 0
  ) {
    delete packageJson.dependencies;
  }
  if (
    packageJson.devDependencies &&
    Object.keys(packageJson.devDependencies).length === 0
  ) {
    delete packageJson.devDependencies;
  }

  return JSON.stringify(packageJson, null, 2);
}

/**
 * Gets template by name
 */
export function getPackageTemplate(name: string): PackageJsonTemplate | null {
  return PACKAGE_TEMPLATES[name] || null;
}

/**
 * Gets all available templates
 */
export function getAllPackageTemplates(): PackageJsonTemplate[] {
  return Object.values(PACKAGE_TEMPLATES);
}

/**
 * Merges template with custom config
 */
export function mergePackageConfig(
  templateName: string,
  customConfig: Partial<PackageJsonConfig>,
): PackageJsonConfig {
  const template = getPackageTemplate(templateName);
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  return {
    ...template.config,
    ...customConfig,
    scripts: { ...template.config.scripts, ...customConfig.scripts },
    dependencies: {
      ...template.config.dependencies,
      ...customConfig.dependencies,
    },
    devDependencies: {
      ...template.config.devDependencies,
      ...customConfig.devDependencies,
    },
    keywords: [
      ...(template.config.keywords || []),
      ...(customConfig.keywords || []),
    ],
  } as PackageJsonConfig & { types?: string };
}
