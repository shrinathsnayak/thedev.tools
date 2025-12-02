/**
 * Package.json-related type definitions
 */

export interface PackageJsonConfig {
  name: string;
  version?: string;
  description?: string;
  main?: string;
  types?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  keywords?: string[];
  author?: string;
  license?: string;
  private?: boolean;
  type?: "module" | "commonjs";
}

export interface PackageJsonTemplate {
  name: string;
  description: string;
  config: Partial<PackageJsonConfig>;
}

