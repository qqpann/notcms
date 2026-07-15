import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { confirm } from "@inquirer/prompts";
import { inspectNotcmsDependency } from "./dependency-resolution.js";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export type DependencySetupResult =
  | { status: "already-installed" }
  | {
      status: "installed";
      packageManager: PackageManager;
      command: string;
    }
  | {
      status: "manual";
      reason: "declined" | "failed" | "non-interactive";
      packageManager: PackageManager;
      command: string;
      error?: string;
      verificationRequired?: "target-pnp";
    }
  | {
      status: "manual";
      reason: "ambiguous-lockfiles" | "invalid-package-manager";
      error: string;
    };

export type PackageManagerDetection =
  | {
      status: "detected";
      packageManager: PackageManager;
      packageManagerMajor?: number;
    }
  | {
      status: "manual";
      reason: "ambiguous-lockfiles" | "invalid-package-manager";
      error: string;
    };

type DetectPackageManagerOptions = {
  cwd?: string;
  userAgent?: string;
};

type EnsureNotcmsDependencyOptions = DetectPackageManagerOptions & {
  interactive?: boolean;
};

type PackageManagerDetectionContext = {
  detection: PackageManagerDetection;
  projectDirectory?: string;
};

type PackageManagerInvocation = {
  executable: string;
  args: string[];
  windowsVerbatimArguments?: true;
};

const LOCKFILES: ReadonlyArray<
  readonly [filename: string, packageManager: PackageManager]
> = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["package-lock.json", "npm"],
  ["npm-shrinkwrap.json", "npm"],
];

const ADD_ARGS: Record<PackageManager, readonly string[]> = {
  pnpm: ["add", "notcms"],
  npm: ["install", "notcms"],
  yarn: ["add", "notcms"],
  bun: ["add", "notcms"],
};

/**
 * Detect the package manager without ever treating project-controlled text as
 * an executable. The nearest directory containing a packageManager field or
 * lockfile defines the project boundary. Within that directory an explicit
 * packageManager wins, then the invoking package manager's user agent helps
 * disambiguate lockfiles, with npm as the portable final default.
 */
export function detectPackageManager(
  options: DetectPackageManagerOptions = {}
): PackageManagerDetection {
  return detectPackageManagerContext(options).detection;
}

function detectPackageManagerContext(
  options: DetectPackageManagerOptions = {}
): PackageManagerDetectionContext {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const directories = ancestorDirectories(cwd);
  const userAgent =
    options.userAgent ?? process.env.npm_config_user_agent ?? "";
  const userAgentManager = parseUserAgent(userAgent);

  for (const directory of directories) {
    const packageManagerField = readPackageManagerField(directory);
    if (packageManagerField.status === "valid") {
      return {
        detection: {
          status: "detected",
          packageManager: packageManagerField.packageManager,
          ...(packageManagerField.packageManager !== "yarn" ||
          packageManagerField.packageManagerMajor === undefined
            ? {}
            : { packageManagerMajor: packageManagerField.packageManagerMajor }),
        },
        projectDirectory: directory,
      };
    }
    if (packageManagerField.status === "invalid") {
      return {
        detection: {
          status: "manual",
          reason: "invalid-package-manager",
          error: `The packageManager field in ${packageManagerField.manifestPath} is invalid or unsupported. Use pnpm, npm, yarn, or bun.`,
        },
        projectDirectory: directory,
      };
    }
    const packageManagers = lockfilePackageManagers(directory);
    if (packageManagers.length === 0) {
      continue;
    }
    if (userAgentManager && packageManagers.includes(userAgentManager)) {
      const packageManagerMajor =
        userAgentManager === "yarn"
          ? parseUserAgentMajor(userAgent)
          : undefined;
      return {
        detection: {
          status: "detected",
          packageManager: userAgentManager,
          ...(packageManagerMajor === undefined ? {} : { packageManagerMajor }),
        },
        projectDirectory: directory,
      };
    }
    if (packageManagers.length > 1) {
      return {
        detection: {
          status: "manual",
          reason: "ambiguous-lockfiles",
          error: `Multiple package-manager lockfiles were found in ${directory}: ${packageManagers.join(", ")}. Remove stale lockfiles or set a valid packageManager field.`,
        },
        projectDirectory: directory,
      };
    }
    const packageManager = packageManagers[0];
    const packageManagerMajor =
      packageManager === "yarn"
        ? inferYarnMajorFromProject(directory)
        : undefined;
    return {
      detection: {
        status: "detected",
        packageManager,
        ...(packageManagerMajor === undefined ? {} : { packageManagerMajor }),
      },
      projectDirectory: directory,
    };
  }

  const packageManagerMajor =
    userAgentManager === "yarn" ? parseUserAgentMajor(userAgent) : undefined;
  return {
    detection: {
      status: "detected",
      packageManager: userAgentManager ?? "npm",
      ...(packageManagerMajor === undefined ? {} : { packageManagerMajor }),
    },
  };
}

