import assert from "node:assert/strict";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runCommand } from "./staged-publish.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const rootRequire = createRequire(new URL("../package.json", import.meta.url));
const changesetCli = rootRequire.resolve("@changesets/cli/bin.js");

test("Changesets generates a fixture SDK patch without altering the checkout", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "notcms-changeset-"));
  try {
    const manifest = JSON.parse(
      await readFile(path.join(root, "package.json"), "utf8")
    );
    manifest.private = true;
    await writeFile(
      path.join(fixture, "pnpm-workspace.yaml"),
      "packages:\n  - packages/*\n"
    );
    await writeFile(
      path.join(fixture, "package.json"),
      JSON.stringify(manifest)
    );
    await mkdir(path.join(fixture, "packages/notcms"), { recursive: true });
    await copyFile(
      path.join(root, "packages/notcms/package.json"),
      path.join(fixture, "packages/notcms/package.json")
    );
    await mkdir(path.join(fixture, ".changeset"));
    const config = JSON.parse(
      await readFile(path.join(root, ".changeset/config.json"), "utf8")
    );
    config.ignore = [];
    config.changelog = [rootRequire.resolve("@changesets/cli/changelog"), {}];
    await writeFile(
      path.join(fixture, ".changeset/config.json"),
      JSON.stringify(config)
    );
    // Release changesets are consumed on versioning; keep this fixture independent.
    await writeFile(
      path.join(fixture, ".changeset/fixture-sdk-patch.md"),
      '---\n"notcms": patch\n---\n\nFixture SDK patch for Changesets integration.\n'
    );
    const result = await runCommand(
      process.execPath,
      [changesetCli, "version"],
      { cwd: fixture }
    );
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    const original = JSON.parse(
      await readFile(path.join(root, "packages/notcms/package.json"), "utf8")
    );
    const updated = JSON.parse(
      await readFile(path.join(fixture, "packages/notcms/package.json"), "utf8")
    );
    const [major, minor, patch] = original.version.split(".").map(Number);
    assert.equal(updated.version, `${major}.${minor}.${patch + 1}`);
    assert.match(
      await readFile(
        path.join(fixture, "packages/notcms/CHANGELOG.md"),
        "utf8"
      ),
      /Fixture SDK patch for Changesets integration/
    );
    await assert.rejects(
      stat(path.join(fixture, ".changeset/fixture-sdk-patch.md")),
      { code: "ENOENT" }
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
