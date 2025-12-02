/**
 * Git Command Generator
 * Generates Git commands interactively
 */

export interface GitCommand {
  action: string;
  options?: Record<string, string | boolean>;
  arguments?: string[];
}

/**
 * Generates git clone command with optional branch, depth, and directory
 * @param url - Repository URL to clone
 * @param directory - Optional target directory name
 * @param branch - Optional branch to checkout
 * @param depth - Optional shallow clone depth
 * @returns Complete git clone command string
 */
export function generateGitClone(
  url: string,
  directory?: string,
  branch?: string,
  depth?: number,
): string {
  let cmd = `git clone ${url}`;

  if (branch) {
    cmd += ` -b ${branch}`;
  }

  if (depth) {
    cmd += ` --depth ${depth}`;
  }

  if (directory) {
    cmd += ` ${directory}`;
  }

  return cmd;
}

/**
 * Generates git commit command with message and options
 * @param message - Commit message
 * @param options - Commit options (amend, noVerify, all)
 * @returns Complete git commit command string
 */
export function generateGitCommit(
  message: string,
  options: {
    amend?: boolean;
    noVerify?: boolean;
    all?: boolean;
  } = {},
): string {
  let cmd = "git commit";

  if (options.amend) {
    cmd += " --amend";
  }

  if (options.noVerify) {
    cmd += " --no-verify";
  }

  if (options.all) {
    cmd += " -a";
  }

  cmd += ` -m "${message}"`;

  return cmd;
}

/**
 * Generates git branch command for create, delete, list, or rename operations
 * @param action - Branch action (create, delete, list, rename)
 * @param branchName - Branch name
 * @param options - Branch options (force, remote, newName for rename)
 * @returns Complete git branch command string
 */
export function generateGitBranch(
  action: "create" | "delete" | "list" | "rename",
  branchName: string,
  options: {
    force?: boolean;
    remote?: boolean;
    newName?: string;
  } = {},
): string {
  let cmd = "git branch";

  switch (action) {
    case "create":
      if (options.force) {
        cmd += " -f";
      }
      cmd += ` ${branchName}`;
      break;

    case "delete":
      if (options.force) {
        cmd += " -D";
      } else {
        cmd += " -d";
      }
      cmd += ` ${branchName}`;
      break;

    case "rename":
      if (!options.newName) {
        throw new Error("New branch name required for rename");
      }
      cmd += ` -m ${branchName} ${options.newName}`;
      break;

    case "list":
      if (options.remote) {
        cmd += " -r";
      }
      cmd += " -a"; // All branches
      return cmd;
  }

  return cmd;
}

/**
 * Generates git push command with optional remote, branch, and options
 * @param remote - Optional remote name
 * @param branch - Optional branch name
 * @param options - Push options (force, setUpstream, tags, noVerify)
 * @returns Complete git push command string
 */
export function generateGitPush(
  remote?: string,
  branch?: string,
  options: {
    force?: boolean;
    setUpstream?: boolean;
    tags?: boolean;
    noVerify?: boolean;
  } = {},
): string {
  let cmd = "git push";

  if (options.force) {
    cmd += " --force";
  }

  if (options.setUpstream) {
    cmd += " --set-upstream";
  }

  if (options.tags) {
    cmd += " --tags";
  }

  if (options.noVerify) {
    cmd += " --no-verify";
  }

  if (remote) {
    cmd += ` ${remote}`;
    if (branch) {
      cmd += ` ${branch}`;
    }
  }

  return cmd;
}

/**
 * Generates git pull command with optional remote, branch, and options
 * @param remote - Optional remote name
 * @param branch - Optional branch name
 * @param options - Pull options (rebase, noVerify, noEdit)
 * @returns Complete git pull command string
 */
export function generateGitPull(
  remote?: string,
  branch?: string,
  options: {
    rebase?: boolean;
    noVerify?: boolean;
    noEdit?: boolean;
  } = {},
): string {
  let cmd = "git pull";

  if (options.rebase) {
    cmd += " --rebase";
  }

  if (options.noVerify) {
    cmd += " --no-verify";
  }

  if (options.noEdit) {
    cmd += " --no-edit";
  }

  if (remote) {
    cmd += ` ${remote}`;
    if (branch) {
      cmd += ` ${branch}`;
    }
  }

  return cmd;
}

