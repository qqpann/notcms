import { EventEmitter } from "node:events";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const promptMocks = vi.hoisted(() => ({
  confirm: vi.fn(),
}));
const childProcessMocks = vi.hoisted(() => ({
  spawn: vi.fn(),
}));
const resolutionMocks = vi.hoisted(() => ({
  inspectNotcmsDependency: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => promptMocks);
vi.mock("node:child_process", () => childProcessMocks);
vi.mock("../src/cli/features/dependency-resolution.js", () => resolutionMocks);

import {
  type PackageManager,
  createPackageManagerInvocation,
  detectPackageManager,
  ensureNotcmsDependency,
} from "../src/cli/features/dependency";

describe("createPackageManagerInvocation", () => {
  it("uses cmd.exe safely for Windows command shims", () => {
    expect(
      createPackageManagerInvocation(
        "pnpm",
        ["add", "-w", "notcms"],
        "win32",
        "C:\\Windows\\System32\\cmd.exe"
      )
    ).toEqual({
      executable: "C:\\Windows\\System32\\cmd.exe",
      args: ["/d", "/s", "/c", '"pnpm.cmd add -w notcms"'],
      windowsVerbatimArguments: true,
    });
  });

  it("rejects shell metacharacters before building a Windows command", () => {
    expect(() =>
      createPackageManagerInvocation(
        "npm",
        ["install", "notcms&whoami"],
        "win32",
        "cmd.exe"
      )
    ).toThrow("Unsafe package-manager argument for Windows.");
  });
});

describe("detectPackageManager", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(tmpdir(), "notcms-dependency-"));
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "notcms-dependency-fixture", private: true })
    );
  });

  afterEach(async () => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    await fs.rm(dir, { recursive: true, force: true });
  });

  it.each([
    ["pnpm@10.0.0", "pnpm", undefined],
    ["npm@11.0.0", "npm", undefined],
    ["yarn@4.0.0", "yarn", 4],
    ["bun@1.2.0", "bun", undefined],
  ])("detects %s from package.json", async (value, expected, major) => {
    await writePackageJson({ packageManager: value });

    expect(detectPackageManager({ cwd: dir, userAgent: "npm/11.0.0" })).toEqual(
      {
        status: "detected",
        packageManager: expected,
        ...(major === undefined ? {} : { packageManagerMajor: major }),
      }
    );
  });

  it.each([
    ["pnpm-lock.yaml", "pnpm"],
    ["package-lock.json", "npm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
  ])("detects %s", async (lockfile, expected) => {
    await fs.writeFile(path.join(dir, lockfile), "");

    expect(detectPackageManager({ cwd: dir, userAgent: "" })).toEqual({
      status: "detected",
      packageManager: expected,
    });
  });

  it.each([
    ["pnpm/10.0.0 node/v22", "pnpm", undefined],
    ["npm/11.0.0 node/v22", "npm", undefined],
    ["yarn/4.0.0 node/v22", "yarn", 4],
    ["bun/1.2.0", "bun", undefined],
  ])("detects %s from the user agent", (userAgent, expected, major) => {
    expect(detectPackageManager({ cwd: dir, userAgent })).toEqual({
      status: "detected",
      packageManager: expected,
      ...(major === undefined ? {} : { packageManagerMajor: major }),
    });
  });

  it("prefers packageManager over lockfiles and the user agent", async () => {
    await writePackageJson({ packageManager: "yarn@4.0.0" });
    await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "");

    expect(detectPackageManager({ cwd: dir, userAgent: "npm/11.0.0" })).toEqual(
      {
        status: "detected",
        packageManager: "yarn",
        packageManagerMajor: 4,
      }
    );
  });

  it("uses a nearer lockfile instead of an ancestor packageManager", async () => {
    await writePackageJson({ packageManager: "pnpm@10.0.0" });
    const childDir = path.join(dir, "app");
    await fs.mkdir(childDir);
    await fs.writeFile(path.join(childDir, "package-lock.json"), "");

    expect(
      detectPackageManager({ cwd: childDir, userAgent: "pnpm/10.0.0" })
    ).toEqual({
      status: "detected",
      packageManager: "npm",
    });
  });

  it("uses the user agent to disambiguate multiple lockfiles", async () => {
    await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "");
    await fs.writeFile(path.join(dir, "yarn.lock"), "");

    expect(detectPackageManager({ cwd: dir, userAgent: "yarn/4.0.0" })).toEqual(
      {
        status: "detected",
        packageManager: "yarn",
        packageManagerMajor: 4,
      }
    );
  });

  it("requires manual resolution for conflicting lockfiles without a matching user agent", async () => {
    await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "");
    await fs.writeFile(path.join(dir, "yarn.lock"), "");

    expect(detectPackageManager({ cwd: dir, userAgent: "npm/11.0.0" })).toEqual(
      expect.objectContaining({
        status: "manual",
        reason: "ambiguous-lockfiles",
      })
    );
  });

  it("requires manual resolution for an invalid explicit packageManager", async () => {
    await writePackageJson({ packageManager: "npm; touch notcms-owned" });

    expect(detectPackageManager({ cwd: dir, userAgent: "npm/11.0.0" })).toEqual(
      expect.objectContaining({
        status: "manual",
        reason: "invalid-package-manager",
      })
    );
  });

  async function writePackageJson(value: Record<string, unknown>) {
    await fs.writeFile(path.join(dir, "package.json"), JSON.stringify(value));
  }
});

