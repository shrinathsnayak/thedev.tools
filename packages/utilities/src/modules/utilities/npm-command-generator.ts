/**
 * NPM command generator utilities
 */

export type NpmCommand =
  | "install"
  | "uninstall"
  | "update"
  | "run"
  | "publish"
  | "init"
  | "version"
  | "test"
  | "build"
  | "start"
  | "link"
  | "unlink"
  | "audit"
  | "outdated"
  | "list";

export interface NpmCommandOptions {
  package?: string | string[];
  global?: boolean;
  saveDev?: boolean;
  saveOptional?: boolean;
  savePeer?: boolean;
  saveExact?: boolean;
  production?: boolean;
  script?: string;
  version?: string;
  tag?: string;
  scope?: string;
  access?: "public" | "restricted";
  registry?: string;
  force?: boolean;
  dryRun?: boolean;
  packageLockOnly?: boolean;
  depth?: number;
  json?: boolean;
  long?: boolean;
  parseable?: boolean;
}

/**
 * Generates npm command string based on command type and options
 * @param command - NPM command type (install, uninstall, update, etc.)
 * @param options - Command-specific options
 * @returns Complete npm command string
 */
export function generateNpmCommand(
  command: NpmCommand,
  options: NpmCommandOptions = {},
): string {
  const parts: string[] = ["npm", command];

  switch (command) {
    case "install":
      return _generateInstallCommand(options);
    case "uninstall":
      return _generateUninstallCommand(options);
    case "update":
      return _generateUpdateCommand(options);
    case "run":
      return _generateRunCommand(options);
    case "publish":
      return _generatePublishCommand(options);
    case "init":
      return _generateInitCommand(options);
    case "version":
      return _generateVersionCommand(options);
    case "test":
      return _generateTestCommand(options);
    case "build":
      return _generateBuildCommand(options);
    case "start":
      return _generateStartCommand(options);
    case "link":
      return _generateLinkCommand(options);
    case "unlink":
      return _generateUnlinkCommand(options);
    case "audit":
      return _generateAuditCommand(options);
    case "outdated":
      return _generateOutdatedCommand(options);
    case "list":
      return _generateListCommand(options);
    default:
      return "npm " + command;
  }
}

/**
 * Generates npm install command
 * @param options - Install command options
 * @returns npm install command string
 */
function _generateInstallCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm install"];

  if (options.package) {
    const packages = Array.isArray(options.package)
      ? options.package
      : [options.package];
    parts.push(packages.join(" "));
  }

  if (options.global) {
    parts.push("-g");
  }
  if (options.saveDev) {
    parts.push("--save-dev");
  }
  if (options.saveOptional) {
    parts.push("--save-optional");
  }
  if (options.savePeer) {
    parts.push("--save-peer");
  }
  if (options.saveExact) {
    parts.push("--save-exact");
  }
  if (options.production) {
    parts.push("--production");
  }
  if (options.force) {
    parts.push("--force");
  }
  if (options.dryRun) {
    parts.push("--dry-run");
  }
  if (options.packageLockOnly) {
    parts.push("--package-lock-only");
  }

  return parts.join(" ");
}

/**
 * Generates npm uninstall command
 * @param options - Uninstall command options
 * @returns npm uninstall command string
 */
function _generateUninstallCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm uninstall"];

  if (options.package) {
    const packages = Array.isArray(options.package)
      ? options.package
      : [options.package];
    parts.push(packages.join(" "));
  }

  if (options.global) {
    parts.push("-g");
  }
  if (options.saveDev) {
    parts.push("--save-dev");
  }

  return parts.join(" ");
}

/**
 * Generates npm update command
 * @param options - Update command options
 * @returns npm update command string
 */
function _generateUpdateCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm update"];

  if (options.package) {
    const packages = Array.isArray(options.package)
      ? options.package
      : [options.package];
    parts.push(packages.join(" "));
  }

  if (options.global) {
    parts.push("-g");
  }
  if (options.saveDev) {
    parts.push("--save-dev");
  }

  return parts.join(" ");
}

/**
 * Generates npm run command
 * @param options - Run command options
 * @returns npm run command string
 */
function _generateRunCommand(options: NpmCommandOptions): string {
  if (!options.script) {
    return "npm run <script>";
  }
  return `npm run ${options.script}`;
}

/**
 * Generates npm publish command
 * @param options - Publish command options
 * @returns npm publish command string
 */
