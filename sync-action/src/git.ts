import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";

// Note: @actions/exec.exec() is NOT child_process.exec().
// It uses spawn internally and is safe from shell injection.

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
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    },
  });
  return output.trim().length > 0;
}

async function commitChanges(
  contentDir: string,
  message: string
): Promise<void> {
  await exec.exec("git", ["add", contentDir]);
  await exec.exec("git", ["commit", "-m", message]);
}

async function pushToBranch(branch: string): Promise<void> {
  // Push to remote branch without switching the local working tree
  await exec.exec("git", ["push", "origin", `HEAD:refs/heads/${branch}`]);
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
    base: github.context.payload.repository?.default_branch ?? "main",
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
  contentDir: string,
  filesChanged: number
): Promise<OnChangeResult> {
  if (filesChanged === 0) {
    core.info("No changes detected, skipping git operations");
    return {};
  }

  await configureGit();
  await commitChanges(contentDir, "chore: sync content from NotCMS");

  if (mode === "commit") {
    await exec.exec("git", ["push"]);
    core.info("Changes committed and pushed directly");
    return {};
  }

  // PR modes
  const timestamp = Date.now();
  const branch = `notcms/sync-${timestamp}`;
  await pushToBranch(branch);

  const prUrl = await createPr(
    token,
    branch,
    "chore: sync content from NotCMS",
    [
      "## Summary",
      "",
      `Synced ${filesChanged} file(s) from NotCMS.`,
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
