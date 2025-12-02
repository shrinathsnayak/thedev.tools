/**
 * Git-related type definitions
 */

export type CommitType =
  | "feat"
  | "fix"
  | "docs"
  | "style"
  | "refactor"
  | "perf"
  | "test"
  | "build"
  | "ci"
  | "chore"
  | "revert";

export interface CommitMessage {
  type: CommitType;
  scope?: string;
  subject: string;
  body?: string;
  footer?: string;
  breaking?: boolean;
}

export interface CommitTemplate {
  type: CommitType;
  description: string;
  example: string;
}