/**
 * Generates git status command with optional formatting options
 * @param options - Status options (short, branch)
 * @returns Complete git status command string
 */
export function generateGitStatus(
  options: { short?: boolean; branch?: boolean } = {},
): string {
  let cmd = "git status";

  if (options.short) {
    cmd += " --short";
  }

  if (options.branch) {
    cmd += " --branch";
  }

  return cmd;
}

/**
 * Generates git log command with various filtering and formatting options
 * @param options - Log options (oneline, graph, all, pretty, maxCount, since, until, author)
 * @returns Complete git log command string
 */
export function generateGitLog(
  options: {
    oneline?: boolean;
    graph?: boolean;
    all?: boolean;
    pretty?: string;
    maxCount?: number;
    since?: string;
    until?: string;
    author?: string;
  } = {},
): string {
  let cmd = "git log";

  if (options.oneline) {
    cmd += " --oneline";
  }

  if (options.graph) {
    cmd += " --graph";
  }

  if (options.all) {
    cmd += " --all";
  }

  if (options.pretty) {
    cmd += ` --pretty=${options.pretty}`;
  }

  if (options.maxCount) {
    cmd += ` -${options.maxCount}`;
  }

  if (options.since) {
    cmd += ` --since="${options.since}"`;
  }

  if (options.until) {
    cmd += ` --until="${options.until}"`;
  }

  if (options.author) {
    cmd += ` --author="${options.author}"`;
  }

  return cmd;
}

/**
 * Generates git diff command with optional files and options
 * @param file1 - Optional first file to compare
 * @param file2 - Optional second file to compare
 * @param options - Diff options (staged, cached, stat)
 * @returns Complete git diff command string
 */
export function generateGitDiff(
  file1?: string,
  file2?: string,
  options: {
    staged?: boolean;
    cached?: boolean;
    stat?: boolean;
  } = {},
): string {
  let cmd = "git diff";

  if (options.staged || options.cached) {
    cmd += " --staged";
  }

  if (options.stat) {
    cmd += " --stat";
  }

  if (file1) {
    cmd += ` ${file1}`;
    if (file2) {
      cmd += ` ${file2}`;
    }
  }

  return cmd;
}

/**
 * Generates git stash command for various stash operations
 * @param action - Stash action (save, list, pop, apply, drop, clear)
 * @param message - Optional message for save action
 * @param stash - Optional stash reference for pop/apply/drop
 * @returns Complete git stash command string
 */
export function generateGitStash(
  action: "save" | "list" | "pop" | "apply" | "drop" | "clear",
  message?: string,
  stash?: string,
): string {
  let cmd = "git stash";

  switch (action) {
    case "save":
      if (message) {
        cmd += ` "${message}"`;
      } else {
        cmd += " save";
      }
      break;

    case "pop":
      cmd += " pop";
      if (stash) {
        cmd += ` stash@{${stash}}`;
      }
      break;

    case "apply":
      cmd += " apply";
      if (stash) {
        cmd += ` stash@{${stash}}`;
      }
      break;

    case "drop":
      cmd += " drop";
      if (stash) {
        cmd += ` stash@{${stash}}`;
      }
      break;

    case "clear":
      cmd += " clear";
      break;

    case "list":
      cmd += " list";
      break;
  }

  return cmd;
}

/**
 * Generates git tag command for create, delete, or list operations
 * @param action - Tag action (create, delete, list)
 * @param tagName - Tag name
 * @param options - Tag options (message, annotated, force)
 * @returns Complete git tag command string
 */
export function generateGitTag(
  action: "create" | "delete" | "list",
  tagName: string,
  options: {
    message?: string;
    annotated?: boolean;
    force?: boolean;
  } = {},
): string {
  let cmd = "git tag";

  switch (action) {
    case "create":
      if (options.annotated || options.message) {
        cmd += " -a";
      }
      if (options.message) {
        cmd += ` -m "${options.message}"`;
      }
      if (options.force) {
        cmd += " -f";
      }
      cmd += ` ${tagName}`;
      break;

    case "delete":
      cmd += ` -d ${tagName}`;
      break;

    case "list":
      cmd += " -l";
      if (tagName) {
        cmd += ` "${tagName}*"`;
      }
      break;
  }

  return cmd;
}
