import { appendFile, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { runCommand } from "./staged-publish.mjs";

const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const RELEASE_PATHS = [
  "sync-action/src",
  "sync-action/action.yml",
  "sync-action/package.json",
  "sync-action/tsconfig.json",
  "pnpm-lock.yaml",
];

export function planRelease({
  version,
  latestVersion,
  tagged,
  changed,
  aliasMatches = true,
}) {
  if (!VERSION.test(version))
    throw new Error("Sync Action requires a stable version");
  const parts = version.split(".").map(Number);
  const compare = (a, b) => {
    const left = a.split(".").map(Number);
    const right = b.split(".").map(Number);
    for (let i = 0; i < 3; i++)
      if (left[i] !== right[i]) return left[i] - right[i];
    return 0;
  };
  if (latestVersion && compare(version, latestVersion) < 0) {
    throw new Error("Sync Action version is behind the latest release");
  }
  if (tagged && !changed) {
    return aliasMatches
      ? { action: "skip", version }
      : {
          action: "repair",
          version,
          versionTag: `sync-action@${version}`,
          majorTag: `v${parts[0]}`,
        };
  }
  if (tagged) parts[2] += 1;
  const nextVersion = parts.join(".");
  if (latestVersion && compare(nextVersion, latestVersion) <= 0) {
    throw new Error("Release version must be newer than existing tags");
  }
  return {
    action: tagged ? "prepare" : "publish",
    version: nextVersion,
    versionTag: `sync-action@${nextVersion}`,
    majorTag: `v${parts[0]}`,
  };
}

async function git(args, allowFailure = false) {
  const result = await runCommand("git", args);
  if (result.exitCode !== 0 && !allowFailure)
    throw new Error(result.stderr || "Git failed");
  return result;
}

export async function decide() {
  const pkg = JSON.parse(await readFile("sync-action/package.json", "utf8"));
  const tags = (await git(["tag", "--list", "sync-action@*"])).stdout
    .trim()
    .split("\n")
    .map((tag) => tag.replace("sync-action@", ""))
    .filter((version) => VERSION.test(version));
  tags.sort((a, b) => {
    const left = a.split(".").map(Number),
      right = b.split(".").map(Number);
    for (let i = 0; i < 3; i++)
      if (left[i] !== right[i]) return left[i] - right[i];
    return 0;
  });
  const tagged = tags.includes(pkg.version);
  const changed = tagged
    ? (
        await git(
          [
            "diff",
            "--quiet",
            `sync-action@${pkg.version}`,
            "HEAD",
            "--",
            ...RELEASE_PATHS,
          ],
          true
        )
      ).exitCode
    : 0;
  if (changed > 1) throw new Error("Could not compare release inputs");
  const releaseSha = tagged
    ? (
        await git([
          "rev-parse",
          `refs/tags/sync-action@${pkg.version}^{commit}`,
        ])
      ).stdout.trim()
    : (await git(["rev-parse", "HEAD"])).stdout.trim();
  const alias = await git(
    [
      "rev-parse",
      "--verify",
      `refs/tags/v${pkg.version.split(".")[0]}^{commit}`,
    ],
    true
  );
  const plan = planRelease({
    version: pkg.version,
    latestVersion: tags.at(-1),
    tagged,
    changed: changed === 1,
    aliasMatches: alias.exitCode === 0 && alias.stdout.trim() === releaseSha,
  });
  if (plan.action !== "skip")
    plan.releaseSha =
      plan.action === "repair"
        ? releaseSha
        : (await git(["rev-parse", "HEAD"])).stdout.trim();
  if (plan.action === "prepare") {
    pkg.version = plan.version;
    await writeFile(
      "sync-action/package.json",
      `${JSON.stringify(pkg, null, 2)}\n`
    );
  }
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      Object.entries(plan)
        .map(([key, value]) => `${key}=${value}\n`)
        .join("")
    );
  }
  return plan;
}

export async function publishTags(
  { versionTag, majorTag, head },
  command = runCommand
) {
  if (
    !/^sync-action@\d+\.\d+\.\d+$/.test(versionTag) ||
    !/^v\d+$/.test(majorTag) ||
    !/^[a-f0-9]{40}$/.test(head)
  ) {
    throw new Error("Invalid release tag or commit");
  }
  const refs = await command("git", [
    "ls-remote",
    "origin",
    `refs/tags/${versionTag}`,
    `refs/tags/${majorTag}`,
  ]);
  if (refs.exitCode !== 0)
    throw new Error("Could not read remote release tags");
  const existing = new Map(
    refs.stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [sha, ref] = line.split(/\s+/);
        return [ref, sha];
      })
  );
  const versionRef = `refs/tags/${versionTag}`,
    majorRef = `refs/tags/${majorTag}`;
  if (existing.has(versionRef) && existing.get(versionRef) !== head)
    throw new Error("Immutable release tag already exists at another commit");
  if (existing.get(versionRef) === head && existing.get(majorRef) === head)
    return;
  const args = [
    "push",
    "--atomic",
    "origin",
    `--force-with-lease=${majorRef}:${existing.get(majorRef) ?? ""}`,
  ];
  if (!existing.has(versionRef)) args.push(`${head}:${versionRef}`);
  args.push(`${head}:${majorRef}`);
  const pushed = await command("git", args);
  if (pushed.exitCode !== 0)
    throw new Error(pushed.stderr || "Atomic release tag push failed");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (process.argv[2] === "decide") console.log(JSON.stringify(await decide()));
  else if (process.argv[2] === "publish") {
    await publishTags({
      versionTag: process.env.VERSION_TAG,
      majorTag: process.env.MAJOR_TAG,
      head: process.env.RELEASE_SHA,
    });
  } else throw new Error("Expected decide or publish");
}
