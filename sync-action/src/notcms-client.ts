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
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch schema: ${res.status} ${res.statusText}`);
  }

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
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as PagesApiResponse;
  return data.data;
}
