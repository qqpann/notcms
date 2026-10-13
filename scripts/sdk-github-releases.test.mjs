import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  REPOSITORY,
  planRelease,
  publishRelease,
  releaseNotes,
} from "./sdk-github-releases.mjs";
import { CHANGELOG_PATH, PACKAGE_JSON_PATH } from "./staged-publish.mjs";

const commit = "a".repeat(40);
const tag = "notcms@0.5.0";
const changelog =
  "# notcms\n\n## 0.6.0\n\n### Minor Changes\n\n- Future\n\n## 0.5.0\n\n### Patch Changes\n\n- Current\n\n```md\n## 99.0.0\n```\n\n## 0.4.0\n\n### Minor Changes\n\n- Past\n";
const ok = (stdout = "") => ({ exitCode: 0, stdout, stderr: "" });
const failure = (stderr = "failed") => ({ exitCode: 1, stdout: "", stderr });

test("extracts only the target section while retaining code examples", () => {
  const notes = releaseNotes(changelog, "0.5.0");
  assert.match(notes, /- Current\n\n```md\n## 99.0.0\n```/);
  assert.match(notes, /https:\/\/www.npmjs.com\/package\/notcms\/v\/0.5.0/);
  assert.doesNotMatch(notes, /Future|Past/);
});

test("rejects missing, duplicate and empty target notes", () => {
  for (const text of [
    "## 0.4.0\n- Old",
    "## 0.5.0\n",
    "## 0.5.0\n### Patch Changes",
    "## 0.5.0\n- One\n## 0.5.0\n- Two",
  ])
    assert.throws(() => releaseNotes(text, "0.5.0"), /changelog/);
});

test("plans from the original commit with no npm or GitHub lookup", async () => {
  const calls = [];
  const run = async (command, args) => {
    calls.push([command, ...args]);
    if (args[0] === "merge-base") return ok();
    if (args[1] === `${commit}:${PACKAGE_JSON_PATH}`)
      return ok(JSON.stringify({ name: "notcms", version: "0.5.0" }));
    if (args[1] === `${commit}:${CHANGELOG_PATH}`) return ok(changelog);
    throw new Error("Unexpected command");
  };
  const plan = await planRelease(commit, run);
  assert.equal(plan.tag, tag);
  assert.equal(plan.commit, commit);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls[0], [
    "git",
    "merge-base",
    "--is-ancestor",
    commit,
    "origin/main",
  ]);
});

test("rejects invalid commits, off-main commits and nonstable packages", async () => {
  await assert.rejects(planRelease("main"), /full release commit/);
  await assert.rejects(planRelease(undefined), /full release commit/);
  await assert.rejects(
    planRelease(commit, async () => failure()),
    /failed/
  );
  for (const manifest of [
    { name: "other", version: "0.5.0" },
    { name: "notcms", version: "0.5.0-rc.1" },
  ]) {
    await assert.rejects(
      planRelease(commit, async (_cmd, args) =>
        args[0] === "merge-base" ? ok() : ok(JSON.stringify(manifest))
      ),
      /stable notcms/
    );
  }
});

function fixture({ ref, existing, lookupFailure, failCreate = false } = {}) {
  const calls = [];
  const plan = { tag, commit, body: "### Patch Changes\n\n- Current\n" };
  let tagRef = ref;
  let release = existing;
  const run = async (command, args) => {
    calls.push([command, ...args]);
    if (command === "git")
      return ok(tagRef ? `${tagRef}\trefs/tags/${tag}\n` : "");
    if (args[1].endsWith(`/releases/tags/${tag}`)) {
      if (lookupFailure) return lookupFailure;
      return release
        ? ok(
            `HTTP/2.0 200 OK\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(release)}`
          )
        : {
            exitCode: 1,
            stdout: 'HTTP/2.0 404 Not Found\r\n\r\n{"message":"Not Found"}',
            stderr: "HTTP 404",
          };
    }
    if (args[1].endsWith("/git/refs")) {
      tagRef = commit;
      return ok("{}");
    }
    if (args[1] === `repos/${REPOSITORY}/releases`) {
      if (failCreate) {
        failCreate = false;
        return failure("temporary server error");
      }
      release = { tag_name: tag, draft: false, prerelease: false };
      return ok(JSON.stringify(release));
    }
    throw new Error("Unexpected command");
  };
  return { calls, plan, run };
}
const writes = (calls) => calls.filter((call) => call.includes("POST"));

