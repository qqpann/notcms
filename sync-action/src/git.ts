import fs from "node:fs/promises";
import path from "node:path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import {
  hasMeaningfulMarkdownChange,
  readNotCmsMetadata,
} from "./markdown/content.js";

// Note: @actions/exec.exec() is NOT child_process.exec().
// It uses spawn internally and is safe from shell injection.

const SYNC_COMMIT_MESSAGE = "chore(notcms): sync content";
const SYNC_PR_TITLE = "chore(notcms): sync content";
const LEGACY_SYNC_PR_TITLE = "chore: sync content from NotCMS";
const SYNC_BRANCH_PREFIX = "notcms/sync-";

interface SyncPullRequest {
  number: number;
  url: string;
  branch: string;
}

interface GeneratedFile {
  path: string;
  content: string;
}

export async function configureGit(): Promise<void> {
  await exec.exec("git", ["config", "user.name", "github-actions[bot]"]);
  await exec.exec("git", [
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com",
  ]);
}

export async function hasChanges(): Promise<boolean> {
  let output = "";
  await exec.exec("git", ["status", "--porcelain"], {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    },
  });
  return output.trim().length > 0;
}

async function commitChanges(files: string[], message: string): Promise<void> {
  await exec.exec("git", ["add", "--", ...files]);
  await exec.exec("git", ["commit", "-m", message]);
}

async function pushToBranch(branch: string): Promise<void> {
  // Push to remote branch without switching the local working tree
  await exec.exec("git", ["push", "origin", `HEAD:refs/heads/${branch}`]);
}

function defaultBranch(): string {
  return github.context.payload.repository?.default_branch ?? "main";
}

interface PullRequestSummary {
  title: string;
  number: number;
  html_url: string;
  head: { ref: string; repo: { full_name: string } | null };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isPullRequestSummary(value: unknown): value is PullRequestSummary {
  if (!isRecord(value) || !isRecord(value.head)) return false;
  return (
    typeof value.title === "string" &&
    typeof value.number === "number" &&
    Number.isSafeInteger(value.number) &&
    value.number > 0 &&
    typeof value.html_url === "string" &&
    typeof value.head.ref === "string" &&
    (value.head.repo === null ||
      (isRecord(value.head.repo) &&
        typeof value.head.repo.full_name === "string"))
  );
}

async function findOpenSyncPr(token: string): Promise<SyncPullRequest | null> {
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;
  const repositoryFullName = `${owner}/${repo}`;

  const response = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    base: defaultBranch(),
    sort: "updated",
    direction: "desc",
    per_page: 100,
  });

  const prs: unknown = response.data;
  if (!Array.isArray(prs)) throw new Error("Invalid GitHub pull request list");
  const pr = prs.find(
    (candidate: unknown): candidate is PullRequestSummary =>
      isPullRequestSummary(candidate) &&
      [SYNC_PR_TITLE, LEGACY_SYNC_PR_TITLE].includes(candidate.title) &&
      candidate.head.repo?.full_name === repositoryFullName &&
      candidate.head.ref.startsWith(SYNC_BRANCH_PREFIX)
  );

  if (!pr) {
    return null;
  }

  return {
    number: pr.number,
    url: pr.html_url,
    branch: pr.head.ref,
  };
}

async function fetchBranch(branch: string): Promise<string> {
  const remoteRef = `refs/remotes/origin/${branch}`;
  await exec.exec("git", [
    "fetch",
    "origin",
    `+refs/heads/${branch}:${remoteRef}`,
  ]);
  return remoteRef;
}

async function gitBlobId(ref: string, file: string): Promise<string | null> {
  let output = "";
  const exitCode = await exec.exec("git", ["ls-tree", "-z", ref, "--", file], {
    ignoreReturnCode: true,
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    },
  });

  if (exitCode !== 0) {
    throw new Error(`Failed to inspect ${file} in ${ref}`);
  }

  const entry = output.split("\0").find(Boolean);
  const match = entry?.match(/\bblob ([0-9a-f]{40,64})\t/);
  return match?.[1] ?? null;
}

