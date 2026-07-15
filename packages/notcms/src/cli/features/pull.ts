import { promises as fs } from "node:fs";
import path from "node:path";
import type { Schema } from "../../types.js";
import type { Credentials } from "../types.js";
import { loadConfig } from "./config.js";
import { fetchSchema } from "./schema.js";

export type PullSchemaOptions = {
  check?: boolean;
  credentials?: Credentials;
};

type WrittenSchemaResult = {
  status: "written";
  schemaPath: string;
  firstDatabaseName: string | null;
};

type UpToDateSchemaResult = {
  status: "up-to-date";
  schemaPath: string;
  firstDatabaseName: string | null;
};

type StaleSchemaResult = {
  status: "stale";
  schemaPath: string;
  reason: "missing" | "out-of-date";
};

export type PullSchemaResult =
  | WrittenSchemaResult
  | UpToDateSchemaResult
  | StaleSchemaResult;

/**
 * Fetch the workspace schema and either write it locally or compare it with
 * the existing file. Newly minted credentials can be passed directly; normal
 * `pull` calls continue to use credentials loaded into the environment.
 */
export async function pullSchema(
  options: PullSchemaOptions = {}
): Promise<PullSchemaResult> {
  const config = await loadConfig("notcms.config.json");
  const schemaPath = config.schema;
  const absoluteSchemaPath = path.resolve(schemaPath);
  const schema = await fetchSchema(options.credentials);
  const content = createSchemaModule(schema);
  const firstDatabaseName = Object.keys(schema)[0] ?? null;

  if (options.check) {
    const existing = await fs
      .readFile(absoluteSchemaPath, "utf-8")
      .catch(() => null);
    if (existing === content) {
      return { status: "up-to-date", schemaPath, firstDatabaseName };
    }
    return {
      status: "stale",
      schemaPath,
      reason: existing === null ? "missing" : "out-of-date",
    };
  }

  await fs.mkdir(path.dirname(absoluteSchemaPath), { recursive: true });
  await fs.writeFile(absoluteSchemaPath, content);

  return { status: "written", schemaPath, firstDatabaseName };
}

function createSchemaModule(schema: Schema): string {
  // The schema JSON has a different indentation level from the imports, so a
  // template literal is clearer than dedenting the generated module.
  return `
import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = ${serializeSchemaAsObjectLiteral(schema)} satisfies Schema;
export const nc = new Client({ schema });
  `.trim();
}

/**
 * JSON is almost a valid TypeScript object literal, except that a `__proto__`
 * property followed by `:` changes an object's prototype instead of defining
 * an own property. Computed syntax preserves the exact database/property name
 * while retaining the generated schema's literal types.
 */
function serializeSchemaAsObjectLiteral(schema: Schema): string {
  return JSON.stringify(schema, null, 2).replace(
    /^(\s*)"__proto__":/gm,
    '$1["__proto__"]:'
  );
}
