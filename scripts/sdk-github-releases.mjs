import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CHANGELOG_PATH,
  PACKAGE_JSON_PATH,
  runCommand,
} from "./staged-publish.mjs";

export const REPOSITORY = "qqpann/notcms";
const STABLE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const SHA = /^[a-f0-9]{40}$/;

export function releaseNotes(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const headings = [];
  let fence;
  for (const [index, line] of lines.entries()) {
    if (fence) {
      if (new RegExp(`^ {0,3}${fence[0]}{${fence.length},}\\s*$`).test(line))
        fence = undefined;
      continue;
    }
    const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (opening) {
      fence = opening[1];
      continue;
    }
    const heading = line.match(/^## (.+)$/);
    if (heading) headings.push({ index, version: heading[1].trim() });
  }
  const matches = headings.filter((heading) => heading.version === version);
  if (matches.length !== 1)
    throw new Error(`Expected one changelog section for ${version}`);
  const start = matches[0];
  const end = headings[headings.indexOf(start) + 1]?.index;
  const body = lines
    .slice(start.index + 1, end)
    .join("\n")
    .trim();
  if (
    !body ||
    !body.split("\n").some((line) => line.trim() && !/^#+ /.test(line))
  )
    throw new Error(`Empty changelog for ${version}`);
  return `${body}\n\n[npm: notcms@${version}](https://www.npmjs.com/package/notcms/v/${version})\n`;
}

async function checked(command, args, run) {
  const result = await run(command, args);
  if (result.exitCode !== 0)
    throw new Error(`${command} ${args[0]} failed: ${result.stderr}`);
  return result.stdout.trim();
}

// Read the original workflow commit, including on retries after main advances.
export async function planRelease(commit, run = runCommand) {
  if (!SHA.test(commit ?? ""))
    throw new Error("A full release commit SHA is required");
  await checked(
    "git",
    ["merge-base", "--is-ancestor", commit, "origin/main"],
    run
  );
  const manifest = JSON.parse(
    await checked("git", ["show", `${commit}:${PACKAGE_JSON_PATH}`], run)
  );
  if (manifest.name !== "notcms" || !STABLE.test(manifest.version))
    throw new Error("Expected a stable notcms package version");
  const changelog = await checked(
    "git",
    ["show", `${commit}:${CHANGELOG_PATH}`],
    run
  );
  return {
    tag: `notcms@${manifest.version}`,
    commit,
    body: releaseNotes(changelog, manifest.version),
  };
}

async function existingRelease(tag, run) {
  const result = await run("gh", [
    "api",
    `repos/${REPOSITORY}/releases/tags/${tag}`,
    "--include",
  ]);
  // Only an explicit HTTP 404 means absent; auth, transport and server errors fail.
  if (result.exitCode !== 0) {
    if (/^HTTP\/[\d.]+ 404\b/m.test(result.stdout)) return null;
    throw new Error(`GitHub release lookup failed: ${result.stderr}`);
  }
  const separator = result.stdout.match(/\r?\n\r?\n/);
  if (!separator) throw new Error("Missing GitHub response headers");
  return JSON.parse(result.stdout.slice(separator.index + separator[0].length));
}

async function remoteTagCommit(tag, run) {
  const refs = await checked(
    "git",
    [
      "ls-remote",
      "--tags",
      "origin",
      `refs/tags/${tag}`,
      `refs/tags/${tag}^{}`,
    ],
    run
  );
  const entries = refs
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(/\s+/));
  const ref =
    entries.find((entry) => entry[1] === `refs/tags/${tag}^{}`) ??
    entries.find((entry) => entry[1] === `refs/tags/${tag}`);
  return ref?.[0];
}

export async function publishRelease(plan, run = runCommand) {
  const ref = await remoteTagCommit(plan.tag, run);
  if (ref && ref !== plan.commit)
    throw new Error(
      `Tag ${plan.tag} does not match the staged commit; refusing to move it`
    );
  const existing = await existingRelease(plan.tag, run);
  if (existing) {
    if (
      !ref ||
      existing.tag_name !== plan.tag ||
      existing.draft ||
      existing.prerelease
    )
      throw new Error(`Review existing GitHub release ${plan.tag}`);
    return "existing"; // Preserve notes, assets and Latest selection on retries.
  }
  if (!ref) {
    await checked(
      "gh",
      [
        "api",
        `repos/${REPOSITORY}/git/refs`,
        "--method",
        "POST",
        "-f",
        `ref=refs/tags/${plan.tag}`,
        "-f",
        `sha=${plan.commit}`,
      ],
      run
    );
  }
  await checked(
    "gh",
    [
      "api",
      `repos/${REPOSITORY}/releases`,
      "--method",
      "POST",
      "-f",
      `tag_name=${plan.tag}`,
      "-f",
      `name=${plan.tag}`,
      "-f",
      `target_commitish=${plan.commit}`,
      "-f",
      `body=${plan.body}`,
      // Let GitHub consider semantic versions instead of forcing an old retry Latest.
      "-f",
      "make_latest=legacy",
    ],
    run
  );
  return "created";
}

async function main() {
  const mode = process.argv[2];
  if (!["plan", "publish"].includes(mode))
    throw new Error(
      "Usage: GITHUB_SHA=<release commit> node scripts/sdk-github-releases.mjs <plan|publish>"
    );
  if (
    process.env.GITHUB_REPOSITORY &&
    process.env.GITHUB_REPOSITORY !== REPOSITORY
  )
    throw new Error(`This workflow only manages ${REPOSITORY}`);
  const plan = await planRelease(process.env.GITHUB_SHA);
  if (mode === "plan") console.log(JSON.stringify(plan, null, 2));
  else console.log(`${plan.tag}: ${await publishRelease(plan)}`);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
