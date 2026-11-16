export interface SchemaDatabase {
  id: string;
  properties: Record<string, string>;
}

export type SchemaResponse = Record<string, SchemaDatabase>;

export interface PageData {
  id: string;
  title: string | null;
  properties: Record<
    string,
    string | number | boolean | string[] | null
  > | null;
  content: string | null;
}

interface PagesApiResponse {
  data: PageData[];
}

interface SchemaApiResponse {
  schema: SchemaResponse;
}

export async function fetchSchema(
  apiHost: string,
  workspaceId: string,
  secretKey: string
): Promise<SchemaResponse> {
  const url = `${apiHost}/ws/${workspaceId}/schema`;
  const res = await request(url, secretKey, "schema");

  const data = (await res.json()) as SchemaApiResponse;
  if (typeof data.schema !== "object" || data.schema === null) {
    throw new Error("Invalid schema response from API");
  }
  return data.schema;
}

export async function fetchPages(
  apiHost: string,
  workspaceId: string,
  notionDatabaseId: string,
  secretKey: string
): Promise<PageData[]> {
  const url = `${apiHost}/ws/${workspaceId}/db/${notionDatabaseId}/pages?include=content`;
  const res = await request(url, secretKey, "pages");

  const data = (await res.json()) as PagesApiResponse;
  return data.data;
}

/**
 * GET a NotCMS API URL. A failure names the API's reason and what to change,
 * because the workflow log is the only place where users see it.
 */
async function request(
  url: string,
  secretKey: string,
  resource: "schema" | "pages"
): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
    });
  } catch (error) {
    // fetch() rejects only when no HTTP response arrives, so the key and
    // workspace ID are not the cause.
    throw new Error(
      `Failed to fetch ${resource}: could not reach ${originOf(url)} (${describeNetworkError(error)}). Check the api_host input and the runner's network, then re-run the workflow.`
    );
  }

  if (!res.ok) {
    const status = [String(res.status), await readErrorDetail(res)]
      .filter(Boolean)
      .join(" ");
    throw new Error(
      `Failed to fetch ${resource}: ${status}. ${suggestedActionForStatus(res.status, resource)}`
    );
  }
  return res;
}

function originOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

/** The low-level reason, such as `getaddrinfo ENOTFOUND api.notcms.com`. */
function describeNetworkError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause: unknown = (error as { cause?: unknown }).cause;
  if (cause instanceof Error && cause.message) return cause.message;
  return error.message;
}

/**
 * The first line of the error body, which the API sends as plain text
 * (for example "Permission denied"). Falls back to the status text.
 */
async function readErrorDetail(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  const firstLine = text.trim().split("\n")[0] || res.statusText;
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine;
}

function suggestedActionForStatus(
  status: number,
  resource: "schema" | "pages"
): string {
  switch (status) {
    case 401:
      return "The secret_key was not accepted. It may have been deleted in the NotCMS dashboard. Create a new key under Workspace Secrets and update the repository secret.";
    case 403:
      return "The secret_key belongs to a different workspace than workspace_id. Use the workspace ID and secret key from the same workspace.";
    case 404:
      return resource === "pages"
        ? "The workspace or database may have been removed from NotCMS while the workflow ran. Re-run the workflow."
        : "Check workspace_id, and that the workspace is still connected to Notion in the NotCMS dashboard.";
    case 429:
      return "Too many requests. Re-run the workflow in a minute.";
    default:
      return status >= 500
        ? "NotCMS could not respond. Re-run the workflow in a few minutes."
        : "Check the workspace_id and secret_key inputs.";
  }
}
