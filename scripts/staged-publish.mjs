import { spawn } from "node:child_process";
import { access, appendFile, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = resolve(SCRIPT_DIR, "..");
export const PACKAGE_JSON_PATH = "packages/notcms/package.json";
export const CHANGELOG_PATH = "packages/notcms/CHANGELOG.md";
export const PACKAGE_DIR = join(ROOT_DIR, "packages/notcms");
const VERSION_PATTERN =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const MIN_NODE_VERSION = [22, 14, 0];
const MIN_NPM_VERSION = [11, 15, 0];

export function runCommand(command, args, options = {}) {
  const { cwd = ROOT_DIR, env = process.env } = options;

  return new Promise((resolveResult, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (exitCode, signal) => {
      resolveResult({ exitCode: exitCode ?? 1, signal, stdout, stderr });
    });
  });
}

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isVersionAtLeast(version, minimum) {
  const parsed = parseVersion(version);
  if (!parsed) {
    return false;
  }

  for (let index = 0; index < minimum.length; index += 1) {
    if (parsed[index] > minimum[index]) {
      return true;
    }
    if (parsed[index] < minimum[index]) {
      return false;
    }
  }

  return true;
}

export function isSupportedNodeVersion(version) {
  return isVersionAtLeast(version, MIN_NODE_VERSION);
}

export function isSupportedNpmVersion(version) {
  return isVersionAtLeast(version, MIN_NPM_VERSION);
}

export function classifyStageFailure(output) {
  const text = output.toLowerCase();

  if (
    /\be409\b|\bconflict\b|already\s+(?:exists|published|staged)|cannot publish over (?:the )?previously published version|version .* already/.test(
      text
    )
  ) {
    return "duplicate-version";
  }
  if (/\be404\b|404\s+(?:not found|error)|not found/.test(text)) {
    return "registry-not-found";
  }
  if (
    /\be401\b|\be403\b|unauthori[sz]ed|forbidden|not authorized|trusted publisher|oidc|id-token/.test(
      text
    )
  ) {
    return "authentication";
  }
  if (
    /eai_again|enotfound|econnreset|econnrefused|etimedout|network|fetch failed|socket hang up/.test(
      text
    )
  ) {
    return "network";
  }

  return "unknown";
}

export function parsePublishedVersionOutput(output) {
  try {
    const value = JSON.parse(output.trim());
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

export function decidePublishedVersion({
  exitCode,
  stdout,
  stderr,
  expectedVersion,
}) {
  if (exitCode === 0) {
    const publishedVersion = parsePublishedVersionOutput(stdout);
    if (publishedVersion === expectedVersion) {
      return { action: "skip", reason: "already-published" };
    }
    return { action: "fail", category: "unknown" };
  }

  const output = `${stdout}\n${stderr}`;
  if (/\b(?:code|err_code)\s*[=:]?\s*e404\b/i.test(output)) {
    return { action: "stage", reason: "version-not-published" };
  }

  return { action: "fail", category: classifyStageFailure(output) };
}

export function parsePackDryRunOutput(output) {
  const start = output.indexOf("[");
  const end = output.lastIndexOf("]");
  if (start < 0 || end < start) {
    return null;
  }

  try {
    const value = JSON.parse(output.slice(start, end + 1));
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function normalizeManifestPath(value, field, requireDotSlash) {
  if (typeof value !== "string" || !value) {
    return null;
  }
  const normalizedSeparators = value.replaceAll("\\", "/");
  if (normalizedSeparators.startsWith("/")) {
    throw new Error(
      `Package manifest ${field} entry is not a relative package file: ${value}`
    );
  }
  if (requireDotSlash && !normalizedSeparators.startsWith("./")) {
    throw new Error(
      `Package manifest exports target must start with ./: ${value}`
    );
  }

  const pathParts = [];
  for (const part of normalizedSeparators.split("/")) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      if (pathParts.length === 0) {
        throw new Error(
          `Package manifest ${field} entry points outside the package: ${value}`
        );
      }
      pathParts.pop();
      continue;
    }
    pathParts.push(part);
  }
  if (pathParts.length === 0) {
    throw new Error(
      `Package manifest ${field} entry is not a local package file: ${value}`
    );
  }
  return pathParts.join("/");
}

function collectPackageFileField(value, field, paths) {
  if (typeof value === "string") {
    const path = normalizeManifestPath(value, field, false);
    if (path) {
      paths.add(path);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectPackageFileField(item, field, paths);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectPackageFileField(item, field, paths);
    }
  }
}

function collectExportsTargets(value, paths) {
  if (value === null || value === undefined) {
    return;
  }
  if (typeof value === "string") {
    const path = normalizeManifestPath(value, "exports", true);
    if (path) {
      paths.add(path);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectExportsTargets(item, paths);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectExportsTargets(item, paths);
    }
  }
}

export function collectManifestEntryPaths(packageJson) {
  const paths = new Set();
  for (const field of ["main", "module", "types", "bin"]) {
    collectPackageFileField(packageJson[field], field, paths);
  }
  collectExportsTargets(packageJson.exports, paths);
  return [...paths].sort();
}

export function findMissingManifestFiles(packageJson, packedPaths) {
  const packed =
    packedPaths instanceof Set ? packedPaths : new Set(packedPaths);
  return collectManifestEntryPaths(packageJson).filter(
    (path) => !packed.has(path)
  );
}

export function decideStage({
  hasChangesets,
  previousVersion,
  currentVersion,
  changedFiles,
}) {
  if (typeof hasChangesets !== "boolean") {
    throw new TypeError("hasChangesets must be a boolean");
  }
  if (hasChangesets) {
    return { shouldStage: false, reason: "changesets-present" };
  }
  if (
    typeof previousVersion !== "string" ||
    typeof currentVersion !== "string" ||
    !VERSION_PATTERN.test(previousVersion) ||
    !VERSION_PATTERN.test(currentVersion)
  ) {
    throw new TypeError("package versions must be valid semver values");
  }
  if (previousVersion === currentVersion) {
    return { shouldStage: false, reason: "no-version-change" };
  }

  const files = new Set(changedFiles);
  if (!files.has(PACKAGE_JSON_PATH)) {
    return { shouldStage: false, reason: "version-file-not-changed" };
  }
  if (!files.has(CHANGELOG_PATH)) {
    return { shouldStage: false, reason: "changelog-not-changed" };
  }

  return { shouldStage: true, reason: "version-changed" };
}

async function readPackageJson() {
  const contents = await readFile(join(ROOT_DIR, PACKAGE_JSON_PATH), "utf8");
  return JSON.parse(contents);
}

async function readPackageAtRevision(revision) {
  const result = await runCommand("git", [
    "show",
    `${revision}:${PACKAGE_JSON_PATH}`,
  ]);
  if (result.exitCode !== 0) {
    throw new Error(
      `Could not read ${PACKAGE_JSON_PATH} at ${revision}; fetch-depth must include the push base commit`
    );
  }

  return JSON.parse(result.stdout);
}

async function readChangedFiles(base, head) {
  const result = await runCommand("git", ["diff", "--name-only", base, head]);
  if (result.exitCode !== 0) {
    throw new Error(
      `Could not inspect changed files between ${base} and ${head}`
    );
  }

  return result.stdout
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
}

async function writeDecision(result) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    await appendFile(
      outputPath,
      `should_stage=${result.shouldStage}\nreason=${result.reason}\n`
    );
  }
  console.log(
    `Stage decision: ${result.shouldStage ? "stage" : "skip"} (${result.reason})`
  );
}

