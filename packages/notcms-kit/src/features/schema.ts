import { routes } from "../routes";

export async function fetchSchema(): Promise<string> {
  const { NOTCMS_SECRET_KEY, NOTCMS_WORKSPACE_ID } = process.env;
  if (!NOTCMS_SECRET_KEY) {
    throw new Error("NOTCMS_SECRET_KEY is not set");
  }
  if (!NOTCMS_WORKSPACE_ID) {
    throw new Error("NOTCMS_WORKSPACE_ID is not set");
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
