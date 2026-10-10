import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { inspectNotcmsDependency } from "../src/cli/features/dependency-resolution";

describe("inspectNotcmsDependency", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(tmpdir(), "notcms-resolution-"));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it.each(["dependencies", "devDependencies"])(
    "recognizes a direct declaration in %s",
    async (field) => {
      await writeManifest({ [field]: { notcms: "file:../notcms" } });

      expect(inspectNotcmsDependency(dir).declared).toBe(true);
    }
  );

  it("does not treat other dependency fields as a direct declaration", async () => {
    await writeManifest({
      optionalDependencies: { notcms: "1.0.0" },
      peerDependencies: { notcms: "1.0.0" },
    });

    expect(inspectNotcmsDependency(dir).declared).toBe(false);
  });

  it("reports a direct dependency as unresolved before it is installed", async () => {
    await writeManifest({ dependencies: { notcms: "file:../notcms" } });

    expect(inspectNotcmsDependency(dir)).toEqual({
      declared: true,
      resolved: false,
    });
  });

  it("resolves notcms from the target project's node_modules", async () => {
    await writeManifest({ dependencies: { notcms: "file:../notcms" } });
    const packageDirectory = path.join(dir, "node_modules", "notcms");
    await fs.mkdir(packageDirectory, { recursive: true });
    await fs.writeFile(
      path.join(packageDirectory, "package.json"),
      JSON.stringify({ name: "notcms", main: "index.js" })
    );
    await fs.writeFile(path.join(packageDirectory, "index.js"), "export {};");

    expect(inspectNotcmsDependency(dir)).toEqual({
      declared: true,
      resolved: true,
    });
  });

  it("resolves Yarn PnP without requiring the CLI process to use the PnP loader", async () => {
    const workspaceDir = path.join(dir, "apps", "site");
    await fs.mkdir(workspaceDir, { recursive: true });
    await fs.writeFile(
      path.join(workspaceDir, "package.json"),
      JSON.stringify({ dependencies: { notcms: "workspace:^" } })
    );
    const pnpPath = path.join(dir, ".pnp.cjs");
    await fs.writeFile(
      pnpPath,
      `module.exports = {
        resolveRequest(request, issuer, options) {
          if (request !== "notcms") throw new Error("unexpected request");
          if (!issuer.endsWith(${JSON.stringify(path.join("apps", "site", "package.json"))})) throw new Error("unexpected issuer");
          if (options?.considerBuiltins !== false) throw new Error("unexpected options");
          return "/virtual/.yarn/cache/notcms.zip/node_modules/notcms/dist/index.js";
        },
      };`
    );

    expect(
      inspectNotcmsDependency(workspaceDir, { targetPnpPath: pnpPath })
    ).toEqual({
      declared: true,
      resolved: false,
      verificationRequired: "target-pnp",
    });
    expect(
      inspectNotcmsDependency(workspaceDir, {
        evaluateTargetPnp: true,
        targetPnpPath: pnpPath,
      })
    ).toEqual({
      declared: true,
      resolved: true,
    });
  });

  it("does not accept a target PnP API that cannot resolve notcms", async () => {
    await writeManifest({ dependencies: { notcms: "1.0.0" } });
    const pnpPath = path.join(dir, ".pnp.cjs");
    await fs.writeFile(
      pnpPath,
      `module.exports = {
        resolveRequest() {
          throw new Error("not installed");
        },
      };`
    );

    expect(
      inspectNotcmsDependency(dir, {
        evaluateTargetPnp: true,
        targetPnpPath: pnpPath,
      })
    ).toEqual({
      declared: true,
      resolved: false,
    });
  });

  it("reloads the target PnP API after an install updates its resolution map", async () => {
    await writeManifest({ dependencies: { notcms: "1.0.0" } });
    const pnpPath = path.join(dir, ".pnp.cjs");
    await fs.writeFile(
      pnpPath,
      `module.exports = {
        resolveRequest() {
          throw new Error("not installed yet");
        },
      };`
    );
    expect(
      inspectNotcmsDependency(dir, {
        evaluateTargetPnp: true,
        targetPnpPath: pnpPath,
      }).resolved
    ).toBe(false);

    await fs.writeFile(
      pnpPath,
      `module.exports = {
        resolveRequest(request) {
          if (request !== "notcms") throw new Error("unexpected request");
          return "/virtual/.yarn/cache/notcms.zip/node_modules/notcms/dist/index.js";
        },
      };`
    );

    expect(
      inspectNotcmsDependency(dir, {
        evaluateTargetPnp: true,
        targetPnpPath: pnpPath,
      }).resolved
    ).toBe(true);
  });

  async function writeManifest(manifest: Record<string, unknown>) {
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify(manifest)
    );
  }
});
