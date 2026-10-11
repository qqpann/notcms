import assert from "node:assert/strict";
import test from "node:test";
import { planRelease, publishTags } from "./sync-action-release.mjs";

for (const version of ["0.1.0-beta.1", "01.2.3", "1.2", "x"]) {
  test(`rejects nonstable version ${version}`, () =>
    assert.throws(() => planRelease({ version }), /stable version/));
}
test("already released inputs are a no-op", () =>
  assert.deepEqual(
    planRelease({
      version: "0.1.0",
      latestVersion: "0.1.0",
      tagged: true,
      changed: false,
    }),
    { action: "skip", version: "0.1.0" }
  ));
test("changed tagged inputs prepare a patch PR", () =>
  assert.deepEqual(
    planRelease({
      version: "0.1.0",
      latestVersion: "0.1.0",
      tagged: true,
      changed: true,
    }),
    {
      action: "prepare",
      version: "0.1.1",
      versionTag: "sync-action@0.1.1",
      majorTag: "v0",
    }
  ));
test("a merged untagged version publishes without another bump", () =>
  assert.equal(
    planRelease({
      version: "0.1.1",
      latestVersion: "0.1.0",
      tagged: false,
      changed: true,
    }).action,
    "publish"
  ));
test("rejects a downgrade", () =>
  assert.throws(
    () =>
      planRelease({
        version: "0.1.0",
        latestVersion: "0.1.1",
        tagged: true,
        changed: true,
      }),
    /behind/
  ));
test("compares semver numerically", () =>
  assert.equal(
    planRelease({ version: "0.1.10", latestVersion: "0.1.9", tagged: false })
      .action,
    "publish"
  ));
const head = "a".repeat(40),
  old = "b".repeat(40);
const release = { versionTag: "sync-action@0.1.1", majorTag: "v0", head };
function commands(remote) {
  const calls = [];
  return {
    calls,
    run: async (command, args) => {
      calls.push([command, args]);
      return {
        exitCode: 0,
        stdout: args[0] === "ls-remote" ? remote : "",
        stderr: "",
      };
    },
  };
}
test("publishes both refs atomically with a major-tag lease", async () => {
  const mock = commands(`${old}\trefs/tags/v0\n`);
  await publishTags(release, mock.run);
  assert.deepEqual(mock.calls[1][1], [
    "push",
    "--atomic",
    "origin",
    `--force-with-lease=refs/tags/v0:${old}`,
    `${head}:refs/tags/sync-action@0.1.1`,
    `${head}:refs/tags/v0`,
  ]);
});
test("a completed retry does not push", async () => {
  const mock = commands(
    `${head}\trefs/tags/v0\n${head}\trefs/tags/sync-action@0.1.1\n`
  );
  await publishTags(release, mock.run);
  assert.equal(mock.calls.length, 1);
});
test("refuses to move an immutable version tag", async () => {
  const mock = commands(`${old}\trefs/tags/sync-action@0.1.1\n`);
  await assert.rejects(publishTags(release, mock.run), /Immutable/);
  assert.equal(mock.calls.length, 1);
});
test("repairs a missing alias without overwriting the version tag", async () => {
  const mock = commands(`${head}\trefs/tags/sync-action@0.1.1\n`);
  await publishTags(release, mock.run);
  assert.deepEqual(mock.calls[1][1], [
    "push",
    "--atomic",
    "origin",
    "--force-with-lease=refs/tags/v0:",
    `${head}:refs/tags/v0`,
  ]);
});
test("propagates rejected tag pushes", async () => {
  await assert.rejects(
    publishTags(release, async (_, args) => ({
      exitCode: args[0] === "push" ? 1 : 0,
      stdout: "",
      stderr: "rejected",
    })),
    /rejected/
  );
});

test("atomic publication and lease rejection work against a local bare repository", async () => {
  const { mkdtemp, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { runCommand } = await import("./staged-publish.mjs");
  const root = await mkdtemp(join(tmpdir(), "sync-release-test-"));
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: "Fixture",
    GIT_AUTHOR_EMAIL: "fixture@example.test",
    GIT_COMMITTER_NAME: "Fixture",
    GIT_COMMITTER_EMAIL: "fixture@example.test",
  };
  const run = (command, args) =>
    runCommand(command, ["-c", "core.hooksPath=/dev/null", ...args], {
      cwd: root,
      env,
    });
  const git = async (...args) => {
    const result = await run("git", args);
    assert.equal(result.exitCode, 0, result.stderr);
    return result.stdout.trim();
  };
  try {
    await git("init", "--bare", "origin.git");
    await git("init", "--initial-branch=main");
    await git("remote", "add", "origin", join(root, "origin.git"));
    await writeFile(join(root, "fixture"), "old");
    await git("add", "fixture");
    await git("commit", "-m", "old");
    await git("push", "origin", "HEAD:refs/tags/v0");
    await writeFile(join(root, "fixture"), "new");
    await git("commit", "-am", "new");
    const released = await git("rev-parse", "HEAD");
    await publishTags({ ...release, head: released }, run);
    assert.match(
      await git("ls-remote", "origin", "refs/tags/sync-action@0.1.1"),
      new RegExp(`^${released}`)
    );
    assert.match(
      await git("ls-remote", "origin", "refs/tags/v0"),
      new RegExp(`^${released}`)
    );
    await writeFile(join(root, "fixture"), "next");
    await git("commit", "-am", "next");
    const next = await git("rev-parse", "HEAD");
    await writeFile(join(root, "fixture"), "concurrent");
    await git("commit", "-am", "concurrent");
    const concurrent = await git("rev-parse", "HEAD");
    let advanced = false;
    const race = async (command, args) => {
      if (args[0] === "push" && !advanced) {
        advanced = true;
        await git("push", "--force", "origin", `${concurrent}:refs/tags/v0`);
      }
      return run(command, args);
    };
    await assert.rejects(
      publishTags(
        { ...release, versionTag: "sync-action@0.1.2", head: next },
        race
      )
    );
    assert.equal(
      await git("ls-remote", "origin", "refs/tags/sync-action@0.1.2"),
      ""
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("repairs an absent or outdated major alias without bumping version", () => {
  assert.deepEqual(
    planRelease({
      version: "0.1.1",
      latestVersion: "0.1.1",
      tagged: true,
      changed: false,
      aliasMatches: false,
    }),
    {
      action: "repair",
      version: "0.1.1",
      versionTag: "sync-action@0.1.1",
      majorTag: "v0",
    }
  );
});
