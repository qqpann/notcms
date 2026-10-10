import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const rootRequire = createRequire(new URL("../package.json", import.meta.url));
const changesetCli = rootRequire.resolve("@changesets/cli/bin.js");

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve(output) : reject(new Error(output))
    );
  });
}

for (const consumer of [
  "packages/notcms",
  "examples/nextjs-simple-blog-template",
]) {
  test(`external-editor temporary-file round trip: ${consumer}`, async () => {
    let consumerRequire = createRequire(
      path.join(root, consumer, "package.json")
    );
    if (consumer.startsWith("examples/")) {
      consumerRequire = createRequire(consumerRequire.resolve("notcms"));
    }
    const promptsRequire = createRequire(
      consumerRequire.resolve("@inquirer/prompts")
    );
    const editorRequire = createRequire(
      promptsRequire.resolve("@inquirer/editor")
    );
    const { ExternalEditor } = editorRequire("external-editor");
    const directory = await mkdtemp(path.join(tmpdir(), "notcms-editor-"));
    try {
      const editor = new ExternalEditor("Fixture Markdown\n", {
        dir: directory,
        prefix: "notcms-",
        postfix: ".md",
        mode: 0o600,
      });
      assert.equal(
        await realpath(path.dirname(editor.tempFile)),
        await realpath(directory)
      );
      assert.equal(
        await readFile(editor.tempFile, "utf8"),
        "Fixture Markdown\n"
      );
      assert.equal((await stat(editor.tempFile)).mode & 0o777, 0o600);
      await writeFile(editor.tempFile, "Updated Markdown\n");
      editor.readTemporaryFile();
      assert.equal(editor.text, "Updated Markdown\n");
      editor.cleanup();
      await assert.rejects(stat(editor.tempFile), { code: "ENOENT" });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

test("Changesets generates the staged SDK patch without altering the checkout", async () => {
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
    await copyFile(
      path.join(root, ".changeset/secure-cli-dependencies.md"),
      path.join(fixture, ".changeset/secure-cli-dependencies.md")
    );
    await run(process.execPath, [changesetCli, "version"], fixture);
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
      /Update bundled CLI dependencies to patched versions/
    );
    await assert.rejects(
      stat(path.join(fixture, ".changeset/secure-cli-dependencies.md")),
      { code: "ENOENT" }
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