/**
 * Ensure generated schema modules can resolve their public `notcms` import.
 * Installation is offered only in an interactive terminal; all other outcomes
 * are returned so the caller can finish schema generation and print one final
 * manual command when needed.
 */
export async function ensureNotcmsDependency(
  options: EnsureNotcmsDependencyOptions = {}
): Promise<DependencySetupResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const safeDependency = inspectNotcmsDependency(cwd);
  if (safeDependency.declared && safeDependency.resolved) {
    return { status: "already-installed" };
  }

  const detectionContext = detectPackageManagerContext({
    cwd,
    userAgent: options.userAgent,
  });
  const { detection } = detectionContext;
  if (detection.status === "manual") {
    return detection;
  }

  const packageManager = detection.packageManager;
  const targetPnpPath =
    packageManager === "yarn" && detectionContext.projectDirectory
      ? existingTargetPnpPath(detectionContext.projectDirectory)
      : undefined;
  const dependency = targetPnpPath
    ? inspectNotcmsDependency(cwd, { targetPnpPath })
    : safeDependency;

  if (
    !dependency.declared &&
    packageManager === "yarn" &&
    isYarnWorkspaceRoot(cwd) &&
    detection.packageManagerMajor === undefined
  ) {
    return {
      status: "manual",
      reason: "invalid-package-manager",
      error:
        "NotCMS could not determine whether this Yarn workspace uses Yarn Classic or Yarn Berry. Set packageManager to yarn@<version> in package.json, then run init again.",
    };
  }
  const args = dependency.declared
    ? ["install"]
    : addDependencyArgs(packageManager, cwd, detection.packageManagerMajor);
  const command = [packageManager, ...args].join(" ");
  const interactive = options.interactive ?? isInteractiveTerminal();

  if (!interactive) {
    return {
      status: "manual",
      reason: "non-interactive",
      packageManager,
      command,
      ...(dependency.verificationRequired
        ? { verificationRequired: dependency.verificationRequired }
        : {}),
    };
  }

  const message = dependency.declared
    ? dependency.verificationRequired === "target-pnp"
      ? `The notcms dependency is declared in a Yarn PnP project, but its resolution has not been verified. Run "${command}" now, then verify it?`
      : `The notcms dependency is declared but not installed. Run "${command}" now?`
    : dependency.verificationRequired === "target-pnp"
      ? `The notcms package is not a direct project dependency. Run "${command}" now, then verify the Yarn PnP resolution?`
      : `The notcms package is not a direct project dependency. Run "${command}" now?`;
  const accepted = await confirm({
    message,
    default: true,
  });
  if (!accepted) {
    return {
      status: "manual",
      reason: "declined",
      packageManager,
      command,
      ...(dependency.verificationRequired
        ? { verificationRequired: dependency.verificationRequired }
        : {}),
    };
  }

  try {
    await runInstall(packageManager, args, cwd);
  } catch (error) {
    return {
      status: "manual",
      reason: "failed",
      packageManager,
      command,
      error: error instanceof Error ? error.message : String(error),
      ...(dependency.verificationRequired
        ? { verificationRequired: dependency.verificationRequired }
        : {}),
    };
  }

  const installedDetectionContext = detectPackageManagerContext({
    cwd,
    userAgent: options.userAgent,
  });
  const installedDetection = installedDetectionContext.detection;
  const installedTargetPnpPath =
    packageManager === "yarn" &&
    installedDetection.status === "detected" &&
    installedDetection.packageManager === "yarn" &&
    installedDetectionContext.projectDirectory
      ? existingTargetPnpPath(installedDetectionContext.projectDirectory)
      : undefined;
  const installedDependency = inspectNotcmsDependency(cwd, {
    ...(installedTargetPnpPath
      ? {
          evaluateTargetPnp: true,
          targetPnpPath: installedTargetPnpPath,
        }
      : {}),
  });
  if (!installedDependency.declared || !installedDependency.resolved) {
    return {
      status: "manual",
      reason: "failed",
      packageManager,
      command,
      error: `${command} exited successfully, but notcms is still not a direct, resolvable project dependency.`,
    };
  }
  return { status: "installed", packageManager, command };
}