async function readGitBlob(blobId: string): Promise<Buffer> {
  const chunks: Buffer[] = [];
  await exec.exec("git", ["cat-file", "-p", blobId], {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        chunks.push(data);
      },
    },
  });
  return Buffer.concat(chunks);
}

async function readGitFile(ref: string, file: string): Promise<string | null> {
  const blobId = await gitBlobId(ref, file);
  if (!blobId) {
    return null;
  }

  return (await readGitBlob(blobId)).toString("utf-8");
}

async function listChangedFiles(
  baseRef: string,
  headRef: string
): Promise<string[]> {
  const chunks: Buffer[] = [];
  await exec.exec("git", ["diff", "--name-only", "-z", baseRef, headRef], {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        chunks.push(data);
      },
    },
  });

  return Buffer.concat(chunks).toString("utf-8").split("\0").filter(Boolean);
}

async function hasDiffAgainstRef(
  ref: string,
  files: string[]
): Promise<boolean> {
  for (const file of files) {
    const refContent = await readGitFile(ref, file);
    if (refContent == null) {
      return true;
    }

    const currentContent = await fs.readFile(file, "utf-8");

    if (hasMeaningfulMarkdownChange(refContent, currentContent)) {
      return true;
    }
  }

  return false;
}

export async function findStaleSyncFiles(
  baseRef: string,
  headRef: string,
  generatedFiles: string[],
  generatedNotCmsIds: string[],
  seenNotCmsIds: string[]
): Promise<string[]> {
  const generatedFileSet = new Set(generatedFiles);
  const generatedIdSet = new Set(generatedNotCmsIds);
  const seenIdSet = new Set(seenNotCmsIds);
  const changedFiles = await listChangedFiles(baseRef, headRef);
  const staleFiles: string[] = [];

  for (const file of changedFiles) {
    if (generatedFileSet.has(file)) {
      continue;
    }

    const content = await readGitFile(headRef, file);
    if (content == null) {
      continue;
    }

    const metadata = readNotCmsMetadata(content);
    if (!metadata) {
      continue;
    }

    if (!seenIdSet.has(metadata.id) || generatedIdSet.has(metadata.id)) {
      staleFiles.push(file);
    }
  }

  return staleFiles;
}

async function readGeneratedFiles(files: string[]): Promise<GeneratedFile[]> {
  return Promise.all(
    files.map(async (file) => ({
      path: file,
      content: await fs.readFile(file, "utf-8"),
    }))
  );
}

async function restoreCleanWorktree(files: string[]): Promise<void> {
  const trackedFiles: string[] = [];

  for (const file of files) {
    if (await gitBlobId("HEAD", file)) {
      trackedFiles.push(file);
    } else {
      await fs.rm(file, { force: true });
    }
  }

  if (trackedFiles.length > 0) {
    await exec.exec("git", ["checkout", "--", ...trackedFiles]);
  }
}

async function checkoutBranchWithGeneratedChanges(
  branch: string,
  ref: string,
  generatedFiles: string[],
  staleFiles: string[]
): Promise<void> {
  const generatedFileContents = await readGeneratedFiles(generatedFiles);
  await restoreCleanWorktree(generatedFiles);
  await exec.exec("git", ["checkout", "-B", branch, ref]);

  for (const file of staleFiles) {
    await fs.rm(file, { force: true });
  }

  for (const file of generatedFileContents) {
    await fs.mkdir(path.dirname(file.path), { recursive: true });
    await fs.writeFile(file.path, file.content);
  }
}

async function createPr(
  token: string,
  branch: string,
  title: string,
  body: string
): Promise<string> {
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;

  const { data: pr } = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    body,
    head: branch,
    base: defaultBranch(),
  });

  return pr.html_url;
}