function _generatePublishCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm publish"];

  if (options.tag) {
    parts.push(`--tag ${options.tag}`);
  }
  if (options.access) {
    parts.push(`--access ${options.access}`);
  }
  if (options.registry) {
    parts.push(`--registry ${options.registry}`);
  }
  if (options.dryRun) {
    parts.push("--dry-run");
  }

  return parts.join(" ");
}

/**
 * Generates npm init command
 * @param options - Init command options
 * @returns npm init command string
 */
function _generateInitCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm init"];

  if (options.scope) {
    parts.push(`--scope=${options.scope}`);
  }

  return parts.join(" ");
}

/**
 * Generates npm version command
 * @param options - Version command options
 * @returns npm version command string
 */
function _generateVersionCommand(options: NpmCommandOptions): string {
  if (!options.version) {
    return "npm version <version>";
  }
  return `npm version ${options.version}`;
}

/**
 * Generates npm test command
 * @param _options - Test command options (unused)
 * @returns npm test command string
 */
function _generateTestCommand(_options: NpmCommandOptions): string {
  return "npm test";
}

/**
 * Generates npm run build command
 * @param _options - Build command options (unused)
 * @returns npm run build command string
 */
function _generateBuildCommand(_options: NpmCommandOptions): string {
  return "npm run build";
}

/**
 * Generates npm start command
 * @param _options - Start command options (unused)
 * @returns npm start command string
 */
function _generateStartCommand(_options: NpmCommandOptions): string {
  return "npm start";
}

/**
 * Generates npm link command
 * @param options - Link command options
 * @returns npm link command string
 */
function _generateLinkCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm link"];

  if (options.package) {
    const packages = Array.isArray(options.package)
      ? options.package[0]
      : options.package;
    if (packages) {
      parts.push(packages);
    }
  }

  return parts.join(" ");
}

/**
 * Generates npm unlink command
 * @param options - Unlink command options
 * @returns npm unlink command string
 */
function _generateUnlinkCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm unlink"];

  if (options.package) {
    const packages = Array.isArray(options.package)
      ? options.package[0]
      : options.package;
    if (packages) {
      parts.push(packages);
    }
  }

  return parts.join(" ");
}

/**
 * Generates npm audit command
 * @param options - Audit command options
 * @returns npm audit command string
 */
function _generateAuditCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm audit"];

  if (options.json) {
    parts.push("--json");
  }

  return parts.join(" ");
}

/**
 * Generates npm outdated command
 * @param options - Outdated command options
 * @returns npm outdated command string
 */
function _generateOutdatedCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm outdated"];

  if (options.json) {
    parts.push("--json");
  }
  if (options.long) {
    parts.push("--long");
  }
  if (options.parseable) {
    parts.push("--parseable");
  }
  if (options.depth !== undefined) {
    parts.push(`--depth ${options.depth}`);
  }

  return parts.join(" ");
}

/**
 * Generates npm list command
 * @param options - List command options
 * @returns npm list command string
 */
function _generateListCommand(options: NpmCommandOptions): string {
  const parts: string[] = ["npm list"];

  if (options.global) {
    parts.push("-g");
  }
  if (options.depth !== undefined) {
    parts.push(`--depth ${options.depth}`);
  }
  if (options.json) {
    parts.push("--json");
  }
  if (options.long) {
    parts.push("--long");
  }

  return parts.join(" ");
}

/**
 * Gets array of common npm commands with descriptions
 * @returns Array of command objects with command string and description
 */
export function getCommonNpmCommands(): Array<{
  command: string;
  description: string;
}> {
  return [
    { command: "npm install", description: "Install all dependencies" },
    { command: "npm install package-name", description: "Install a package" },
    { command: "npm install -g package-name", description: "Install globally" },
    {
      command: "npm install --save-dev package-name",
      description: "Install as dev dependency",
    },
    {
      command: "npm uninstall package-name",
      description: "Uninstall a package",
    },
    { command: "npm update", description: "Update all packages" },
    { command: "npm run script-name", description: "Run a script" },
    { command: "npm test", description: "Run tests" },
    { command: "npm start", description: "Start the application" },
    { command: "npm build", description: "Build the project" },
    { command: "npm publish", description: "Publish to npm registry" },
    { command: "npm init", description: "Initialize a new package" },
    { command: "npm audit", description: "Audit for vulnerabilities" },
    { command: "npm outdated", description: "Check for outdated packages" },
    { command: "npm list", description: "List installed packages" },
  ];
}