async function decideFromEnvironment() {
  const changesetsValue = process.env.CHANGESETS_HAS_CHANGESETS;
  if (changesetsValue !== "true" && changesetsValue !== "false") {
    throw new Error(
      `Unexpected Changesets output: ${changesetsValue ?? "missing"}; refusing to stage`
    );
  }

  const base = process.env.GITHUB_EVENT_BEFORE;
  if (!base || /^0+$/.test(base)) {
    await writeDecision({ shouldStage: false, reason: "no-before-commit" });
    return;
  }

  const head = process.env.GITHUB_SHA ?? "HEAD";
  const previousPackage = await readPackageAtRevision(base);
  const currentPackage = await readPackageJson();
  const changedFiles = await readChangedFiles(base, head);
  const result = decideStage({
    hasChangesets: changesetsValue === "true",
    previousVersion: previousPackage.version,
    currentVersion: currentPackage.version,
    changedFiles,
  });
  await writeDecision(result);
}

function redactOutput(output) {
  return output
    .replace(/(authToken\s*[=:]\s*)[^\s]+/gi, "$1[REDACTED]")
    .replace(/(bearer\s+)[^\s]+/gi, "$1[REDACTED]")
    .replace(/\bnpm_[A-Za-z0-9_-]{10,}/g, "[REDACTED]");
}

function summarizeOutput(output) {
  const lines = redactOutput(output)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.slice(-8).join(" | ").slice(0, 1200);
}

function stageFailureMessage(category) {
  switch (category) {
    case "duplicate-version":
      return "A staged or published package with this version may already exist. Inspect npm staged packages and approve or reject manually; this workflow does not treat a duplicate as success.";
    case "registry-not-found":
      return "The npm registry returned 404 while staging. Check the package name, registry endpoint, and trusted publisher configuration before retrying.";
    case "authentication":
      return "npm trusted publishing rejected this workflow. Check the owner, repository, publish.yml filename, optional environment, and id-token permission in the npm trusted publisher configuration.";
    case "network":
      return "The npm registry request failed due to a network or transport error. Retry only after checking the runner and registry status.";
    default:
      return "npm stage publish failed. Inspect the redacted npm output and resolve the failure before retrying.";
  }
}

async function checkToolchain() {
  if (!isSupportedNodeVersion(process.versions.node)) {
    throw new Error(
      `Node ${process.versions.node} is below the npm staged publishing requirement of 22.14.0`
    );
  }

  const result = await runCommand("npm", ["--version"]);
  if (result.exitCode !== 0) {
    throw new Error("Could not determine the npm CLI version");
  }
  const version = result.stdout.trim();
  if (!isSupportedNpmVersion(version)) {
    throw new Error(
      `npm ${version ?? "unknown"} is below the npm staged publishing requirement of 11.15.0`
    );
  }
  console.log(`Using Node ${process.versions.node} and npm ${version}`);
}

