import chalk from "chalk";
import dedent from "dedent";
import { PROPERTY_TYPES, type Properties, type Schema } from "../../types.js";
import { routes } from "../routes.js";
import type { Credentials } from "../types.js";

const DASHBOARD_URL = "https://dash.notcms.com/";

const PROPERTY_TYPE_SET: ReadonlySet<string> = new Set(PROPERTY_TYPES);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProperties(value: unknown): value is Properties {
  return (
    isPlainObject(value) &&
    Object.values(value).every(
      (type) => typeof type === "string" && PROPERTY_TYPE_SET.has(type)
    )
  );
}

function isSchemaEntry(entry: unknown): entry is Schema[string] {
  return (
    isPlainObject(entry) &&
    typeof entry.id === "string" &&
    isProperties(entry.properties)
  );
}

function isSchema(value: unknown): value is Schema {
  return isPlainObject(value) && Object.values(value).every(isSchemaEntry);
}
export async function fetchSchema(credentials?: Credentials): Promise<Schema> {
  const secretKey = credentials?.secretKey ?? process.env.NOTCMS_SECRET_KEY;
  const workspaceId =
    credentials?.workspaceId ?? process.env.NOTCMS_WORKSPACE_ID;
  if (!secretKey || !workspaceId) {
    throw new Error(
      dedent`
      Both ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} must be set.

      ${chalk.bold("Got:")}
        NOTCMS_WORKSPACE_ID: ${workspaceId ? chalk.green(workspaceId) : chalk.red(workspaceId)}
        NOTCMS_SECRET_KEY:   ${secretKey ? chalk.green("(set)") : chalk.red(secretKey)}

      ${chalk.bold("Suggested action:")}
        1. Get your key and id from the dashboard.
          Visit ${chalk.blue(`<${DASHBOARD_URL}>`)}

        2. Set them in your environment variables, and make sure they are loaded.
          Example:
          ${chalk.blue("$ echo 'NOTCMS_SECRET_KEY=your_secret_key' >> .env")}
          ${chalk.blue("$ echo 'NOTCMS_WORKSPACE_ID=your_workspace_id' >> .env")}
          ${chalk.blue("$ source .env")}

        3. Run the command again.
          ${chalk.blue("$ npx notcms pull")}
      `
    );
  }
  const res = await fetch(routes.schema(workspaceId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
  });
  try {
    if (!res.ok) {
      throw new Error(`Unexpected status ${res.status}`);
    }
    const data = (await res.json()) as { schema?: unknown };
    if (!isSchema(data.schema)) {
      throw new Error("Invalid schema payload.");
    }
    return data.schema;
  } catch (error) {
    throw new Error(
      dedent`
      Failed to fetch schema from NotCMS.

      ${chalk.bold("Got:")}
        ${res.status} ${res.statusText}

      ${chalk.bold("Suggested action:")}
        1. Check your key and id.
        2. Check your internet connection.
        3. Try again.
      `
    );
  }
}
