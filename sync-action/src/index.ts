import * as core from "@actions/core";
import { handleOnChange } from "./git.js";
import { pull } from "./pull.js";

async function run(): Promise<void> {
  try {
    const direction = core.getInput("direction", { required: true });
    if (direction !== "pull") {
      core.setFailed(
        `Unsupported direction: "${direction}". v0.1 only supports "pull".`
      );
      return;
    }

    const workspaceId = core.getInput("workspace_id", { required: true });
    const secretKey = core.getInput("secret_key", { required: true });
    const filePath = core.getInput("file_path") || "content/{db}/{title}.md";
    const onChange = core.getInput("on_change") || "pr";
    const apiHost = core.getInput("api_host") || "https://api.notcms.com/v1";

    const validOnChange = ["commit", "pr", "pr-auto-merge"];
    if (!validOnChange.includes(onChange)) {
      core.setFailed(
        `Invalid on_change value: "${onChange}". Must be one of: ${validOnChange.join(", ")}`
      );
      return;
    }

    const result = await pull({
      apiHost,
      workspaceId,
      secretKey,
      filePath,
    });

    core.setOutput("files_changed", result.filesChanged);

    // Handle git operations
    const token = core.getInput("github_token");

    const onChangeResult = await handleOnChange(
      onChange,
      token,
      result.filesWritten
    );

    if (onChangeResult.pullRequestUrl) {
      core.setOutput("pull_request_url", onChangeResult.pullRequestUrl);
    }
  } catch (error) {
    core.setFailed(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

run();
