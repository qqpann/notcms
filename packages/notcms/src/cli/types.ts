export type Config = {
  schema: string;
};

export type Credentials = {
  secretKey: string;
  workspaceId: string;
};

export function isConfig(obj: Record<string, unknown>): obj is Config {
  return typeof obj.schema === "string";
}
