import { promises as fs } from "node:fs";
import * as path from "node:path";
import { Config, isConfig } from "../types.js";

const DEFAULT_CONFIG: Config = {
  schema: "src/notcms/schema.ts",
};

export function dumpConfig(
  configPath: string,
  config: Config = DEFAULT_CONFIG
): Promise<void> {
  return fs.writeFile(
    path.resolve(configPath),
    JSON.stringify(config, null, 2)
  );
}

/**
 * Read the project config. Only a missing file falls back to the default:
 * a file that exists but cannot be used is an error, because silently using
 * the default path would write the schema somewhere the project does not
 * import it from.
 */
export async function loadConfig(configPath: string): Promise<Config> {
  let text: string;
  try {
    text = await fs.readFile(path.resolve(configPath), "utf-8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return DEFAULT_CONFIG;
    }
    throw error;
  }

  let config: unknown;
  try {
    config = JSON.parse(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${configPath} is not valid JSON (${reason}). Fix the file, or delete it to write the schema to ${DEFAULT_CONFIG.schema}.`
    );
  }
  const record =
    typeof config === "object" && config !== null && !Array.isArray(config)
      ? (config as Record<string, unknown>)
      : null;
  if (record === null || !isConfig(record)) {
    throw new Error(
      `${configPath} must set "schema" to the path of the schema file, for example {"schema": "${DEFAULT_CONFIG.schema}"}.`
    );
  }
  return record;
}
