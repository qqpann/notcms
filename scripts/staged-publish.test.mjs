import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CHANGELOG_PATH,
  PACKAGE_JSON_PATH,
  classifyStageFailure,
  collectManifestEntryPaths,
  decidePublishedVersion,
  decideStage,
  findMissingManifestFiles,
  isSupportedNodeVersion,
  isSupportedNpmVersion,
  parsePackDryRunOutput,
  parsePublishedVersionOutput,
  stagePackage,
} from "./staged-publish.mjs";

test("does not stage while the Changesets version PR is pending", () => {
  assert.deepEqual(
    decideStage({
      hasChangesets: true,
      previousVersion: "0.2.0",
      currentVersion: "0.2.0",
      changedFiles: [],
    }),
    { shouldStage: false, reason: "changesets-present" }
  );
});

test("stages only a version commit that also updates the changelog", () => {
  assert.deepEqual(
    decideStage({
      hasChangesets: false,
      previousVersion: "0.2.0",
      currentVersion: "0.2.1",
      changedFiles: [PACKAGE_JSON_PATH, CHANGELOG_PATH],
    }),
    { shouldStage: true, reason: "version-changed" }
  );
  assert.deepEqual(
    decideStage({
      hasChangesets: false,
      previousVersion: "0.2.0",
      currentVersion: "0.2.1",
      changedFiles: [PACKAGE_JSON_PATH],
    }),
    { shouldStage: false, reason: "changelog-not-changed" }
  );
});

test("skips ordinary pushes after the release version was already staged", () => {
  assert.deepEqual(
    decideStage({
      hasChangesets: false,
      previousVersion: "0.2.1",
      currentVersion: "0.2.1",
      changedFiles: [],
    }),
    { shouldStage: false, reason: "no-version-change" }
  );
});

test("requires supported Node and npm versions", () => {
  assert.equal(isSupportedNodeVersion("22.13.0"), false);
  assert.equal(isSupportedNodeVersion("22.14.0"), true);
  assert.equal(isSupportedNpmVersion("11.14.0"), false);
  assert.equal(isSupportedNpmVersion("11.15.0"), true);
  assert.equal(isSupportedNpmVersion("12.0.0"), true);
});

test("classifies staging failures without treating them as success", () => {
  assert.equal(
    classifyStageFailure("E409 version already exists"),
    "duplicate-version"
  );
  assert.equal(classifyStageFailure("E404 Not Found"), "registry-not-found");
  assert.equal(
    classifyStageFailure("E403 trusted publisher is not authorized"),
    "authentication"
  );
  assert.equal(classifyStageFailure("EAI_AGAIN registry.npmjs.org"), "network");
  assert.equal(classifyStageFailure("unexpected npm failure"), "unknown");
});

test("parses the read-only npm view result used to skip an already published version", () => {
  assert.equal(parsePublishedVersionOutput('"0.2.1"\n'), "0.2.1");
  assert.equal(parsePublishedVersionOutput("not-json"), null);
});

test("continues only for the expected E404 from the published-version lookup", () => {
  assert.deepEqual(
    decidePublishedVersion({
      exitCode: 1,
      stdout: "",
      stderr: "npm error code E404\nnpm error 404 No match found for version",
      expectedVersion: "0.2.1",
    }),
    { action: "stage", reason: "version-not-published" }
  );
  assert.deepEqual(
    decidePublishedVersion({
      exitCode: 1,
      stdout: "",
      stderr: "npm error code E401\nnpm error Unable to authenticate",
      expectedVersion: "0.2.1",
    }),
    { action: "fail", category: "authentication" }
  );
  assert.deepEqual(
    decidePublishedVersion({
      exitCode: 1,
      stdout: "",
      stderr: "npm error code EAI_AGAIN\nnpm error fetch failed",
      expectedVersion: "0.2.1",
    }),
    { action: "fail", category: "network" }
  );
});

test("parses npm pack metadata for the built entrypoints", () => {
  const packageJson = {
    main: "dist/index.cjs",
    module: "dist/index.js",
    types: "dist/index.d.ts",
    bin: { notcms: "dist/cli.cjs" },
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        require: "./dist/index.cjs",
      },
    },
  };
  const entries = parsePackDryRunOutput(
    JSON.stringify([
      {
        name: "notcms",
        version: "0.2.1",
        files: [
          { path: "dist/cli.cjs" },
          { path: "dist/index.cjs" },
          { path: "dist/index.d.ts" },
          { path: "dist/index.js" },
        ],
      },
    ])
  );
  assert.equal(entries?.[0]?.name, "notcms");
  assert.deepEqual(collectManifestEntryPaths(packageJson), [
    "dist/cli.cjs",
    "dist/index.cjs",
    "dist/index.d.ts",
    "dist/index.js",
  ]);
  assert.deepEqual(
    findMissingManifestFiles(
      packageJson,
      new Set(entries?.[0]?.files.map(({ path }) => path))
    ),
    []
  );
  assert.deepEqual(
    findMissingManifestFiles(
      packageJson,
      new Set(["dist/index.cjs", "dist/index.js"])
    ),
    ["dist/cli.cjs", "dist/index.d.ts"]
  );
  assert.throws(
    () =>
      collectManifestEntryPaths({
        exports: { ".": "dist/index.js" },
      }),
    /exports target must start with \./
  );
  assert.equal(parsePackDryRunOutput("npm error: invalid output"), null);
});