function existingTargetPnpPath(projectDirectory: string): string | undefined {
  const pnpPath = path.join(projectDirectory, ".pnp.cjs");
  return existsSync(pnpPath) ? pnpPath : undefined;
}

function ancestorDirectories(start: string): string[] {
  const directories: string[] = [];
  let directory = start;
  while (true) {
    directories.push(directory);
    const parent = path.dirname(directory);
    if (parent === directory) {
      return directories;
    }
    directory = parent;
  }
}

type PackageManagerField =
  | { status: "absent" }
  | {
      status: "valid";
      packageManager: PackageManager;
      packageManagerMajor?: number;
    }
  | { status: "invalid"; manifestPath: string };

function readPackageManagerField(directory: string): PackageManagerField {
  const manifestPath = path.join(directory, "package.json");
  try {
    const parsed: unknown = JSON.parse(readFileSync(manifestPath, "utf-8"));
    if (
      !isRecord(parsed) ||
      !Object.prototype.hasOwnProperty.call(parsed, "packageManager")
    ) {
      return { status: "absent" };
    }
    if (typeof parsed.packageManager !== "string") {
      return { status: "invalid", manifestPath };
    }
    const packageManagerSpec = parsePackageManager(parsed.packageManager);
    return packageManagerSpec
      ? { status: "valid", ...packageManagerSpec }
      : { status: "invalid", manifestPath };
  } catch {
    return { status: "absent" };
  }
}

function lockfilePackageManagers(directory: string): PackageManager[] {
  const packageManagers: PackageManager[] = [];
  for (const [filename, packageManager] of LOCKFILES) {
    if (
      existsSync(path.join(directory, filename)) &&
      !packageManagers.includes(packageManager)
    ) {
      packageManagers.push(packageManager);
    }
  }
  return packageManagers;
}

function parsePackageManager(value: string): {
  packageManager: PackageManager;
  packageManagerMajor?: number;
} | null {
  const match = /^(pnpm|npm|yarn|bun)(?:@([0-9A-Za-z][0-9A-Za-z.+_-]*))?$/.exec(
    value.trim()
  );
  const packageManager = match ? packageManagerFromName(match[1]) : null;
  if (!packageManager) {
    return null;
  }
  const packageManagerMajor = match?.[2]
    ? parseLeadingMajor(match[2])
    : undefined;
  return {
    packageManager,
    ...(packageManagerMajor === undefined ? {} : { packageManagerMajor }),
  };
}

function parseUserAgent(userAgent: string): PackageManager | null {
  const match = /^(pnpm|npm|yarn|bun)\//.exec(userAgent.trim());
  return match ? packageManagerFromName(match[1]) : null;
}

function parseUserAgentMajor(userAgent: string): number | undefined {
  const match = /^(?:pnpm|npm|yarn|bun)\/([^\s]+)/.exec(userAgent.trim());
  return match ? parseLeadingMajor(match[1]) : undefined;
}

