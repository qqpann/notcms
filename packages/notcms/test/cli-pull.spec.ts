import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pullSchema } from "../src/cli/features/pull";
import type { Schema } from "../src/types";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const credentials = {
  secretKey: "ncsec_test",
  workspaceId: "ws_test",
};

describe("pullSchema", () => {
  let dir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(packageRoot, ".notcms-pull-"));
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(dir);
  });

  afterEach(async () => {
    cwdSpy.mockRestore();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("writes the configured schema and returns its first database", async () => {
    const schema = {
      "Blog posts": {
        id: "db_blog",
        properties: { Slug: "rich_text" },
      },
    } satisfies Schema;
    const fetchMock = stubSchema(schema);
    await writeConfig("schema.ts");

    await expect(pullSchema({ credentials })).resolves.toEqual({
      status: "written",
      schemaPath: "schema.ts",
      firstDatabaseName: "Blog posts",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/ws/ws_test/schema"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer ncsec_test",
        }),
      })
    );
    await expect(
      fs.readFile(path.join(dir, "schema.ts"), "utf-8")
    ).resolves.toBe(`import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  "Blog posts": {
    "id": "db_blog",
    "properties": {
      "Slug": "rich_text"
    }
  }
} satisfies Schema;
export const nc = new Client({ schema });`);
  });

  it("returns up-to-date when check mode matches the generated schema", async () => {
    const schema = {
      Blog: { id: "db_blog", properties: { Title: "title" } },
    } satisfies Schema;
    stubSchema(schema);
    await writeConfig("src/notcms/schema.ts");
    await pullSchema({ credentials });

    await expect(pullSchema({ check: true, credentials })).resolves.toEqual({
      status: "up-to-date",
      schemaPath: "src/notcms/schema.ts",
      firstDatabaseName: "Blog",
    });
  });

  it("reports a missing schema without writing in check mode", async () => {
    stubSchema({
      Blog: { id: "db_blog", properties: { Title: "title" } },
    });
    await writeConfig("src/notcms/schema.ts");

    await expect(pullSchema({ check: true, credentials })).resolves.toEqual({
      status: "stale",
      schemaPath: "src/notcms/schema.ts",
      reason: "missing",
    });
    await expect(
      fs.readFile(path.join(dir, "src/notcms/schema.ts"), "utf-8")
    ).rejects.toThrow();
  });

  it("reports an out-of-date schema without replacing it in check mode", async () => {
    stubSchema({
      Blog: { id: "db_blog", properties: { Title: "title" } },
    });
    await writeConfig("schema.ts");
    await fs.writeFile(path.join(dir, "schema.ts"), "existing content");

    await expect(pullSchema({ check: true, credentials })).resolves.toEqual({
      status: "stale",
      schemaPath: "schema.ts",
      reason: "out-of-date",
    });
    await expect(
      fs.readFile(path.join(dir, "schema.ts"), "utf-8")
    ).resolves.toBe("existing content");
  });

  it("writes an empty schema without inventing a query target", async () => {
    stubSchema({});
    await writeConfig("src/notcms/schema.ts");

    await expect(pullSchema({ credentials })).resolves.toEqual({
      status: "written",
      schemaPath: "src/notcms/schema.ts",
      firstDatabaseName: null,
    });
  });

  it("imports and queries a generated schema with prototype-like database names", async () => {
    const schema = {
      ["__proto__"]: {
        id: "db_proto",
        properties: { ["__proto__"]: "rich_text" },
      },
      constructor: { id: "db_constructor", properties: {} },
      prototype: { id: "db_prototype", properties: {} },
    } satisfies Schema;
    const pages = [{ id: "page_1", title: "Safe", properties: {} }];
    const fetchMock = vi.fn((url: string | URL | Request) => {
      const href = String(url);
      if (href.endsWith("/schema")) {
        return Promise.resolve(
          new Response(JSON.stringify({ schema }), { status: 200 })
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify({ data: pages }), { status: 200 })
      );
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NOTCMS_SECRET_KEY", "ncsec_generated");
    vi.stubEnv("NOTCMS_WORKSPACE_ID", "ws_generated");
    await writeConfig("generated-schema.ts");

    await pullSchema({ credentials });
    const generatedPath = path.join(dir, "generated-schema.ts");
    const generated = await import(pathToFileURL(generatedPath).href);

    expect(Object.keys(generated.schema)).toEqual([
      "__proto__",
      "constructor",
      "prototype",
    ]);
    expect(
      Object.prototype.hasOwnProperty.call(
        generated.schema["__proto__"].properties,
        "__proto__"
      )
    ).toBe(true);
    for (const databaseName of Object.keys(schema)) {
      expect(
        Object.prototype.hasOwnProperty.call(generated.nc.query, databaseName)
      ).toBe(true);
      expect(typeof generated.nc.query[databaseName].list).toBe("function");
    }

    const [data, error] = await generated.nc.query["__proto__"].list();

    expect(error).toBeNull();
    expect(data).toEqual(pages);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://api.notcms.com/v1/ws/ws_generated/db/db_proto/pages",
      expect.objectContaining({ method: "GET" })
    );
  });

  function stubSchema(schema: Schema) {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ schema }), {
          status: 200,
        })
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  async function writeConfig(schemaPath: string) {
    await fs.writeFile(
      path.join(dir, "notcms.config.json"),
      JSON.stringify({ schema: schemaPath })
    );
  }
});
