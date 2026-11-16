import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { dumpConfig, loadConfig } from "../src/cli/features/config";

const DEFAULT_CONFIG = { schema: "src/notcms/schema.ts" };

describe("cli config", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "notcms-config-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("round-trips a config file as readable JSON", async () => {
    const configPath = path.join(dir, "notcms.config.json");
    await dumpConfig(configPath, { schema: "src/custom/schema.ts" });

    expect(await loadConfig(configPath)).toEqual({
      schema: "src/custom/schema.ts",
    });
    expect(JSON.parse(await readFile(configPath, "utf-8"))).toEqual({
      schema: "src/custom/schema.ts",
    });
  });

  it("falls back to the default config when the file is missing", async () => {
    expect(await loadConfig(path.join(dir, "missing.json"))).toEqual(
      DEFAULT_CONFIG
    );
  });

  it("rejects a broken file instead of silently using the default path", async () => {
    const broken = path.join(dir, "broken.json");
    // A trailing comma is a common hand-editing mistake.
    await writeFile(broken, '{"schema": "app/notcms/schema.ts",}');
    await expect(loadConfig(broken)).rejects.toThrow(
      `${broken} is not valid JSON`
    );
  });

  it.each([
    ["a non-string schema", { schema: 123 }],
    ["a missing schema", { output: "app/notcms/schema.ts" }],
    ["null", null],
    ["an array", ["app/notcms/schema.ts"]],
  ])("rejects a config with %s", async (_label, content) => {
    const wrongShape = path.join(dir, "wrong.json");
    await writeFile(wrongShape, JSON.stringify(content));
    await expect(loadConfig(wrongShape)).rejects.toThrow(
      `${wrongShape} must set "schema"`
    );
  });
});
