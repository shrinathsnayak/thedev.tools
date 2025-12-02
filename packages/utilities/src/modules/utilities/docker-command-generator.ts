/**
 * Docker Command Generator
 * Generates Docker commands interactively
 */

export interface DockerCommand {
  command: string;
  options?: Record<string, string | boolean>;
  arguments?: string[];
}

/**
 * Generates docker run command with image, options, and optional command
 * @param image - Docker image name
 * @param options - Run options (name, detach, interactive, tty, ports, volumes, env, restart, network, rm)
 * @param command - Optional command to run in container
 * @returns Complete docker run command string
 */
export function generateDockerRun(
  image: string,
  options: {
    name?: string;
    detach?: boolean;
    interactive?: boolean;
    tty?: boolean;
    ports?: Array<{ host: string; container: string }>;
    volumes?: Array<{ host: string; container: string }>;
    env?: Record<string, string>;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
    network?: string;
    rm?: boolean;
  } = {},
  command?: string,
): string {
  let cmd = "docker run";

  if (options.detach) {
    cmd += " -d";
  }

  if (options.interactive) {
    cmd += " -i";
  }

  if (options.tty) {
    cmd += " -t";
  }

  if (options.rm) {
    cmd += " --rm";
  }

  if (options.name) {
    cmd += ` --name ${options.name}`;
  }

  if (options.restart) {
    cmd += ` --restart ${options.restart}`;
  }

  if (options.network) {
    cmd += ` --network ${options.network}`;
  }

  if (options.ports) {
    for (const port of options.ports) {
      cmd += ` -p ${port.host}:${port.container}`;
    }
  }

  if (options.volumes) {
    for (const volume of options.volumes) {
      cmd += ` -v ${volume.host}:${volume.container}`;
    }
  }

  if (options.env) {
    for (const [key, value] of Object.entries(options.env)) {
      cmd += ` -e ${key}=${value}`;
    }
  }

  cmd += ` ${image}`;

  if (command) {
    cmd += ` ${command}`;
  }

  return cmd;
}

/**
 * Generates docker build command with path and build options
 * @param path - Build context path (default: ".")
 * @param options - Build options (tag, file, target, noCache, pull, buildArg)
 * @returns Complete docker build command string
 */
export function generateDockerBuild(
  path: string = ".",
  options: {
    tag?: string;
    file?: string;
    target?: string;
    noCache?: boolean;
    pull?: boolean;
    buildArg?: Record<string, string>;
  } = {},
): string {
  let cmd = "docker build";

  if (options.tag) {
    cmd += ` -t ${options.tag}`;
  }

  if (options.file) {
    cmd += ` -f ${options.file}`;
  }

  if (options.target) {
    cmd += ` --target ${options.target}`;
  }

  if (options.noCache) {
    cmd += " --no-cache";
  }

  if (options.pull) {
    cmd += " --pull";
  }

  if (options.buildArg) {
    for (const [key, value] of Object.entries(options.buildArg)) {
      cmd += ` --build-arg ${key}=${value}`;
    }
  }

  cmd += ` ${path}`;

  return cmd;
}

/**
 * Generates docker ps command to list containers
 * @param options - PS options (all, filter)
 * @returns Complete docker ps command string
 */
export function generateDockerPs(
  options: { all?: boolean; filter?: string } = {},
): string {
  let cmd = "docker ps";

  if (options.all) {
    cmd += " -a";
  }

  if (options.filter) {
    cmd += ` --filter "${options.filter}"`;
  }

  return cmd;
}

/**
 * Generates docker stop command to stop a container
 * @param container - Container name or ID
 * @param time - Optional timeout in seconds before force killing
 * @returns Complete docker stop command string
 */
export function generateDockerStop(container: string, time?: number): string {
  let cmd = "docker stop";

  if (time) {
    cmd += ` -t ${time}`;
  }

  cmd += ` ${container}`;

  return cmd;
}

/**
 * Generates docker start command to start a container
 * @param container - Container name or ID
 * @param attach - Whether to attach to container output
 * @returns Complete docker start command string
 */