test("checks declaration files referenced by conditional exports", () => {
  const packageJson = {
    types: "./dist/index.d.cts",
    exports: { ".": { types: "./dist/index.d.cts" } },
  };

  assert.deepEqual(collectManifestEntryPaths(packageJson), [
    "dist/index.d.cts",
  ]);
  assert.deepEqual(findMissingManifestFiles(packageJson, new Set()), [
    "dist/index.d.cts",
  ]);
});

test("keeps the stage job dependency-free until its pure release decision", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/publish.yml", import.meta.url),
    "utf8"
  );
  const stageJob = workflow.slice(workflow.indexOf("\n  stage:"));
  const decisionIndex = stageJob.indexOf(
    "run: node scripts/staged-publish.mjs decide"
  );
  const setupIndex = stageJob.indexOf("uses: pnpm/action-setup@v6");
  const installIndex = stageJob.indexOf("run: pnpm install");

  assert.ok(decisionIndex >= 0);
  assert.ok(setupIndex > decisionIndex);
  assert.ok(installIndex > setupIndex);
  assert.match(
    stageJob,
    /if: steps\.stage-decision\.outputs\.should_stage == 'true'\n\s+run: pnpm install --frozen-lockfile --ignore-scripts/
  );
  assert.doesNotMatch(stageJob, /cache: ['"]pnpm['"]/);
  assert.doesNotMatch(stageJob, /NPM_TOKEN/);
  assert.doesNotMatch(stageJob, /npm publish/);
});

test("keeps npm stage behind the read-only lookup and never calls approve or regular publish", async () => {
  const packageJson = { name: "notcms", version: "0.2.1" };
  const calls = [];
  const run = async (command, args) => {
    calls.push({ command, args });
    if (args[0] === "view") {
      return {
        exitCode: 1,
        stdout: "",
        stderr: "npm error code E404\nnpm error 404 No match found for version",
      };
    }
    return { exitCode: 0, stdout: "", stderr: "" };
  };

  await stagePackage({ env: {}, packageJson, run });

  assert.deepEqual(
    calls.map(({ command, args }) => [command, ...args]),
    [
      ["npm", "view", "notcms@0.2.1", "version", "--json"],
      ["npm", "stage", "publish", "--ignore-scripts"],
    ]
  );
  assert.equal(
    calls.some(({ args }) => args[0] === "approve"),
    false
  );
  assert.equal(
    calls.some(({ args }) => args[0] === "publish"),
    false,
    "regular npm publish must never be used as a fallback"
  );
});

test("does not stage an already published version", async () => {
  const calls = [];
  const run = async (command, args) => {
    calls.push({ command, args });
    return { exitCode: 0, stdout: '"0.2.1"\n', stderr: "" };
  };

  await stagePackage({
    env: {},
    packageJson: { name: "notcms", version: "0.2.1" },
    run,
  });

  assert.deepEqual(
    calls.map(({ args }) => args[0]),
    ["view"]
  );
});

test("does not stage after an authentication or network lookup failure", async () => {
  for (const stderr of [
    "npm error code E401\nnpm error Unable to authenticate",
    "npm error code EAI_AGAIN\nnpm error fetch failed",
  ]) {
    const calls = [];
    const run = async (command, args) => {
      calls.push({ command, args });
      return { exitCode: 1, stdout: "", stderr };
    };

    await assert.rejects(
      stagePackage({
        env: {},
        packageJson: { name: "notcms", version: "0.2.1" },
        run,
      })
    );
    assert.deepEqual(
      calls.map(({ args }) => args[0]),
      ["view"]
    );
  }
});

test("rejects legacy tokens before any registry request", async () => {
  for (const key of ["NPM_TOKEN", "NODE_AUTH_TOKEN"]) {
    let called = false;
    await assert.rejects(
      stagePackage({
        env: { [key]: "fixture-token" },
        run: async () => {
          called = true;
          throw new Error("must not run");
        },
      }),
      /Refusing to stage/
    );
    assert.equal(called, false);
  }
});

test("fails after a rejected stage without approving or falling back to publish", async () => {
  for (const [output, category] of [
    ["E409 version already staged", "duplicate-version"],
    ["E404 Not Found", "registry-not-found"],
    ["E403 trusted publisher is not authorized", "authentication"],
    ["ETIMEDOUT socket hang up", "network"],
    ["unexpected failure", "unknown"],
  ]) {
    const calls = [];
    const run = async (command, args) => {
      calls.push([command, ...args]);
      return args[0] === "view"
        ? { exitCode: 1, stdout: "", stderr: "npm error code E404" }
        : { exitCode: 1, stdout: "", stderr: output };
    };
    await assert.rejects(
      stagePackage({
        env: {},
        packageJson: { name: "notcms", version: "0.3.0" },
        run,
      }),
      { message: new RegExp(`^${category}:`) }
    );
    assert.deepEqual(calls, [
      ["npm", "view", "notcms@0.3.0", "version", "--json"],
      ["npm", "stage", "publish", "--ignore-scripts"],
    ]);
  }
});

test("redacts npm authentication data in stage failure messages", async () => {
  const token = "npm_fixture_token_12345";
  const run = async (_command, args) =>
    args[0] === "view"
      ? { exitCode: 1, stdout: "", stderr: "npm error code E404" }
      : {
          exitCode: 1,
          stdout: "",
          stderr: `E403 authToken=${token} Bearer ${token}`,
        };
  await assert.rejects(
    stagePackage({
      env: {},
      packageJson: { name: "notcms", version: "0.3.0" },
      run,
    }),
    (error) => {
      assert.ok(!error.message.includes(token));
      assert.match(error.message, /\[REDACTED\]/);
      return true;
    }
  );
});
