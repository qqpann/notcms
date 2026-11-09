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

function isPropertyOptions(value: unknown, properties: Properties): boolean {
  return (
    isPlainObject(value) &&
    Object.entries(value).every(
      ([key, options]) =>
        Object.prototype.hasOwnProperty.call(properties, key) &&
        ["select", "status", "multi_select"].includes(properties[key]) &&
        Array.isArray(options) &&
        options.every((option) => typeof option === "string")
    )
  );
}

function isSchemaEntry(entry: unknown): entry is Schema[string] {
  return (
    isPlainObject(entry) &&
    Object.keys(entry).every((key) =>
      ["id", "properties", "options"].includes(key)
    ) &&
    typeof entry.id === "string" &&
    isProperties(entry.properties) &&
    (entry.options === undefined ||
      isPropertyOptions(entry.options, entry.properties))
  );
}

export function isSchema(value: unknown): value is Schema {
  return isPlainObject(value) && Object.values(value).every(isSchemaEntry);
}

/** A property whose Notion type this SDK version cannot represent yet. */
export type UnsupportedProperty = {
  database: string;
  property: string;
  type: string;
};

export type FetchedSchemaResponse = {
  onboardingDatabaseName?: string | null;
  schema: Schema;
  /**
   * Properties left out of `schema` because their type is not in
   * `PROPERTY_TYPES` (for example a Notion type added after this release).
   * Callers must surface them so the omission is never silent.
   */
  unsupportedProperties: UnsupportedProperty[];
};

/**
 * Remove string-typed properties whose type is unknown to this SDK, so that
 * one new Notion property type does not reject the whole workspace schema.
 * Anything else that is malformed (non-string types, unknown fields) is left
 * in place for `isSchema` to reject.
 */
/** Define an own property, so a `__proto__` key stays data, as in JSON.parse. */
function setOwn(target: Record<string, unknown>, key: string, value: unknown) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}

function omitUnsupportedProperties(value: unknown): {
  value: unknown;
  unsupportedProperties: UnsupportedProperty[];
} {
  const unsupportedProperties: UnsupportedProperty[] = [];
  if (!isPlainObject(value)) return { value, unsupportedProperties };
  const result: Record<string, unknown> = {};
  for (const [database, entry] of Object.entries(value)) {
    if (!isPlainObject(entry) || !isPlainObject(entry.properties)) {
      setOwn(result, database, entry);
      continue;
    }
    const properties: Record<string, unknown> = {};
    const omitted = new Set<string>();
    for (const [property, type] of Object.entries(entry.properties)) {
      if (typeof type === "string" && !PROPERTY_TYPE_SET.has(type)) {
        unsupportedProperties.push({ database, property, type });
        omitted.add(property);
      } else {
        setOwn(properties, property, type);
      }
    }
    if (omitted.size === 0) {
      setOwn(result, database, entry);
      continue;
    }
    const next: Record<string, unknown> = { ...entry, properties };
    if (isPlainObject(entry.options)) {
      next.options = Object.fromEntries(
        Object.entries(entry.options).filter(([key]) => !omitted.has(key))
      );
    }
    setOwn(result, database, next);
  }
  return { value: result, unsupportedProperties };
}

export async function fetchSchema(credentials?: Credentials): Promise<Schema> {
  return (await fetchSchemaResponse(credentials)).schema;
}

export async function fetchSchemaResponse(
  credentials?: Credentials
): Promise<FetchedSchemaResponse> {
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
    const data: unknown = await res.json();
    if (!isPlainObject(data)) {
      throw new Error("Invalid schema payload.");
    }
    const { value: schema, unsupportedProperties } = omitUnsupportedProperties(
      data.schema
    );
    if (!isSchema(schema)) {
      throw new Error("Invalid schema payload.");
    }
    const hasOnboardingDatabaseName = Object.prototype.hasOwnProperty.call(
      data,
      "onboardingDatabaseName"
    );
    const onboardingDatabaseName = data.onboardingDatabaseName;
    if (
      hasOnboardingDatabaseName &&
      onboardingDatabaseName !== null &&
      typeof onboardingDatabaseName !== "string"
    ) {
      throw new Error("Invalid onboarding database name.");
    }
    return {
      schema,
      unsupportedProperties,
      ...(hasOnboardingDatabaseName
        ? {
            onboardingDatabaseName:
              typeof onboardingDatabaseName === "string"
                ? onboardingDatabaseName
                : null,
          }
        : {}),
    };
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
