import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  diffSchemas,
  formatSchemaChanges,
  readGeneratedSchema,
} from "../src/cli/features/schema-diff";
import type { Properties, Schema } from "../src/types";

describe("schema diff", () => {
  it("reports database, ID, property add/remove, and type changes in stable order", () => {
    const previous = {
      blog: {
        id: "blog-old",
        properties: {
          title: "title",
          legacy: "number",
        },
      },
      archive: {
        id: "archive",
        properties: { body: "rich_text" },
      },
    } satisfies Schema;
    const current = {
      blog: {
        id: "blog-new",
        properties: {
          title: "rich_text",
          publishedAt: "date",
        },
      },
      releases: {
        id: "releases",
        properties: { slug: "rich_text" },
      },
    } satisfies Schema;

    expect(diffSchemas(previous, current)).toEqual([
      { kind: "database-removed", database: "archive" },
      {
        kind: "database-id-changed",
        database: "blog",
        before: "blog-old",
        after: "blog-new",
      },
      {
        kind: "property-removed",
        database: "blog",
        property: "legacy",
        type: "number",
      },
      {
        kind: "property-added",
        database: "blog",
        property: "publishedAt",
        type: "date",
      },
      {
        kind: "property-type-changed",
        database: "blog",
        property: "title",
        before: "title",
        after: "rich_text",
      },
      { kind: "database-added", database: "releases" },
    ]);
  });

  it("does not report changes when object insertion order differs", () => {
    const previous = {
      blog: {
        id: "blog",
        properties: { title: "title", slug: "rich_text" },
      },
    } satisfies Schema;
    const current = {
      blog: {
        id: "blog",
        properties: { slug: "rich_text", title: "title" },
      },
    } satisfies Schema;

    expect(diffSchemas(previous, current)).toEqual([]);
    expect(formatSchemaChanges([])).toBe("No schema changes detected.");
  });

  it("formats ID and type changes with before and after values", () => {
    expect(
      formatSchemaChanges([
        {
          kind: "database-id-changed",
          database: "blog",
          before: "old-id",
          after: "new-id",
        },
        {
          kind: "property-type-changed",
          database: "blog",
          property: "title",
          before: "title",
          after: "rich_text",
        },
      ])
    ).toBe(
      [
        "Schema changes:",
        'Changed database ID: "blog"',
        '  "old-id" -> "new-id"',
        'Changed property type: "blog"."title"',
        '  "title" -> "rich_text"',
      ].join("\n")
    );
  });

  it("quotes names and IDs so delimiters and control characters stay unambiguous", () => {
    expect(
      formatSchemaChanges([
        { kind: "database-added", database: "release.notes\nprod" },
        {
          kind: "property-added",
          database: "blog.v2",
          property: "title\tname",
          type: "rich_text",
        },
      ])
    ).toBe(
      [
        "Schema changes:",
        'Added database: "release.notes\\nprod"',
        'Added property: "blog.v2"."title\\tname" ("rich_text")',
      ].join("\n")
    );
  });

  it("escapes C1 control characters in change labels", () => {
    expect(
      formatSchemaChanges([
        { kind: "database-added", database: "control\u009bname" },
      ])
    ).toBe(
      ["Schema changes:", 'Added database: "control\\u009bname"'].join("\n")
    );
  });

  it("checks own database and property entries before diffing", () => {
    const previous: Schema = Object.create(null);
    const previousProperties: Properties = Object.create(null);
    previousProperties["constructor"] = "title";
    previousProperties["toString"] = "url";
    previous["constructor"] = {
      id: "constructor-id",
      properties: {},
    };
    previous.blog = {
      id: "blog",
      properties: previousProperties,
    };
    const current = {
      blog: {
        id: "blog",
        properties: {},
      },
    } satisfies Schema;

    expect(diffSchemas(previous, current)).toEqual([
      {
        kind: "property-removed",
        database: "blog",
        property: "constructor",
        type: "title",
      },
      {
        kind: "property-removed",
        database: "blog",
        property: "toString",
        type: "url",
      },
      { kind: "database-removed", database: "constructor" },
    ]);
  });

  describe("readGeneratedSchema", () => {
    let dir: string;

    beforeEach(async () => {
      dir = await mkdtemp(path.join(tmpdir(), "notcms-schema-diff-"));
    });

    afterEach(async () => {
      await rm(dir, { recursive: true, force: true });
    });

    it("reads formatter output with bare keys and trailing commas", async () => {
      const schema = {
        "release.notes": {
          id: "release-id",
          properties: { title: "title", slug: "rich_text" },
        },
      } satisfies Schema;
      const schemaPath = path.join(dir, "schema.ts");
      await writeFile(
        schemaPath,
        `import type { Schema } from "notcms";\n\nexport const schema = {\n  "release.notes": {\n    id: "release-id",\n    properties: {\n      title: "title",\n      slug: "rich_text",\n    },\n  },\n} satisfies Schema;\nexport const nc = new Client({ schema });\n`
      );

      await expect(readGeneratedSchema(schemaPath)).resolves.toEqual(schema);
    });

    it("reads semicolonless output and an EOF schema declaration", async () => {
      const schema = {
        blog: {
          id: "blog-id",
          properties: { title: "title" },
        },
      } satisfies Schema;
      const declaration = `export const schema = {
  blog: { id: "blog-id", properties: { title: "title" } },
} satisfies Schema`;
      const variants = [
        `${declaration}\nexport const nc = new Client({ schema })\n`,
        declaration,
      ];

      for (const [index, content] of variants.entries()) {
        const schemaPath = path.join(dir, `semicolonless-${index}.ts`);
        await writeFile(schemaPath, content);
        await expect(readGeneratedSchema(schemaPath)).resolves.toEqual(schema);
      }
    });

    it("rejects same-line wrappers and unrelated expressions after Schema", async () => {
      const declaration = `export const schema = {
  blog: { id: "blog-id", properties: { title: "title" } },
} satisfies Schema`;
      const invalid = [
        `${declaration} export const nc = new Client({ schema })`,
        `${declaration}; unrelated()`,
        `${declaration}\nunrelated()`,
      ];

      for (const [index, content] of invalid.entries()) {
        const schemaPath = path.join(dir, `invalid-suffix-${index}.ts`);
        await writeFile(schemaPath, content);
        await expect(readGeneratedSchema(schemaPath)).resolves.toBeNull();
      }
    });

    it("reads astral and combining Unicode identifier keys by code point", async () => {
      const schema = {
        𝒜: {
          id: "𝒜",
          properties: { é: "title" },
        },
      } satisfies Schema;
      const schemaPath = path.join(dir, "unicode-schema.ts");
      await writeFile(
        schemaPath,
        `export const schema = {\n  𝒜: {\n    id: "𝒜",\n    properties: {\n      é: "title",\n    },\n  },\n} satisfies Schema;\n`
      );

      await expect(readGeneratedSchema(schemaPath)).resolves.toEqual(schema);
    });

    it("reads both single and double quoted schema strings", async () => {
      const schema = {
        "single.name": {
          id: "single-id",
          properties: { title: "title" },
        },
      } satisfies Schema;
      const schemaPath = path.join(dir, "quote-schema.ts");
      await writeFile(
        schemaPath,
        `export const schema = {\n  'single.name': {\n    id: 'single-id',\n    properties: { title: "title" },\n  },\n} satisfies Schema;\n`
      );

      await expect(readGeneratedSchema(schemaPath)).resolves.toEqual(schema);
    });

    it("ignores schema-shaped text inside comments, strings, and templates", async () => {
      const schemaPath = path.join(dir, "false-positive.ts");
      await writeFile(
        schemaPath,
        [
          "/*",
          'export const schema = { blog: { id: "fake", properties: {} } } satisfies Schema;',
          "*/",
          'const text = "export const schema = { blog: { id: \\"fake\\", properties: {} } } satisfies Schema;";',
          'const template = `export const schema = { blog: { id: "fake", properties: {} } } satisfies Schema;`;',
        ].join("\n")
      );

      await expect(readGeneratedSchema(schemaPath)).resolves.toBeNull();
    });

    it("rejects spreads, accessors, calls, and duplicate keys without evaluating them", async () => {
      const expressions = [
        "export const schema = { ...getSchema() } satisfies Schema;",
        "export const schema = { get blog() { return {}; } } satisfies Schema;",
        "export const schema = { blog: getSchema() } satisfies Schema;",
        "export const schema = { [getName()]: {} } satisfies Schema;",
        "export const schema = { [blog]: {} } satisfies Schema;",
        "export const schema = { blog: {}, blog: {} } satisfies Schema;",
      ];

      for (const [index, expression] of expressions.entries()) {
        const schemaPath = path.join(dir, `unsafe-${index}.ts`);
        await writeFile(schemaPath, expression);
        await expect(readGeneratedSchema(schemaPath)).resolves.toBeNull();
      }
    });

    it("returns null for missing or manually edited schemas", async () => {
      await expect(
        readGeneratedSchema(path.join(dir, "missing.ts"))
      ).resolves.toBeNull();

      const schemaPath = path.join(dir, "manual.ts");
      await writeFile(
        schemaPath,
        "export const schema = getSchema(); satisfies Schema;\n"
      );
      await expect(readGeneratedSchema(schemaPath)).resolves.toBeNull();
    });
  });
});
