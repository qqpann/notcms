import chalk from "chalk";
import dedent from "dedent";
import { routes } from "../routes.js";

const DASHBOARD_URL = "https://dash.notcms.com/";

export async function fetchSchema(): Promise<string> {
  const { NOTCMS_SECRET_KEY, NOTCMS_WORKSPACE_ID } = process.env;
  if (!NOTCMS_SECRET_KEY || !NOTCMS_WORKSPACE_ID) {
    throw new Error(
      dedent`
      Both ${chalk.yellow.bold("NOTCMS_SECRET_KEY")} and ${chalk.yellow.bold("NOTCMS_WORKSPACE_ID")} must be set.

      ${chalk.bold("Got:")}
        NOTCMS_SECRET_KEY: ${NOTCMS_SECRET_KEY ? "(set)" : undefined}
        NOTCMS_WORKSPACE_ID: ${NOTCMS_WORKSPACE_ID}

      ${chalk.bold("Suggested action:")}
        1. Get your key and id from the dashboard.
          Visit ${chalk.blue(`<${DASHBOARD_URL}>`)}

        2. Set them in your environment variables, and make sure they are loaded.
          Example:
          ${chalk.blue("$ echo 'NOTCMS_SECRET=your_secret_key' >> .env")}
          ${chalk.blue("$ echo 'NOTCMS_WORKSPACE_ID=your_workspace_id' >> .env")}
          ${chalk.blue("$ source .env")}

        3. Run the command again.
          ${chalk.blue("$ npx notcms-kit pull")}
      `
    );
  }
  const res = await fetch(routes.schema(NOTCMS_WORKSPACE_ID), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NOTCMS_SECRET_KEY}`,
    },
  });
  const data = (await res.json()) as { schema: string };
  if (typeof data.schema !== "string") {
    throw new Error(
      `Invalid schema. Expected string, found ${typeof data.schema}.`
    );
  }

  return data.schema;
}
