export type Config = {
  schema: string;
};

export function isConfig(obj: Record<string, unknown>): obj is Config {
  return typeof obj.schema === "string";
}
