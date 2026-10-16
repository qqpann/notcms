import { expectTypeOf } from "vitest";
import { Client } from "../src/client";
import type {
  DimensionQuality,
  ListOptions,
  MediaQuality,
  MediaStatus,
  PageCopyQuality,
  PageQuality,
  PageSyncReport,
  Schema,
  SyncCompleteness,
  SyncDiagnostic,
  SyncDiagnosticCode,
  SyncDiagnosticStage,
} from "../src/index";
import { unsupportedSchemaResponse } from "./fixtures/unsupported-schema";

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
  client.query.blog.getFirst({
    where: { published: true },
    sort: { count: "desc" },
  });
  // @ts-expect-error getFirst uses the same typed conditions as list
  client.query.blog.getFirst({ where: { published: "true" } });
  // @ts-expect-error getFirst rejects unknown sort properties
  client.query.blog.getFirst({ sort: { missing: "asc" } });
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

function checkUnsupportedQueries(
  client: Client<typeof unsupportedSchemaResponse.schema>
) {
  client.query.blog.list({
    where: { published: true, language: "ja" },
    sort: { title: "asc" },
  });
  // @ts-expect-error unsupported values cannot be filtered as strings
  client.query.blog.list({ where: { future: "anything" } });
  // @ts-expect-error unsupported values cannot be filtered for emptiness
  client.query.blog.list({ where: { action: { is_empty: true } } });
  // @ts-expect-error place does not yet have a value or query contract
  client.query.blog.list({ where: { location: { equals: "London" } } });
  // @ts-expect-error verification cannot be mistaken for a scalar sort key
  client.query.blog.list({ sort: { verified: "asc" } });
  // @ts-expect-error new type names cannot become sortable implicitly
  client.query.blog.getFirst({ sort: { future: "desc" } });
}
void checkUnsupportedQueries;

function checkIdPropertyQueries(
  client: Client<{
    records: { id: "records"; properties: { id: "title" } };
  }>
) {
  client.query.records.list({ where: { id: "external-id" } });
  client.query.records.list({ where: { id: { equals: "external-id" } } });
  client.query.records.list({ where: { id: { in: ["page-id"] } } });
  client.query.records.list({
    // @ts-expect-error page IDs and property operators cannot be mixed
    where: { id: { in: ["page-id"], equals: "external-id" } },
  });
  client.query.records.list({
    // @ts-expect-error page IDs and empty checks cannot be mixed
    where: { id: { in: ["page-id"], is_empty: true } },
  });
}
void checkIdPropertyQueries;

// Checked by tsc without making network requests.
async function checkGetFirstResult(client: Client<typeof schema>) {
  const [page, error] = await client.query.blog.getFirst();
  if (error) return;
  expectTypeOf(page).toEqualTypeOf<
    typeof client.query.blog.$inferPage | null
  >();
}
void checkGetFirstResult;

// The public barrel must expose every quality field and preserve tuple narrowing.
async function checkQualityResult(client: Client<typeof schema>) {
  const result = await client.query.blog.quality("page-id");
  expectTypeOf(result).toEqualTypeOf<
    | readonly [PageQuality, null, Response]
    | readonly [undefined, Error, Response | undefined]
  >();
  const [quality, error, response] = result;
  if (error !== null) {
    expectTypeOf(quality).toEqualTypeOf<undefined>();
    expectTypeOf(response).toEqualTypeOf<Response | undefined>();
    return;
  }
  expectTypeOf(response).toEqualTypeOf<Response>();
  expectTypeOf(quality.published).toEqualTypeOf<PageCopyQuality | null>();
  if (quality.published) {
    expectTypeOf(
      quality.published.properties
    ).toEqualTypeOf<DimensionQuality>();
    expectTypeOf(
      quality.published.properties.completeness
    ).toEqualTypeOf<SyncCompleteness>();
    expectTypeOf(quality.published.properties.diagnostics).toEqualTypeOf<
      SyncDiagnostic[]
    >();
    expectTypeOf(quality.published.content.version).toEqualTypeOf<
      string | null
    >();
    expectTypeOf(quality.published.media).toEqualTypeOf<MediaQuality>();
    expectTypeOf(quality.published.media.status).toEqualTypeOf<MediaStatus>();
    expectTypeOf(
      quality.published.media.counts.expired
    ).toEqualTypeOf<number>();
  }
  if (quality.latestAttempt) {
    expectTypeOf(
      quality.latestAttempt.report
    ).toEqualTypeOf<PageSyncReport | null>();
    expectTypeOf(quality.latestAttempt.startedAt).toEqualTypeOf<string>();
    expectTypeOf(quality.latestAttempt.finishedAt).toEqualTypeOf<
      string | null
    >();
    const diagnostic = quality.latestAttempt.report?.diagnostic;
    if (diagnostic) {
      expectTypeOf(diagnostic.code).toEqualTypeOf<SyncDiagnosticCode>();
      expectTypeOf(diagnostic.stage).toEqualTypeOf<SyncDiagnosticStage>();
    }
  }
  // @ts-expect-error quality needs a page ID
  client.query.blog.quality();
  // @ts-expect-error quality does not accept list filters or trigger sync options
  client.query.blog.quality("page-id", { sync: true });
}
void checkQualityResult;