async function verifyPack() {
  const packageJson = await readPackageJson();
  if (packageJson.private === true) {
    throw new Error("Refusing to stage a private package");
  }
  for (const field of [
    "dependencies",
    "optionalDependencies",
    "peerDependencies",
  ]) {
    const dependencies = packageJson[field] ?? {};
    for (const [name, range] of Object.entries(dependencies)) {
      if (typeof range === "string" && range.startsWith("workspace:")) {
        throw new Error(
          `Refusing to stage ${packageJson.name}: ${field}.${name} still uses a workspace: range`
        );
      }
    }
  }
  await access(join(PACKAGE_DIR, "dist"));
  const result = await runCommand(
    "npm",
    ["pack", "--dry-run", "--json", "--ignore-scripts"],
    { cwd: PACKAGE_DIR }
  );
  if (result.exitCode !== 0) {
    throw new Error(
      `npm pack --dry-run failed: ${summarizeOutput(result.stderr)}`
    );
  }
  const packEntries = parsePackDryRunOutput(result.stdout);
  const packEntry = packEntries?.[0];
  if (
    !packEntry ||
    packEntry.name !== packageJson.name ||
    packEntry.version !== packageJson.version ||
    !Array.isArray(packEntry.files)
  ) {
    throw new Error(
      `npm pack --dry-run returned unexpected metadata for ${packageJson.name}@${packageJson.version}`
    );
  }
  const packedPaths = new Set(
    packEntry.files
      .filter((file) => file && typeof file.path === "string")
      .map((file) => file.path)
  );
  const missingManifestFiles = findMissingManifestFiles(
    packageJson,
    packedPaths
  );
  if (missingManifestFiles.length > 0) {
    throw new Error(
      `npm pack --dry-run omitted declared entrypoints for ${packageJson.name}@${packageJson.version}: ${missingManifestFiles.join(", ")}`
    );
  }
  if (
    [...packedPaths].some(
      (file) => file.startsWith("node_modules/") || file.startsWith(".env")
    )
  ) {
    throw new Error(
      "npm pack --dry-run included a forbidden dependency or environment file"
    );
  }
  console.log(
    `Verified npm pack --dry-run for ${packageJson.name}@${packageJson.version}`
  );
}

export async function stagePackage(options = {}) {
  const runner = options.run ?? runCommand;
  const env = options.env ?? process.env;
  if (env.NPM_TOKEN || env.NODE_AUTH_TOKEN) {
    throw new Error(
      "Refusing to stage with NPM_TOKEN or NODE_AUTH_TOKEN; this workflow requires npm trusted publishing via OIDC"
    );
  }

  const packageJson = options.packageJson ?? (await readPackageJson());
  const publishedVersionResult = await runner(
    "npm",
    ["view", `${packageJson.name}@${packageJson.version}`, "version", "--json"],
    { cwd: PACKAGE_DIR }
  );
  const lookupDecision = decidePublishedVersion({
    exitCode: publishedVersionResult.exitCode,
    stdout: publishedVersionResult.stdout,
    stderr: publishedVersionResult.stderr,
    expectedVersion: packageJson.version,
  });
  if (lookupDecision.action === "skip") {
    console.log(
      `${packageJson.name}@${packageJson.version} is already published on npm; skipping a duplicate stage attempt.`
    );
    return;
  }
  if (lookupDecision.action === "fail") {
    const lookupOutput = `${publishedVersionResult.stdout}\n${publishedVersionResult.stderr}`;
    const lookupCategory = lookupDecision.category;
    const details = summarizeOutput(lookupOutput);
    throw new Error(
      `${lookupCategory}: ${stageFailureMessage(lookupCategory)}${
        details ? ` Details: ${details}` : ""
      }`
    );
  }
  console.log(
    `${packageJson.name}@${packageJson.version} is not published on npm; continuing with staged publish`
  );

  const result = await runner("npm", ["stage", "publish", "--ignore-scripts"], {
    cwd: PACKAGE_DIR,
  });
  if (result.exitCode !== 0) {
    const output = `${result.stdout}\n${result.stderr}`;
    const category = classifyStageFailure(output);
    const details = summarizeOutput(output);
    throw new Error(
      `${category}: ${stageFailureMessage(category)}${details ? ` Details: ${details}` : ""}`
    );
  }

  console.log(
    "notcms was staged on npm. A maintainer must review and approve it manually; no approval, tag, or GitHub Release was created by this workflow."
  );
}

async function main() {
  switch (process.argv[2]) {
    case "check-toolchain":
      await checkToolchain();
      break;
    case "decide":
      await decideFromEnvironment();
      break;
    case "verify-pack":
      await verifyPack();
      break;
    case "stage":
      await checkToolchain();
      await stagePackage();
      break;
    default:
      throw new Error(
        "Usage: node scripts/staged-publish.mjs <check-toolchain|decide|verify-pack|stage>"
      );
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