export function generateDockerStart(
  container: string,
  attach?: boolean,
): string {
  let cmd = "docker start";

  if (attach) {
    cmd += " -a";
  }

  cmd += ` ${container}`;

  return cmd;
}

/**
 * Generates docker exec command to execute a command in a running container
 * @param container - Container name or ID
 * @param command - Command to execute
 * @param options - Exec options (interactive, tty, detach, user, workdir, env)
 * @returns Complete docker exec command string
 */
export function generateDockerExec(
  container: string,
  command: string,
  options: {
    interactive?: boolean;
    tty?: boolean;
    detach?: boolean;
    user?: string;
    workdir?: string;
    env?: Record<string, string>;
  } = {},
): string {
  let cmd = "docker exec";

  if (options.interactive) {
    cmd += " -i";
  }

  if (options.tty) {
    cmd += " -t";
  }

  if (options.detach) {
    cmd += " -d";
  }

  if (options.user) {
    cmd += ` -u ${options.user}`;
  }

  if (options.workdir) {
    cmd += ` -w ${options.workdir}`;
  }

  if (options.env) {
    for (const [key, value] of Object.entries(options.env)) {
      cmd += ` -e ${key}=${value}`;
    }
  }

  cmd += ` ${container} ${command}`;

  return cmd;
}

/**
 * Generates docker logs command to view container logs
 * @param container - Container name or ID
 * @param options - Logs options (follow, tail, since, until, timestamps)
 * @returns Complete docker logs command string
 */
export function generateDockerLogs(
  container: string,
  options: {
    follow?: boolean;
    tail?: number;
    since?: string;
    until?: string;
    timestamps?: boolean;
  } = {},
): string {
  let cmd = "docker logs";

  if (options.follow) {
    cmd += " -f";
  }

  if (options.tail) {
    cmd += ` --tail ${options.tail}`;
  }

  if (options.since) {
    cmd += ` --since ${options.since}`;
  }

  if (options.until) {
    cmd += ` --until ${options.until}`;
  }

  if (options.timestamps) {
    cmd += " -t";
  }

  cmd += ` ${container}`;

  return cmd;
}

/**
 * Generates docker-compose command for various compose operations
 * @param action - Compose action (up, down, build, start, stop, restart, ps, logs)
 * @param options - Compose options (detach, build, services, file)
 * @returns Complete docker-compose command string
 */
export function generateDockerCompose(
  action:
    | "up"
    | "down"
    | "build"
    | "start"
    | "stop"
    | "restart"
    | "ps"
    | "logs",
  options: {
    detach?: boolean;
    build?: boolean;
    services?: string[];
    file?: string;
  } = {},
): string {
  let cmd = "docker-compose";

  if (options.file) {
    cmd += ` -f ${options.file}`;
  }

  cmd += ` ${action}`;

  if (options.detach && (action === "up" || action === "start")) {
    cmd += " -d";
  }

  if (options.build && (action === "up" || action === "build")) {
    cmd += " --build";
  }

  if (options.services && options.services.length > 0) {
    cmd += ` ${options.services.join(" ")}`;
  }

  return cmd;
}

/**
 * Generates docker network command for network management operations
 * @param action - Network action (create, ls, rm, inspect)
 * @param network - Network name
 * @param options - Network options (driver, subnet, gateway)
 * @returns Complete docker network command string
 */
export function generateDockerNetwork(
  action: "create" | "ls" | "rm" | "inspect",
  network: string,
  options: {
    driver?: string;
    subnet?: string;
    gateway?: string;
  } = {},
): string {
  let cmd = "docker network";

  switch (action) {
    case "create":
      if (options.driver) {
        cmd += ` --driver ${options.driver}`;
      }
      if (options.subnet) {
        cmd += ` --subnet ${options.subnet}`;
      }
      if (options.gateway) {
        cmd += ` --gateway ${options.gateway}`;
      }
      cmd += ` ${network}`;
      break;

    case "ls":
      cmd += " ls";
      break;

    case "rm":
      cmd += ` rm ${network}`;
      break;

    case "inspect":
      cmd += ` inspect ${network}`;
      break;
  }

  return cmd;
}
