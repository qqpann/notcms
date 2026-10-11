import { expectTypeOf } from "vitest";
import { Client } from "../src/client";
import type { ListOptions, Schema } from "../src/index";

const schema = {
  blog: {
    id: "blog",
    properties: {
      title: "title",
      published: "checkbox",
      count: "number",
      language: "select",
      tags: "multi_select",
      released: "date",
      writers: "relation",
      score: "formula",
    },
  },
} as const satisfies Schema;

describe("list query types", () => {
  it("infers operands from property types and preserves page inference", () => {
    const options: ListOptions<typeof schema.blog> = {
      where: {
        id: { in: ["p1", "p2"] as const },
        published: true,
        language: { not_equals: "en" },
        count: 0,
        tags: { contains: "ai" },
        released: { before: new Date("2026-10-11") },
        writers: { is_empty: true },
        score: 98,
      },
      sort: { released: "desc" },
    };
    expect(options.where?.published).toBe(true);
    const client = new Client({
      schema,
      secretKey: "test",
      workspaceId: "test",
    });
    expectTypeOf<
      typeof client.query.blog.$inferPage.properties.published
    >().toEqualTypeOf<boolean | null>();
    expectTypeOf<
      typeof client.query.blog.$inferPage.properties.score
    >().toEqualTypeOf<string | number | null>();
  });
});

// Checked by tsc without making network requests.
function checkInvalidQueries(client: Client<typeof schema>) {
  client.query.blog.list({ where: { id: { in: ["p1"] as const } } });
  // @ts-expect-error ID values must be strings
  client.query.blog.list({ where: { id: { in: [123] } } });
  // @ts-expect-error unknown property
  client.query.blog.list({ where: { missing: true } });
  // @ts-expect-error checkbox requires a boolean
  client.query.blog.list({ where: { published: "true" } });
  // @ts-expect-error number requires a number
  client.query.blog.list({ where: { count: "0" } });
  // @ts-expect-error dates do not support equals
  client.query.blog.list({ where: { released: { equals: "2026-10-11" } } });
  // @ts-expect-error contains only supports multi_select
  client.query.blog.list({ where: { title: { contains: "hi" } } });
  // @ts-expect-error relation equality is unsupported
  client.query.blog.list({ where: { writers: "page" } });
  // @ts-expect-error one sort key only
  client.query.blog.list({ sort: { count: "asc", released: "desc" } });
  // @ts-expect-error array properties cannot be sorted
  client.query.blog.list({ sort: { tags: "asc" } });
}
void checkInvalidQueries;
