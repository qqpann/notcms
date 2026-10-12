import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  planReleases,
  publishRelease,
  publishedVersions,
  releaseNotes,
} from "./sdk-github-releases.mjs";
import { CHANGELOG_PATH, PACKAGE_JSON_PATH } from "./staged-publish.mjs";

const commit = "a".repeat(40);
const changelog = `# notcms

## 0.4.0
### Minor Changes
- New filters.

## 0.3.0
### Minor Changes
- Complete initialization.
### Patch Changes
- Fix output paths.

## 0.3.0-beta.1
### Minor Changes
- Prerelease-only entry.

## 0.2.0
### Minor Changes
- Browser login.
### Patch Changes
- Remove environment fallback.

## 0.1.0
### Minor Changes
- Old CLI.
`;

function registry(versions = ["0.1.0", "0.3.0"]) {
  return {
    name: "notcms",
    versions: Object.fromEntries(
      versions.map((version) => [
        version,
        {
          name: "notcms",
          version,
          gitHead: commit,
        },
      ])
    ),
    time: Object.fromEntries(
      versions.map((version) => [version, "2026-10-11T00:00:00Z"])
    ),
    "dist-tags": { latest: versions.at(-1) },
  };
}
const existing = [
  { tagName: "notcms@0.1.0", isDraft: false, isPrerelease: false },
];
function gitFixture({
  manifestVersion = "0.3.0",
  ancestor = true,
  notes = changelog,
} = {}) {
  return async (command, args) => {
    assert.equal(command, "git");
    if (args[0] === "merge-base")
      return { exitCode: ancestor ? 0 : 1, stdout: "", stderr: "not on main" };
    if (args[1] === `${commit}:${PACKAGE_JSON_PATH}`)
      return {
        exitCode: 0,
        stdout: JSON.stringify({ name: "notcms", version: manifestVersion }),
      };
    if (args[1] === `${commit}:${CHANGELOG_PATH}`)
      return { exitCode: 0, stdout: notes };
    throw new Error(`Unexpected git call: ${args}`);
  };
}

