import { existsSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// Keep this runtime-resolved so bundlers do not replace the project-scoped
// lookup with the CLI package's own source or bundle location.
const NOTCMS_PACKAGE_NAME = ["not", "cms"].join("");

export type NotcmsDependencyState = {
  declared: boolean;
  resolved: boolean;
  verificationRequired?: "target-pnp";
};

type InspectNotcmsDependencyOptions = {
  evaluateTargetPnp?: boolean;
  targetPnpPath?: string;
};

/** Internal adapter for inspecting the target project, not the CLI. */
export function inspectNotcmsDependency(
  cwd: string,
  options: InspectNotcmsDependencyOptions = {}
): NotcmsDependencyState {
  const resolution = inspectResolution(
    cwd,
    NOTCMS_PACKAGE_NAME,
    options.targetPnpPath,
    options.evaluateTargetPnp === true
  );
  return {
    declared: isDirectDependency(cwd, NOTCMS_PACKAGE_NAME),
    ...resolution,
  };
}

function isDirectDependency(cwd: string, packageName: string): boolean {
  try {
    const manifest: unknown = JSON.parse(
      readFileSync(path.join(cwd, "package.json"), "utf-8")
    );
    if (!isRecord(manifest)) {
      return false;
    }
    return (
      hasOwnDependency(manifest.dependencies, packageName) ||
      hasOwnDependency(manifest.devDependencies, packageName)
    );
  } catch {
    return false;
  }
}

function hasOwnDependency(value: unknown, packageName: string): boolean {
  return (
    isRecord(value) && Object.prototype.hasOwnProperty.call(value, packageName)
  );
}

function inspectResolution(
  cwd: string,
  packageName: string,
  targetPnpPath: string | undefined,
  evaluateTargetPnp: boolean
): Pick<NotcmsDependencyState, "resolved" | "verificationRequired"> {
  const packageDirectories = ancestorDirectories(cwd)
    .map((directory) =>
      path.join(directory, "node_modules", ...packageName.split("/"))
    )
    .filter((directory) => existsSync(directory));
  if (packageDirectories.length > 0) {
    try {
      const resolved = createRequire(path.join(cwd, "package.json")).resolve(
        packageName
      );
      const realResolved = realpathSync(resolved);
      if (
        packageDirectories.some((directory) =>
          isWithin(realpathSync(directory), realResolved)
        )
      ) {
        return { resolved: true };
      }
    } catch {
      // Fall through to target-project PnP detection.
    }
  }

  if (!targetPnpPath || !existsSync(targetPnpPath)) {
    return { resolved: false };
  }
  if (!evaluateTargetPnp) {
    return { resolved: false, verificationRequired: "target-pnp" };
  }
  return {
    resolved: isResolvableThroughTargetPnp(cwd, packageName, targetPnpPath),
  };
}

/**
 * Resolve through the target project's generated PnP API rather than relying
 * on the CLI process having started with Yarn's loader. The returned path may
 * live inside Yarn's zip filesystem, so a successful API resolution is the
 * existence check; native `fs.existsSync` cannot inspect that virtual path.
 */
function isResolvableThroughTargetPnp(
  cwd: string,
  packageName: string,
  pnpPath: string
): boolean {
  try {
    const projectRequire = createRequire(path.join(cwd, "package.json"));
    const resolvedPnpPath = projectRequire.resolve(pnpPath);
    delete projectRequire.cache[resolvedPnpPath];
    const pnpApi: unknown = projectRequire(resolvedPnpPath);
    if (!isRecord(pnpApi)) {
      return false;
    }
    const resolveRequest = Reflect.get(pnpApi, "resolveRequest");
    if (typeof resolveRequest !== "function") {
      return false;
    }
    const resolved: unknown = Reflect.apply(resolveRequest, pnpApi, [
      packageName,
      path.join(cwd, "package.json"),
      { considerBuiltins: false },
    ]);
    return typeof resolved === "string" && resolved.length > 0;
  } catch {
    return false;
  }
}

function ancestorDirectories(start: string): string[] {
  const directories: string[] = [];
  let directory = path.resolve(start);
  while (true) {
    directories.push(directory);
    const parent = path.dirname(directory);
    if (parent === directory) {
      return directories;
    }
    directory = parent;
  }
}

function isWithin(parent: string, candidate: string): boolean {
  const relative = path.relative(parent, candidate);
  return (
    relative === "" ||
    (relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
