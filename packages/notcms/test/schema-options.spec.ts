import { expectTypeOf } from "vitest";
import { isSchema } from "../src/cli/features/schema";
import {
  diffSchemas,
  formatSchemaChanges,
  parseGeneratedSchema,
} from "../src/cli/features/schema-diff";
import { Client } from "../src/client";
import type { Schema } from "../src/types";
import { unsupportedSchemaResponse } from "./fixtures/unsupported-schema";

const schema = {
  blog: {
    id: "blog",
    properties: {
      language: "select",
      state: "status",
      tags: "multi_select",
      empty: "select",
      emptyTags: "multi_select",
      legacy: "select",
      legacyTags: "multi_select",
    },
    options: {
      language: ["en", "ja"],
      state: ["Draft", "Published"],
      tags: ["AI", "Web"],
      empty: [],
      emptyTags: [],
    },
  },
} as const satisfies Schema;

describe("choice option schemas", () => {
  it("infers unsupported values as unknown while preserving known choices and legacy types", () => {
    const client = new Client({
      schema: unsupportedSchemaResponse.schema,
      secretKey: "test",
      workspaceId: "test",
    });
    type P = typeof client.query.blog.$inferPage.properties;
    expectTypeOf<P["action"]>().toEqualTypeOf<unknown>();
    expectTypeOf<P["location"]>().toEqualTypeOf<unknown>();
    expectTypeOf<P["verified"]>().toEqualTypeOf<unknown>();
    expectTypeOf<P["future"]>().toEqualTypeOf<unknown>();
    expectTypeOf<P["title"]>().toEqualTypeOf<string | null>();
    expectTypeOf<P["published"]>().toEqualTypeOf<boolean | null>();
    expectTypeOf<P["language"]>().toEqualTypeOf<"en" | "ja" | null>();
    expectTypeOf<
      typeof client.query.legacy.$inferPage.properties.title
    >().toEqualTypeOf<string | null>();
    const legacySchema = {
      blog: { id: "blog", properties: { title: "title", count: "number" } },
    } satisfies Schema;
    const legacyClient = new Client({
      schema: legacySchema,
      secretKey: "test",
      workspaceId: "test",
    });
    expectTypeOf<
      typeof legacyClient.query.blog.$inferPage.properties.title
    >().toEqualTypeOf<string | null>();
    expectTypeOf<
      typeof legacyClient.query.blog.$inferPage.properties.count
    >().toEqualTypeOf<number | null>();
  });

  it("infers literal choices, empty sets and legacy strings", () => {
    const client = new Client({
      schema,
      secretKey: "test",
      workspaceId: "test",
    });
    type P = typeof client.query.blog.$inferPage.properties;
    expectTypeOf<P["language"]>().toEqualTypeOf<"en" | "ja" | null>();
    expectTypeOf<P["state"]>().toEqualTypeOf<"Draft" | "Published" | null>();
    expectTypeOf<P["tags"]>().toEqualTypeOf<("AI" | "Web")[] | null>();
    expectTypeOf<P["empty"]>().toEqualTypeOf<null>();
    expectTypeOf<P["emptyTags"]>().toEqualTypeOf<never[] | null>();
    expectTypeOf<P["legacy"]>().toEqualTypeOf<string | null>();
    expectTypeOf<P["legacyTags"]>().toEqualTypeOf<string[] | null>();
  });

  it("parses generated readonly choices without executing expressions", () => {
    const source = `export const schema = ${JSON.stringify(schema)} as const satisfies Schema;`;
    expect(parseGeneratedSchema(source)).toEqual(schema);
    expect(parseGeneratedSchema(source.replace("as const ", ""))).toEqual(
      schema
    );
    for (const value of [
      "[run()]",
      "[...names]",
      "[1]",
      "[,]",
      '["x", undefined]',
    ]) {
      expect(
        parseGeneratedSchema(source.replace('["en","ja"]', value))
      ).toBeNull();
    }
    expect(
      isSchema({ blog: { ...schema.blog, options: { language: [1] } } })
    ).toBe(false);
    expect(
      isSchema({ blog: { ...schema.blog, options: { missing: [] } } })
    ).toBe(false);
    expect(
      isSchema({
        blog: {
          id: "blog",
          properties: { title: "title" },
          options: { title: [] },
        },
      })
    ).toBe(false);
    const special = JSON.parse(
      '{"blog":{"id":"blog","properties":{"__proto__":"select"},"options":{"__proto__":["日本語\\"quoted"]}}}'
    );
    expect(
      parseGeneratedSchema(
        `export const schema = ${JSON.stringify(special)} as const satisfies Schema;`
      )
    ).toEqual(special);
  });

  it("reports choice additions and removals while ignoring order", () => {
    const next = {
      blog: {
        ...schema.blog,
        options: { ...schema.blog.options, language: ["ja", "fr"] },
      },
    } satisfies Schema;
    const changes = diffSchemas(schema, next);
    expect(changes).toEqual([
      {
        kind: "option-added",
        database: "blog",
        property: "language",
        option: "fr",
      },
      {
        kind: "option-removed",
        database: "blog",
        property: "language",
        option: "en",
      },
    ]);
    expect(formatSchemaChanges(changes)).toContain(
      'Added option: "blog"."language" = "fr"'
    );
    expect(
      diffSchemas(schema, {
        blog: {
          ...schema.blog,
          options: { ...schema.blog.options, language: ["ja", "en"] },
        },
      })
    ).toEqual([]);
    expect(
      diffSchemas(
        { blog: { id: "blog", properties: { language: "select" } } },
        {
          blog: {
            id: "blog",
            properties: { language: "select" },
            options: { language: [] },
          },
        }
      )
    ).toEqual([
      {
        kind: "options-availability-changed",
        database: "blog",
        property: "language",
        available: true,
      },
    ]);
  });
});

function checkChoiceQueries(client: Client<typeof schema>) {
  client.query.blog.list({
    where: {
      language: "ja",
      state: { not_equals: "Draft" },
      tags: { contains: "AI" },
      empty: { is_empty: true },
    },
  });
  // @ts-expect-error unknown select choice
  client.query.blog.list({ where: { language: "fr" } });
  // @ts-expect-error unknown status choice
  client.query.blog.list({ where: { state: { equals: "Archived" } } });
  // @ts-expect-error unknown multi_select choice
  client.query.blog.list({ where: { tags: { contains: "Other" } } });
  // @ts-expect-error a known empty option set does not allow arbitrary strings
  client.query.blog.list({ where: { empty: "anything" } });
}
void checkChoiceQueries;
