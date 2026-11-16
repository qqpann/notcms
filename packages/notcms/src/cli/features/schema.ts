import chalk from "chalk";
import dedent from "dedent";
import { PROPERTY_TYPES, type Properties, type Schema } from "../../types.js";
import { routes } from "../routes.js";
import type { Credentials } from "../types.js";
import { getApiHost } from "../variables.js";

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
    // Keep each line short: boxen wraps long lines and drops their indentation.
    throw new Error(
      dedent`
      Both ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} must be set.

      ${chalk.bold("Got:")}
        NOTCMS_WORKSPACE_ID: ${workspaceId ? chalk.green(workspaceId) : chalk.red("(not set)")}
        NOTCMS_SECRET_KEY:   ${secretKey ? chalk.green("(set)") : chalk.red("(not set)")}

      ${chalk.bold("Suggested action:")}
        Log in via browser to save both to .env.local:
          ${chalk.blue("$ npx notcms login")}

        Or copy them from ${chalk.blue(DASHBOARD_URL)} into .env,
        .env.local or .dev.vars, then run the command again.
        For another file, pass it with --env <PATH>.
      `
    );
  }

  let res: Response;
  try {
    res = await fetch(routes.schema(workspaceId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
    });
  } catch (error) {
    // fetch() rejects only when no HTTP response arrives (DNS, connection,
    // TLS or proxy failures), so the key and workspace ID are not the cause.
    throw schemaFetchError({
      problem: `could not reach ${getApiHost()}.`,
      got: describeNetworkError(error),
      actions: [
        "Check your internet connection and proxy settings,",
        "then run the command again.",
        ...(process.env.NOTCMS_API_HOST
          ? ["NOTCMS_API_HOST is set; unset it to use the default API."]
          : []),
      ],
    });
  }

  if (!res.ok) {
    throw schemaFetchError({
      problem: "the API returned an error.",
      got: [String(res.status), await readErrorDetail(res)]
        .filter(Boolean)
        .join(" "),
      actions: suggestedActionsForStatus(res.status),
    });
  }

  try {
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
  } catch {
    throw schemaFetchError({
      problem: "this version of notcms cannot read the response.",
      got: `${res.status}, but not a schema this version understands`,
      actions: [
        "Update the notcms package to the latest version,",
        "then run the command again.",
      ],
    });
  }
}

function schemaFetchError(details: {
  problem: string;
  got: string;
  actions: string[];
}): Error {
  return new Error(
    [
      `Failed to fetch schema from NotCMS: ${details.problem}`,
      "",
      chalk.bold("Got:"),
      `  ${details.got}`,
      "",
      chalk.bold("Suggested action:"),
      ...details.actions.map((line) => `  ${line}`),
    ].join("\n")
  );
}

/** The low-level reason, such as `getaddrinfo ENOTFOUND api.notcms.com`. */
function describeNetworkError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause: unknown = (error as { cause?: unknown }).cause;
  if (cause instanceof Error && cause.message) return cause.message;
  return error.message;
}

/** The first line of the error body, which the API sends as plain text. */
async function readErrorDetail(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  const firstLine = text.trim().split("\n")[0] ?? "";
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine;
}

function suggestedActionsForStatus(status: number): string[] {
  const login = `${chalk.blue("$ npx notcms login")}`;
  switch (status) {
    case 401:
      return [
        "NOTCMS_SECRET_KEY was not accepted. It may have been deleted",
        "in the dashboard. Log in again to save a new key:",
        `  ${login}`,
      ];
    case 403:
      return [
        "NOTCMS_SECRET_KEY belongs to a different workspace than",
        "NOTCMS_WORKSPACE_ID. Use both values from the same workspace,",
        "or log in again to save a matching pair:",
        `  ${login}`,
      ];
    case 404:
      return [
        "Check NOTCMS_WORKSPACE_ID. If the workspace was deleted,",
        "log in again and choose another workspace:",
        `  ${login}`,
      ];
    case 429:
      return ["Too many requests. Wait a minute, then try again."];
    default:
      return status >= 500
        ? ["NotCMS could not respond. Try again in a few minutes."]
        : ["Check NOTCMS_SECRET_KEY and NOTCMS_WORKSPACE_ID, then try again."];
  }
}
