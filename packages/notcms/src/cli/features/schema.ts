import chalk from "chalk";
import dedent from "dedent";
import { PROPERTY_TYPES, type Properties, type Schema } from "../../types.js";
import { routes } from "../routes.js";

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

export function isSchema(value: unknown): value is Schema {
  return isPlainObject(value) && Object.values(value).every(isSchemaEntry);
}
export async function fetchSchema(): Promise<Schema> {
  const { NOTCMS_SECRET_KEY, NOTCMS_WORKSPACE_ID } = process.env;
  if (!NOTCMS_SECRET_KEY || !NOTCMS_WORKSPACE_ID) {
    throw new Error(
      dedent`
      Both ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} must be set.

      ${chalk.bold("Got:")}
        NOTCMS_WORKSPACE_ID: ${NOTCMS_WORKSPACE_ID ? chalk.green(NOTCMS_WORKSPACE_ID) : chalk.red(NOTCMS_WORKSPACE_ID)}
        NOTCMS_SECRET_KEY:   ${NOTCMS_SECRET_KEY ? chalk.green("(set)") : chalk.red(NOTCMS_SECRET_KEY)}

      ${chalk.bold("Suggested action:")}
        1. Get your key and id from the dashboard.
          Visit ${chalk.blue(`<${DASHBOARD_URL}>`)}

        2. Set them in your environment variables, and make sure they are loaded.
          Example:
          ${chalk.blue("$ echo 'NOTCMS_SECRET=your_secret_key' >> .env")}
          ${chalk.blue("$ echo 'NOTCMS_WORKSPACE_ID=your_workspace_id' >> .env")}
          ${chalk.blue("$ source .env")}

        3. Run the command again.
          ${chalk.blue("$ npx notcms pull")}
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