test("creates only the staged version and is idempotent without npm approval", async () => {
  const { calls, plan, run } = fixture();
  assert.equal(await publishRelease(plan, run), "created");
  const posts = writes(calls);
  assert.equal(posts.length, 2);
  assert.ok(posts[0].includes(`sha=${commit}`));
  assert.ok(posts[1].includes(`body=${plan.body}`));
  assert.ok(posts[1].includes("make_latest=legacy"));
  assert.equal(await publishRelease(plan, run), "existing");
  assert.equal(writes(calls).length, 2);
  assert.ok(calls.every(([command]) => command === "git" || command === "gh"));
});

test("retries after tag creation without duplicating or moving the tag", async () => {
  const { calls, plan, run } = fixture({ failCreate: true });
  await assert.rejects(publishRelease(plan, run), /temporary server error/);
  assert.equal(await publishRelease(plan, run), "created");
  assert.equal(
    writes(calls).filter((call) => call[2].endsWith("/git/refs")).length,
    1
  );
});

test("preserves existing notes and assets and rejects conflicting tags", async () => {
  const existing = {
    tag_name: tag,
    draft: false,
    prerelease: false,
    body: "Edited notes",
    assets: [{ name: "asset.zip" }],
  };
  const f = fixture({ ref: commit, existing });
  assert.equal(await publishRelease(f.plan, f.run), "existing");
  assert.equal(writes(f.calls).length, 0);
  const conflict = fixture({ ref: "b".repeat(40) });
  await assert.rejects(
    publishRelease(conflict.plan, conflict.run),
    /refusing to move/
  );
  assert.equal(writes(conflict.calls).length, 0);
});

test("peels annotated tags when checking their release commit", async () => {
  const f = fixture({ ref: commit });
  const run = (command, args) =>
    command === "git"
      ? ok(
          `${"b".repeat(40)}\trefs/tags/${tag}\n${commit}\trefs/tags/${tag}^{}\n`
        )
      : f.run(command, args);
  assert.equal(await publishRelease(f.plan, run), "created");
  assert.equal(writes(f.calls).length, 1);
});

test("fails closed on invalid existing releases and API errors", async () => {
  for (const options of [
    { ref: commit, existing: { tag_name: tag, draft: true } },
    { ref: commit, existing: { tag_name: tag, prerelease: true } },
    { existing: { tag_name: tag, draft: false, prerelease: false } },
    { lookupFailure: failure("HTTP 401") },
    { lookupFailure: failure("connection reset") },
    {
      lookupFailure: {
        exitCode: 1,
        stdout: "HTTP/2.0 500 Internal Server Error\n\n{}",
        stderr: "server failure",
      },
    },
  ]) {
    const f = fixture(options);
    await assert.rejects(publishRelease(f.plan, f.run));
    assert.equal(writes(f.calls).length, 0);
  }
});

test("gates the lightweight release job on successful staging of this exact commit", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/publish.yml", import.meta.url),
    "utf8"
  );
  const release = workflow.slice(workflow.indexOf("\n  release:"));
  assert.match(
    workflow,
    /should_release: \$\{\{ steps.stage-decision.outputs.should_stage \}\}/
  );
  assert.match(release, /needs: stage/);
  assert.match(release, /needs.stage.result == 'success'/);
  assert.match(release, /needs.stage.outputs.should_release == 'true'/);
  assert.match(release, /github.repository == 'qqpann\/notcms'/);
  assert.match(release, /github.ref == 'refs\/heads\/main'/);
  assert.match(release, /ref: \$\{\{ github.sha \}\}/);
  assert.match(release, /contents: write/);
  assert.match(release, /persist-credentials: false/);
  assert.match(release, /run: node scripts\/sdk-github-releases.mjs publish/);
  assert.doesNotMatch(release, /id-token|pnpm|npm|--test|always\(\)/);
  assert.doesNotMatch(workflow, /schedule:|workflow_run:|workflow_dispatch:/);
  await assert.rejects(
    access(
      new URL("../.github/workflows/sdk-github-releases.yml", import.meta.url)
    ),
    { code: "ENOENT" }
  );
});