async function enableAutoMerge(token: string, prUrl: string): Promise<void> {
  const octokit = github.getOctokit(token);

  // Extract PR number from URL
  const prNumber = Number.parseInt(prUrl.split("/").pop() ?? "", 10);
  if (isNaN(prNumber)) return;

  // Get PR node ID for GraphQL
  const { owner, repo } = github.context.repo;
  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  try {
    await octokit.graphql(
      `mutation($pullRequestId: ID!) {
        enablePullRequestAutoMerge(input: { pullRequestId: $pullRequestId, mergeMethod: SQUASH }) {
          pullRequest { id }
        }
      }`,
      { pullRequestId: pr.node_id }
    );
    core.info("Auto-merge enabled for PR");
  } catch (error) {
    core.warning(
      `Failed to enable auto-merge (is it enabled in repo settings?): ${error}`
    );
  }
}

export interface OnChangeResult {
  pullRequestUrl?: string;
}

export async function handleOnChange(
  mode: string,
  token: string,
  filesWritten: string[],
  filesGenerated: string[] = filesWritten,
  generatedNotCmsIds: string[] = [],
  seenNotCmsIds: string[] | null = null
): Promise<OnChangeResult> {
  if (filesWritten.length === 0 && mode === "commit") {
    core.info("No changes detected, skipping git operations");
    return {};
  }

  await configureGit();

  if (mode === "commit") {
    await commitChanges(filesWritten, SYNC_COMMIT_MESSAGE);
    await exec.exec("git", ["push"]);
    core.info("Changes committed and pushed directly");
    return {};
  }

  // PR modes
  const existingPr = await findOpenSyncPr(token);

  if (existingPr) {
    core.info(
      `Found existing sync PR #${existingPr.number}: ${existingPr.url}`
    );

    const existingPrRef = await fetchBranch(existingPr.branch);
    const filesToCompare = filesGenerated;
    const staleFiles =
      seenNotCmsIds == null
        ? []
        : await findStaleSyncFiles(
            await fetchBranch(defaultBranch()),
            existingPrRef,
            filesToCompare,
            generatedNotCmsIds,
            seenNotCmsIds
          );

    if (
      staleFiles.length === 0 &&
      !(await hasDiffAgainstRef(existingPrRef, filesToCompare))
    ) {
      core.info("Existing sync PR already matches generated content; skipping");
      return { pullRequestUrl: existingPr.url };
    }

    await checkoutBranchWithGeneratedChanges(
      existingPr.branch,
      existingPrRef,
      filesToCompare,
      staleFiles
    );
    await commitChanges(
      [...filesToCompare, ...staleFiles],
      SYNC_COMMIT_MESSAGE
    );
    await pushToBranch(existingPr.branch);

    core.info(`Pull request updated: ${existingPr.url}`);

    if (mode === "pr-auto-merge") {
      await enableAutoMerge(token, existingPr.url);
    }

    return { pullRequestUrl: existingPr.url };
  }

  if (filesWritten.length === 0) {
    core.info("No changes detected, skipping git operations");
    return {};
  }

  const timestamp = Date.now();
  const branch = `notcms/sync-${timestamp}`;
  await commitChanges(filesWritten, SYNC_COMMIT_MESSAGE);
  await pushToBranch(branch);

  const prUrl = await createPr(
    token,
    branch,
    SYNC_PR_TITLE,
    [
      "## Summary",
      "",
      `Synced ${filesWritten.length} file(s) from NotCMS.`,
      "",
      "This PR was automatically created by the [NotCMS Sync Action](https://github.com/qqpann/notcms/tree/main/sync-action).",
    ].join("\n")
  );

  core.info(`Pull request created: ${prUrl}`);

  if (mode === "pr-auto-merge") {
    await enableAutoMerge(token, prUrl);
  }

  return { pullRequestUrl: prUrl };
}
