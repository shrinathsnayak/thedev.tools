/**
 * Git-related constants
 */

import type { CommitType, CommitTemplate } from "@workspace/types/git";

/**
 * Conventional commit types
 */
export const COMMIT_TYPES: Record<CommitType, CommitTemplate> = {
  feat: {
    type: "feat",
    description: "A new feature",
    example: "feat: add user authentication",
  },
  fix: {
    type: "fix",
    description: "A bug fix",
    example: "fix: resolve login redirect issue",
  },
  docs: {
    type: "docs",
    description: "Documentation only changes",
    example: "docs: update API documentation",
  },
  style: {
    type: "style",
    description: "Code style changes (formatting, missing semicolons, etc.)",
    example: "style: format code with prettier",
  },
  refactor: {
    type: "refactor",
    description: "Code refactoring without bug fixes or features",
    example: "refactor: restructure authentication module",
  },
  perf: {
    type: "perf",
    description: "Performance improvements",
    example: "perf: optimize database queries",
  },
  test: {
    type: "test",
    description: "Adding or updating tests",
    example: "test: add unit tests for user service",
  },
  build: {
    type: "build",
    description: "Build system or external dependencies changes",
    example: "build: update webpack configuration",
  },
  ci: {
    type: "ci",
    description: "CI/CD configuration changes",
    example: "ci: add GitHub Actions workflow",
  },
  chore: {
    type: "chore",
    description: "Other changes that don't modify src or test files",
    example: "chore: update dependencies",
  },
  revert: {
    type: "revert",
    description: "Reverts a previous commit",
    example: "revert: revert user authentication feature",
  },
};

