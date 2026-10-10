import { summarizeSchema } from "../src/cli/features/schema-diff";
import type { Schema } from "../src/types";

const before = {
  blog: {
    id: "old_id",
    properties: { title: "title", removed: "url", category: "rich_text" },
  },
  deleted: { id: "deleted_id", properties: {} },
} satisfies Schema;

function module(schema: Schema): string {
  return `export const schema = ${JSON.stringify(schema)} satisfies Schema;`;
}

describe("schema change summary", () => {
  it("reports database additions, removals and ID changes alongside property changes", () => {
    const next = {
      blog: {
        id: "nids_new_id",
        properties: { title: "title", added: "checkbox", category: "select" },
      },
      releases: { id: "release_id", properties: { title: "title" } },
    } satisfies Schema;
    expect(summarizeSchema(module(before), next)).toEqual({
      status: "compared",
      changes: [
        'Changed database ID: "blog"\n  "old_id" -> "nids_new_id"',
        'Added property: "blog"."added" ("checkbox")',
        'Changed property type: "blog"."category"\n  "rich_text" -> "select"',
        'Removed property: "blog"."removed" ("url")',
        'Removed database: "deleted"',
        'Added database: "releases"',
      ],
    });
  });

  it("ignores key order, whitespace, bare keys, comments and trailing commas", () => {
    const existing = `import { Client } from "notcms";
      export const schema = {
        deleted: { properties: {}, id: "deleted_id", },
        // Formatter output is still data, without executing Client.
        blog: { properties: { category: "rich_text", removed: "url", title: "title", }, id: "old_id" },
      } satisfies Schema;
      export const nc = new Client({ schema });`;
    expect(summarizeSchema(existing, before)).toEqual({
      status: "compared",
      changes: [],
    });
  });

  it("supports computed prototype-like keys and escapes control characters in output", () => {
    const schema = {
      ["__proto__"]: { id: "db_proto", properties: { ["__proto__"]: "title" } },
      constructor: { id: "db_constructor", properties: {} },
      "line\nbreak": { id: "id\nescape", properties: {} },
    } satisfies Schema;
    const existing = module(schema).replace(/"__proto__":/g, '["__proto__"]:');
    expect(summarizeSchema(existing, schema)).toEqual({
      status: "compared",
      changes: [],
    });
    expect(summarizeSchema(module({}), schema)).toEqual({
      status: "compared",
      changes: [
        'Added database: "__proto__"',
        'Added database: "constructor"',
        'Added database: "line\\nbreak"',
      ],
    });
  });

  it("reads Japanese names when a formatter removes their quotes", () => {
    const existing = `export const schema = {
      ブログ: { id: "db_jp", properties: { タイトル: "title" } },
    } satisfies Schema;`;
    expect(
      summarizeSchema(existing, {
        ブログ: { id: "db_jp", properties: { タイトル: "title" } },
      })
    ).toEqual({ status: "compared", changes: [] });
  });

  it("distinguishes a first pull from an unreadable previous module", () => {
    expect(summarizeSchema(null, before)).toEqual({ status: "missing" });
    expect(summarizeSchema("not TypeScript", before)).toEqual({
      status: "unavailable",
    });
  });

  it.each([
    "export const schema = loadSchema();",
    "export const schema = { blog: { id: process.env.ID, properties: {} } } satisfies Schema;",
    'export const schema = { blog: { id: "a", properties: { title: "unsupported" } } } satisfies Schema;',
    'export const schema = { blog: { id: "a", properties: {} }, blog: { id: "b", properties: {} } } satisfies Schema;',
    'export const schema = { blog: { id: "a", properties: {} } }.someCode();',
  ])("does not evaluate unsupported local code: %s", (existing) => {
    expect(summarizeSchema(existing, before)).toEqual({
      status: "unavailable",
    });
  });
});