function parseLeadingMajor(value: string): number | undefined {
  const match = /^(\d+)/.exec(value);
  if (!match) {
    return undefined;
  }
  const major = Number(match[1]);
  return Number.isSafeInteger(major) ? major : undefined;
}

function inferYarnMajorFromProject(directory: string): number | undefined {
  if (existsSync(path.join(directory, ".yarnrc.yml"))) {
    return 2;
  }
  try {
    const lockfile = readFileSync(path.join(directory, "yarn.lock"), "utf-8");
    if (/^# yarn lockfile v1\s*$/m.test(lockfile)) {
      return 1;
    }
    if (/^__metadata:\s*$/m.test(lockfile)) {
      return 2;
    }
  } catch {
    // A missing or unreadable lockfile leaves the Yarn generation unknown.
  }
  return undefined;
}

function packageManagerFromName(value: string): PackageManager | null {
  switch (value) {
    case "pnpm":
    case "npm":
    case "yarn":
    case "bun":
      return value;
    default:
      return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInteractiveTerminal(): boolean {
  const ci = process.env.CI?.trim().toLowerCase();
  const isCi = ci !== undefined && ci !== "" && ci !== "false" && ci !== "0";
  return !isCi && process.stdin.isTTY === true && process.stdout.isTTY === true;
}

function addDependencyArgs(
  packageManager: PackageManager,
  cwd: string,
  packageManagerMajor: number | undefined
): readonly string[] {
  if (
    packageManager === "pnpm" &&
    existsSync(path.join(cwd, "pnpm-workspace.yaml"))
  ) {
    return ["add", "-w", "notcms"];
  }
  if (
    packageManager === "yarn" &&
    packageManagerMajor === 1 &&
    isYarnWorkspaceRoot(cwd)
  ) {
    return ["add", "-W", "notcms"];
  }
  return ADD_ARGS[packageManager];
}

function isYarnWorkspaceRoot(cwd: string): boolean {
  try {
    const manifest: unknown = JSON.parse(
      readFileSync(path.join(cwd, "package.json"), "utf-8")
    );
    return (
      isRecord(manifest) &&
      Object.prototype.hasOwnProperty.call(manifest, "workspaces")
    );
  } catch {
    return false;
  }
}

/**
 * Build the child-process invocation without enabling Node's shell mode.
 * Windows command shims still require cmd.exe, so only fixed, validated tokens
 * are placed into its command string and passed with verbatim argument quoting.
 */
export function createPackageManagerInvocation(
  packageManager: PackageManager,
  args: readonly string[],
  platform: NodeJS.Platform = process.platform,
  comspec = process.env.ComSpec ??
    process.env.COMSPEC ??
    process.env.comspec ??
    "cmd.exe"
): PackageManagerInvocation {
  if (platform !== "win32") {
    return { executable: packageManager, args: [...args] };
  }

  const tokens = [`${packageManager}.cmd`, ...args];
  if (!tokens.every((token) => /^[0-9A-Za-z._-]+$/.test(token))) {
    throw new Error("Unsafe package-manager argument for Windows.");
  }

  return {
    executable: comspec,
    args: ["/d", "/s", "/c", `"${tokens.join(" ")}"`],
    windowsVerbatimArguments: true,
  };
}

function runInstall(
  packageManager: PackageManager,
  args: readonly string[],
  cwd: string
): Promise<void> {
  const invocation = createPackageManagerInvocation(packageManager, args);
  return new Promise((resolve, reject) => {
    const child = spawn(invocation.executable, invocation.args, {
      cwd,
      shell: false,
      stdio: "inherit",
      ...(invocation.windowsVerbatimArguments
        ? { windowsVerbatimArguments: true }
        : {}),
    });
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      const outcome = signal ? `signal ${signal}` : `exit code ${code}`;
      reject(new Error(`${packageManager} install failed with ${outcome}.`));
    });
  });
}