test("public stable npm versions define the release set, in numeric order", () => {
  assert.deepEqual(
    publishedVersions(
      registry(["0.10.0", "0.2.0", "0.3.0-beta.1", "0.0.12-development"])
    ).map((entry) => entry.version),
    ["0.2.0", "0.10.0"]
  );
});
test("invalid publication metadata is not accepted", () => {
  const data = registry();
  delete data.time["0.3.0"];
  assert.throws(() => publishedVersions(data), /Invalid published metadata/);
  assert.throws(() => publishedVersions({}), /Unexpected npm registry/);
});
test("skipped 0.2.0 changes are included once in npm 0.3.0", () => {
  const body = releaseNotes(changelog, "0.3.0", "0.1.0");
  assert.match(body, /Complete initialization/);
  assert.match(body, /Browser login/);
  assert.match(body, /Remove environment fallback/);
  assert.doesNotMatch(body, /New filters|Old CLI|Prerelease-only|## 0.2.0/);
  assert.equal(body.match(/### Minor Changes/g).length, 1);
  assert.equal(body.match(/Browser login/g).length, 1);
  assert.match(body, /https:\/\/www.npmjs.com\/package\/notcms\/v\/0.3.0/);
});
test("next published version excludes already released changes", () => {
  const body = releaseNotes(changelog, "0.4.0", "0.3.0");
  assert.match(body, /New filters/);
  assert.doesNotMatch(body, /Browser login|Complete initialization/);
});
test("missing, empty or ambiguous changelog fails instead of releasing empty notes", () => {
  assert.throws(
    () => releaseNotes(changelog, "0.5.0", "0.3.0"),
    /Missing changelog/
  );
  assert.throws(
    () => releaseNotes("## 0.4.0\n### Patch Changes\n", "0.4.0", "0.3.0"),
    /Empty changelog/
  );
  assert.throws(
    () => releaseNotes(`${changelog}\n## 0.3.0\ntext`, "0.3.0", "0.1.0"),
    /Duplicate/
  );
  assert.throws(
    () => releaseNotes("## 0.4.0\nmanual text", "0.4.0", "0.3.0"),
    /Unsupported/
  );
});
test("plan uses the npm commit even when main contains a newer unreleased version", async () => {
  const plans = await planReleases({
    registry: registry(),
    releases: existing,
    run: gitFixture(),
  });
  assert.equal(plans.length, 1);
  assert.equal(plans[0].version, "0.3.0");
  assert.equal(plans[0].commit, commit);
  assert.equal(plans[0].latest, true);
  assert.doesNotMatch(plans[0].body, /New filters/);
});
test("existing canonical and legacy releases are preserved without creating duplicates", async () => {
  const plans = await planReleases({
    registry: registry(["0.0.13", "0.1.0"]),
    releases: [{ tagName: "v0.0.13" }, ...existing],
    run: () => assert.fail("Existing releases require no git lookup"),
  });
  assert.deepEqual(plans, []);
});
test("staged or rejected versions absent from npm do not get a release", async () => {
  assert.deepEqual(
    await planReleases({ registry: registry(["0.1.0"]), releases: existing }),
    []
  );
});
test("a draft, prerelease or duplicate existing release requires manual review", async () => {
  for (const releases of [
    [{ ...existing[0], isDraft: true }],
    [{ ...existing[0], isPrerelease: true }],
    [...existing, { tagName: "v0.1.0" }],
  ]) {
    await assert.rejects(
      planReleases({ registry: registry(), releases }),
      /Review existing/
    );
  }
});
test("missing gitHead, unrelated commit and wrong manifest fail closed", async () => {
  const data = registry();
  delete data.versions["0.3.0"].gitHead;
  await assert.rejects(
    planReleases({ registry: data, releases: existing }),
    /no valid gitHead/
  );
  for (const options of [{ ancestor: false }, { manifestVersion: "0.4.0" }]) {
    await assert.rejects(
      planReleases({
        registry: registry(),
        releases: existing,
        run: gitFixture(options),
      })
    );
  }
});
test("backfills do not become latest unless npm latest points at that version", async () => {
  const data = registry();
  data["dist-tags"].latest = "0.1.0";
  const plans = await planReleases({
    registry: data,
    releases: existing,
    run: gitFixture(),
  });
  assert.equal(plans[0].latest, false);
});

const plan = {
  tag: "notcms@0.3.0",
  commit,
  body: "### Minor Changes\n\n- Login.\n",
  latest: true,
};
function publishFixture(refs = "", failRelease = false) {
  const calls = [];
  return {
    calls,
    run: async (command, args) => {
      calls.push([command, args]);
      if (command === "git") return { exitCode: 0, stdout: refs };
      if (args[0] === "release") {
        assert.equal(
          await readFile(args[args.indexOf("--notes-file") + 1], "utf8"),
          plan.body
        );
        return {
          exitCode: failRelease ? 1 : 0,
          stdout: "",
          stderr: "release failure",
        };
      }
      return { exitCode: 0, stdout: "" };
    },
  };
}
test("creates an exact commit tag then a release using that tag and the prepared notes", async () => {
  const fixture = publishFixture();
  await publishRelease(plan, fixture.run);
  assert.ok(fixture.calls[1][1].includes(`sha=${commit}`));
  assert.ok(fixture.calls[1][1].includes(`ref=refs/tags/${plan.tag}`));
  assert.ok(fixture.calls[2][1].includes("--verify-tag"));
  assert.ok(fixture.calls[2][1].includes("--latest=true"));
});
test("retry after tag creation reuses the existing matching tag", async () => {
  for (const refs of [
    `${commit}\trefs/tags/${plan.tag}`,
    `${"b".repeat(40)}\trefs/tags/${plan.tag}\n${commit}\trefs/tags/${plan.tag}^{}`,
  ]) {
    const fixture = publishFixture(refs);
    await publishRelease(plan, fixture.run);
    assert.equal(
      fixture.calls.filter(
        ([command, args]) => command === "gh" && args[0] === "api"
      ).length,
      0
    );
  }
});
test("conflicting immutable tag blocks all GitHub writes", async () => {
  const fixture = publishFixture(`${"b".repeat(40)}\trefs/tags/${plan.tag}`);
  await assert.rejects(publishRelease(plan, fixture.run), /refusing to move/);
  assert.equal(fixture.calls.length, 1);
});
test("release API errors propagate as failures", async () => {
  const fixture = publishFixture(`${commit}\trefs/tags/${plan.tag}`, true);
  await assert.rejects(publishRelease(plan, fixture.run), /release failure/);
});
