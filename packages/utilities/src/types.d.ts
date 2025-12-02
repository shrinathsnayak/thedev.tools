/**
 * Type declarations for packages without @types
 */

declare module "json-merge-patch" {
  export default function apply(
    target: Record<string, unknown>,
    patch: Record<string, unknown>,
  ): Record<string, unknown>;
}

declare module "json-diff" {
  export function diff(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>,
  ): {
    added?: Record<string, unknown>;
    deleted?: Record<string, unknown>;
    modified?: Record<string, { old: unknown; new: unknown }>;
  };
}

declare module "envfile" {
  export function parse(source: string): Record<string, string>;
  export function stringify(
    object: Record<string, string | number | boolean>,
  ): string;
}

declare module "parse-gitignore" {
  export interface GitignoreGroup {
    comments?: string[];
    patterns?: string[];
    negations?: string[];
    blanks?: string[];
  }

  export interface ParsedGitignore {
    groups: GitignoreGroup[];
  }

  export function parseGitignore(content: string): string[];
  export default function parseGitignore(content: string): string[];
}

declare module "ini" {
  export function parse(str: string): Record<string, unknown>;
  export function stringify(obj: Record<string, unknown>): string;
}