describe("ensureNotcmsDependency", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(tmpdir(), "notcms-dependency-"));
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "notcms-dependency-fixture", private: true })
    );
    resolutionMocks.inspectNotcmsDependency.mockReturnValue({
      declared: false,
      resolved: false,
    });
  });

  afterEach(async () => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("skips installation only when notcms is direct and resolvable", async () => {
    resolutionMocks.inspectNotcmsDependency.mockReturnValue({
      declared: true,
      resolved: true,
    });

    await expect(
      ensureNotcmsDependency({ cwd: dir, interactive: true })
    ).resolves.toEqual({ status: "already-installed" });
    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it.each<{
    packageManager: PackageManager;
    userAgent: string;
    args: string[];
    command: string;
  }>([
    {
      packageManager: "pnpm",
      userAgent: "pnpm/10.0.0",
      args: ["add", "notcms"],
      command: "pnpm add notcms",
    },
    {
      packageManager: "npm",
      userAgent: "npm/11.0.0",
      args: ["install", "notcms"],
      command: "npm install notcms",
    },
    {
      packageManager: "yarn",
      userAgent: "yarn/4.0.0",
      args: ["add", "notcms"],
      command: "yarn add notcms",
    },
    {
      packageManager: "bun",
      userAgent: "bun/1.2.0",
      args: ["add", "notcms"],
      command: "bun add notcms",
    },
  ])(
    "adds with $packageManager using an argv-only child process",
    async ({ packageManager, userAgent, args, command }) => {
      promptMocks.confirm.mockResolvedValue(true);
      childProcessMocks.spawn.mockImplementation(() => closingChild(0));

      await expect(
        ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent })
      ).resolves.toEqual({ status: "installed", packageManager, command });
      expect(promptMocks.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          default: true,
          message: expect.stringContaining(command),
        })
      );
      expectInstallSpawn(packageManager, args);
    }
  );

  it("adds notcms when it resolves only transitively or through hoisting", async () => {
    resolutionMocks.inspectNotcmsDependency.mockReturnValue({
      declared: false,
      resolved: true,
    });
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "npm/11.0.0",
      })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "npm",
      command: "npm install notcms",
    });
    expectInstallSpawn("npm", ["install", "notcms"]);
  });

  it("adds to a pnpm workspace root with the required workspace flag", async () => {
    await fs.writeFile(path.join(dir, "pnpm-workspace.yaml"), "packages: []\n");
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "pnpm/10.0.0",
      })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "pnpm",
      command: "pnpm add -w notcms",
    });
    expectInstallSpawn("pnpm", ["add", "-w", "notcms"]);
  });

  it("adds to a Yarn Classic workspace root with its required root flag", async () => {
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({
        packageManager: "yarn@1.22.22",
        private: true,
        workspaces: ["packages/*"],
      })
    );
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "npm/11.0.0",
      })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "yarn",
      command: "yarn add -W notcms",
    });
    expectInstallSpawn("yarn", ["add", "-W", "notcms"]);
  });

  it("infers Yarn Classic from a v1 lockfile at a workspace root", async () => {
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({ private: true, workspaces: ["packages/*"] })
    );
    await fs.writeFile(path.join(dir, "yarn.lock"), "# yarn lockfile v1\n");
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent: "" })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "yarn",
      command: "yarn add -W notcms",
    });
    expectInstallSpawn("yarn", ["add", "-W", "notcms"]);
  });

  it("uses the normal add command at a Yarn Berry workspace root", async () => {
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({
        packageManager: "yarn@4.9.2",
        private: true,
        workspaces: ["packages/*"],
      })
    );
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent: "" })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "yarn",
      command: "yarn add notcms",
    });
    expectInstallSpawn("yarn", ["add", "notcms"]);
  });

  it("requires a Yarn version before changing an ambiguous workspace root", async () => {
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({
        packageManager: "yarn",
        private: true,
        workspaces: ["packages/*"],
      })
    );

    await expect(
      ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent: "" })
    ).resolves.toEqual({
      status: "manual",
      reason: "invalid-package-manager",
      error: expect.stringContaining("Yarn Classic or Yarn Berry"),
    });
    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("installs an existing direct dependency at a version-ambiguous Yarn root", async () => {
    resolutionMocks.inspectNotcmsDependency.mockReturnValue({
      declared: true,
      resolved: false,
    });
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({
        packageManager: "yarn",
        private: true,
        workspaces: ["packages/*"],
        dependencies: { notcms: "file:../notcms" },
      })
    );
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent: "" })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "yarn",
      command: "yarn install",
    });
    expectInstallSpawn("yarn", ["install"]);
  });

  it("defaults a truly empty project to npm add", async () => {
    await fs.rm(path.join(dir, "package.json"));
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await expect(
      ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent: "" })
    ).resolves.toEqual({
      status: "installed",
      packageManager: "npm",
      command: "npm install notcms",
    });
    expectInstallSpawn("npm", ["install", "notcms"]);
  });

  it.each<{ packageManager: PackageManager; userAgent: string }>([
    { packageManager: "pnpm", userAgent: "pnpm/10.0.0" },
    { packageManager: "npm", userAgent: "npm/11.0.0" },
    { packageManager: "yarn", userAgent: "yarn/4.0.0" },
    { packageManager: "bun", userAgent: "bun/1.2.0" },
  ])(
    "runs $packageManager install when the direct dependency is unresolved",
    async ({ packageManager, userAgent }) => {
      resolutionMocks.inspectNotcmsDependency.mockReturnValue({
        declared: true,
        resolved: false,
      });
      promptMocks.confirm.mockResolvedValue(true);
      childProcessMocks.spawn.mockImplementation(() => closingChild(0));

      await expect(
        ensureNotcmsDependency({ cwd: dir, interactive: true, userAgent })
      ).resolves.toEqual({
        status: "installed",
        packageManager,
        command: `${packageManager} install`,
      });
      expect(promptMocks.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          default: true,
          message: expect.stringContaining(`${packageManager} install`),
        })
      );
      expectInstallSpawn(packageManager, ["install"]);
    }
  );

  it("returns the exact manual command when installation is declined", async () => {
    promptMocks.confirm.mockResolvedValue(false);

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "pnpm/10.0.0",
      })
    ).resolves.toEqual({
      status: "manual",
      reason: "declined",
      packageManager: "pnpm",
      command: "pnpm add notcms",
    });
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("describes a declared target PnP dependency as unverified before consent", async () => {
    resolutionMocks.inspectNotcmsDependency.mockReturnValue({
      declared: true,
      resolved: false,
      verificationRequired: "target-pnp",
    });
    promptMocks.confirm.mockResolvedValue(false);

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "yarn/4.0.0",
      })
    ).resolves.toEqual({
      status: "manual",
      reason: "declined",
      packageManager: "yarn",
      command: "yarn install",
      verificationRequired: "target-pnp",
    });
    expect(promptMocks.confirm).toHaveBeenCalledWith({
      default: true,
      message:
        'The notcms dependency is declared in a Yarn PnP project, but its resolution has not been verified. Run "yarn install" now, then verify it?',
    });
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("returns the exact manual command when installation fails", async () => {
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(7));

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "yarn/4.0.0",
      })
    ).resolves.toEqual({
      status: "manual",
      reason: "failed",
      packageManager: "yarn",
      command: "yarn add notcms",
      error: "yarn install failed with exit code 7.",
    });
  });

  it("returns the manual command when a zero exit does not install notcms", async () => {
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() =>
      closingChildWithoutInstall(0)
    );

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "npm/11.0.0",
      })
    ).resolves.toEqual({
      status: "manual",
      reason: "failed",
      packageManager: "npm",
      command: "npm install notcms",
      error:
        "npm install notcms exited successfully, but notcms is still not a direct, resolvable project dependency.",
    });
    expect(resolutionMocks.inspectNotcmsDependency).toHaveBeenCalledTimes(2);
    expect(resolutionMocks.inspectNotcmsDependency).toHaveBeenNthCalledWith(
      1,
      dir
    );
    expect(resolutionMocks.inspectNotcmsDependency).toHaveBeenNthCalledWith(
      2,
      dir,
      {}
    );
  });

  it("does not prompt or spawn in a non-interactive session", async () => {
    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: false,
        userAgent: "bun/1.2.0",
      })
    ).resolves.toEqual({
      status: "manual",
      reason: "non-interactive",
      packageManager: "bun",
      command: "bun add notcms",
    });
    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("does not prompt or spawn in CI by default", async () => {
    vi.stubEnv("CI", "true");

    await expect(
      ensureNotcmsDependency({ cwd: dir, userAgent: "npm/11.0.0" })
    ).resolves.toEqual({
      status: "manual",
      reason: "non-interactive",
      packageManager: "npm",
      command: "npm install notcms",
    });
    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("returns the manual command when the package manager cannot start", async () => {
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => erroringChild());

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "pnpm/10.0.0",
      })
    ).resolves.toEqual({
      status: "manual",
      reason: "failed",
      packageManager: "pnpm",
      command: "pnpm add notcms",
      error: "spawn pnpm ENOENT",
    });
  });

  it("does not prompt or spawn for an invalid explicit packageManager", async () => {
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({ packageManager: "npm; touch notcms-owned" })
    );

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "npm/11.0.0",
      })
    ).resolves.toEqual(
      expect.objectContaining({
        status: "manual",
        reason: "invalid-package-manager",
      })
    );
    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("does not prompt or spawn for ambiguous lockfiles", async () => {
    await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "");
    await fs.writeFile(path.join(dir, "yarn.lock"), "");

    await expect(
      ensureNotcmsDependency({
        cwd: dir,
        interactive: true,
        userAgent: "npm/11.0.0",
      })
    ).resolves.toEqual(
      expect.objectContaining({
        status: "manual",
        reason: "ambiguous-lockfiles",
      })
    );
    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(childProcessMocks.spawn).not.toHaveBeenCalled();
  });

  it("never passes a project-controlled user agent to a shell", async () => {
    promptMocks.confirm.mockResolvedValue(true);
    childProcessMocks.spawn.mockImplementation(() => closingChild(0));

    await ensureNotcmsDependency({
      cwd: dir,
      interactive: true,
      userAgent: "unknown; touch notcms-owned/1.0.0",
    });

    expectInstallSpawn("npm", ["install", "notcms"]);
  });

  function closingChild(exitCode: number) {
    const child = new EventEmitter();
    queueMicrotask(() => {
      if (exitCode === 0) {
        resolutionMocks.inspectNotcmsDependency.mockReturnValue({
          declared: true,
          resolved: true,
        });
      }
      child.emit("close", exitCode, null);
    });
    return child;
  }

  function closingChildWithoutInstall(exitCode: number) {
    const child = new EventEmitter();
    queueMicrotask(() => child.emit("close", exitCode, null));
    return child;
  }

  function erroringChild() {
    const child = new EventEmitter();
    queueMicrotask(() => child.emit("error", new Error("spawn pnpm ENOENT")));
    return child;
  }

  function expectInstallSpawn(
    packageManager: "pnpm" | "npm" | "yarn" | "bun",
    args: string[]
  ) {
    const invocation = createPackageManagerInvocation(packageManager, args);
    expect(childProcessMocks.spawn).toHaveBeenCalledWith(
      invocation.executable,
      invocation.args,
      {
        cwd: dir,
        shell: false,
        stdio: "inherit",
        ...(invocation.windowsVerbatimArguments
          ? { windowsVerbatimArguments: true }
          : {}),
      }
    );
  }
});
