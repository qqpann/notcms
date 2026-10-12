import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CHANGELOG_PATH,
  PACKAGE_JSON_PATH,
  runCommand,
} from "./staged-publish.mjs";

export const REPOSITORY = "qqpann/notcms";
const STABLE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const SHA = /^[a-f0-9]{40}$/;

export function compareVersions(a, b) {
  for (let i = 0; i < 3; i++) {
    const difference = BigInt(a.split(".")[i]) - BigInt(b.split(".")[i]);
    if (difference !== 0n) return difference > 0n ? 1 : -1;
  }
  return 0;
}

export function publishedVersions(registry) {
  if (registry.name !== "notcms" || !registry.versions || !registry.time) {
    throw new Error("Unexpected npm registry metadata for notcms");
  }
  return Object.keys(registry.versions)
    .filter((version) => STABLE.test(version))
    .sort(compareVersions)
    .map((version) => {
      const metadata = registry.versions[version];
      const publishedAt = registry.time[version];
      if (
        metadata.name !== "notcms" ||
        metadata.version !== version ||
        !publishedAt ||
        !Number.isFinite(Date.parse(publishedAt))
      ) {
        throw new Error(`Invalid published metadata for notcms@${version}`);
      }
      return { version, gitHead: metadata.gitHead, publishedAt };
    });
}

// Include skipped npm versions in the next published version, without presenting
// them as separate releases. Only the changelog at the published commit is read.
export function releaseNotes(changelog, version, previousVersion) {
  const headings = [...changelog.matchAll(/^## ([^\n]+)$/gm)];
  const sections = new Map();
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    if (!STABLE.test(heading[1])) continue;
    if (sections.has(heading[1]))
      throw new Error("Duplicate changelog version");
    sections.set(
      heading[1],
      changelog
        .slice(heading.index + heading[0].length, headings[i + 1]?.index)
        .trim()
    );
  }
  if (!sections.get(version)) {
    throw new Error(`Missing changelog for ${version}; backfill manually`);
  }
  const selected = [...sections].filter(
    ([entry]) =>
      compareVersions(entry, version) <= 0 &&
      (!previousVersion || compareVersions(entry, previousVersion) > 0)
  );
  const groups = new Map();
  for (const [, section] of selected) {
    const categories = [...section.matchAll(/^### (.+)$/gm)];
    if (!categories.length || section.slice(0, categories[0].index).trim()) {
      throw new Error(`Unsupported changelog format for ${version}`);
    }
    for (let i = 0; i < categories.length; i++) {
      const heading = categories[i];
      const body = section
        .slice(heading.index + heading[0].length, categories[i + 1]?.index)
        .trim();
      if (body) {
        groups.set(heading[1], [...(groups.get(heading[1]) ?? []), body]);
      }
    }
  }
  if (!groups.size) throw new Error(`Empty changelog for ${version}`);
  const notes = [...groups]
    .map(([category, bodies]) => `### ${category}\n\n${bodies.join("\n\n")}`)
    .join("\n\n");
  return `${notes}\n\n[npm: notcms@${version}](https://www.npmjs.com/package/notcms/v/${version})\n`;
}

async function checked(command, args, run) {
  const result = await run(command, args);
  if (result.exitCode !== 0) {
    throw new Error(`${command} ${args[0]} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
}

export async function planReleases({ registry, releases, run = runCommand }) {
  const versions = publishedVersions(registry);
  const plans = [];
  for (let index = 0; index < versions.length; index++) {
    const { version, gitHead, publishedAt } = versions[index];
    const tag = `notcms@${version}`;
    const existing = releases.filter(
      (release) => release.tagName === tag || release.tagName === `v${version}`
    );
    if (existing.length) {
      if (
        existing.length > 1 ||
        existing[0].isDraft ||
        existing[0].isPrerelease
      ) {
        throw new Error(`Review existing GitHub releases for ${version}`);
      }
      continue; // Preserve existing release notes, assets and historical tags.
    }
    if (typeof gitHead !== "string" || !SHA.test(gitHead)) {
      throw new Error(`npm ${version} has no valid gitHead; backfill manually`);
    }
    await checked(
      "git",
      ["merge-base", "--is-ancestor", gitHead, "origin/main"],
      run
    );
    const manifest = JSON.parse(
      await checked("git", ["show", `${gitHead}:${PACKAGE_JSON_PATH}`], run)
    );
    if (manifest.name !== "notcms" || manifest.version !== version) {
      throw new Error(`npm gitHead does not match notcms@${version}`);
    }
    const changelog = await checked(
      "git",
      ["show", `${gitHead}:${CHANGELOG_PATH}`],
      run
    );
    const body = releaseNotes(changelog, version, versions[index - 1]?.version);
    plans.push({
      version,
      tag,
      commit: gitHead,
      publishedAt,
      body,
      latest: registry["dist-tags"]?.latest === version,
    });
  }
  return plans;
}

export async function publishRelease(plan, run = runCommand) {
  // Check the remote ref, including annotated tags, before creating a release.
  const refs = await checked(
    "git",
    [
      "ls-remote",
      "--tags",
      "origin",
      `refs/tags/${plan.tag}`,
      `refs/tags/${plan.tag}^{}`,
    ],
    run
  );
  const entries = refs
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(/\s+/));
  const ref =
    entries.find((entry) => entry[1] === `refs/tags/${plan.tag}^{}`) ??
    entries.find((entry) => entry[1] === `refs/tags/${plan.tag}`);
  if (ref && ref[0] !== plan.commit) {
    throw new Error(
      `Tag ${plan.tag} does not match npm gitHead; refusing to move it`
    );
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
  const directory = await mkdtemp(join(tmpdir(), "notcms-release-"));
  try {
    const notesPath = join(directory, "notes.md");
    await writeFile(notesPath, plan.body);
    await checked(
      "gh",
      [
        "release",
        "create",
        plan.tag,
        "--repo",
        REPOSITORY,
        "--verify-tag",
        "--title",
        plan.tag,
        "--notes-file",
        notesPath,
        `--latest=${plan.latest}`,
      ],
      run
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function main() {
  const mode = process.argv[2];
  if (!["plan", "publish"].includes(mode)) {
    throw new Error(
      "Usage: node scripts/sdk-github-releases.mjs <plan|publish>"
    );
  }
  if (
    process.env.GITHUB_REPOSITORY &&
    process.env.GITHUB_REPOSITORY !== REPOSITORY
  ) {
    throw new Error(`This workflow only manages ${REPOSITORY}`);
  }
  const response = await fetch("https://registry.npmjs.org/notcms", {
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`npm registry returned ${response.status}`);
  const registry = await response.json();
  const releases = JSON.parse(
    await checked(
      "gh",
      [
        "release",
        "list",
        "--repo",
        REPOSITORY,
        "--limit",
        "1000",
        "--json",
        "tagName,isDraft,isPrerelease",
      ],
      runCommand
    )
  );
  if (releases.length === 1000)
    throw new Error("Release list may be truncated");
  const plans = await planReleases({ registry, releases });
  if (mode === "plan") {
    console.log(JSON.stringify(plans, null, 2));
    return;
  }
  for (const plan of plans) {
    await publishRelease(plan);
    console.log(`Created ${plan.tag} from npm publication ${plan.publishedAt}`);
  }
  if (!plans.length)
    console.log("All npm stable versions already have GitHub Releases.");
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
