import { Client } from "../src/client";
import type {
  MediaQuality,
  PageCopyQuality,
  PageDelivery,
  PageQuality,
  SyncDiagnostic,
} from "../src/index";
import { schema } from "./sample-schema";

const unknownMedia: MediaQuality = {
  status: "unknown",
  enumerated: false,
  counts: {
    total: 0,
    ready: 0,
    pending: 0,
    failed: 0,
    unknown: 0,
    unpersisted: 0,
    expired: 0,
  },
  diagnostics: [
    {
      version: 1,
      stage: "media",
      code: "media_not_measured",
      retryability: "unknown",
      action: "retry",
    },
  ],
};
const unknownCopy: PageCopyQuality = {
  properties: {
    version: null,
    completeness: "unknown",
    diagnostics: [],
    media: unknownMedia,
  },
  content: {
    version: null,
    completeness: "unknown",
    diagnostics: [],
    media: unknownMedia,
  },
  media: unknownMedia,
};
const propertyOmission: SyncDiagnostic = {
  version: 1,
  stage: "properties",
  code: "notion_unsupported_formula",
  retryability: "not_retryable",
  action: "review_source",
};
const pageFailure: SyncDiagnostic = {
  version: 1,
  stage: "page",
  code: "notion_access_denied",
  retryability: "not_retryable",
  action: "check_access",
};
const expiredMedia: MediaQuality = {
  status: "expired",
  enumerated: true,
  counts: {
    total: 2,
    ready: 0,
    pending: 1,
    failed: 0,
    unknown: 0,
    unpersisted: 0,
    expired: 1,
  },
  diagnostics: [
    {
      version: 1,
      stage: "media",
      code: "media_source_expired",
      retryability: "retryable",
      action: "retry",
    },
  ],
};
const snapshots: [string, PageQuality][] = [
  [
    "legacy zero-reference measurements",
    { published: unknownCopy, latestAttempt: null },
  ],
  [
    "different locked and current versions with dimension diagnostics",
    {
      published: {
        properties: {
          version: "locked-version",
          completeness: "partial",
          diagnostics: [propertyOmission],
          media: unknownMedia,
        },
        content: {
          version: "current-version",
          completeness: "complete",
          diagnostics: [],
          media: expiredMedia,
        },
        media: { ...expiredMedia, enumerated: false },
      },
      latestAttempt: {
        ...unknownCopy,
        version: "next-attempt",
        revision: 3,
        startedAt: "2026-10-17T00:00:00.000Z",
        finishedAt: null,
        report: null,
      },
    },
  ],
  [
    "failed first attempts without a published copy",
    {
      published: null,
      latestAttempt: {
        ...unknownCopy,
        version: "failed-attempt",
        revision: 1,
        properties: { ...unknownCopy.properties, version: "failed-attempt" },
        content: { ...unknownCopy.content, version: "failed-attempt" },
        startedAt: "2026-10-17T00:00:00.000Z",
        finishedAt: "2026-10-17T00:00:01.000Z",
        report: {
          version: 1,
          properties: "unknown",
          content: "unknown",
          media: "unknown",
          diagnostic: pageFailure,
        },
      },
    },
  ],
  ["absent saved history", { published: null, latestAttempt: null }],
];

const deliveryStates = [
  { status: "available", scope: null, reason: null },
  {
    status: "paused",
    scope: "connection",
    reason: "notion_unauthorized",
  },
  {
    status: "paused",
    scope: "content",
    reason: "notion_access_denied",
  },
  {
    status: "revalidating",
    scope: "database",
    reason: "revalidation_required",
  },
  {
    status: "unavailable",
    scope: "page",
    reason: "resource_unavailable",
  },
] satisfies PageDelivery[];
for (const delivery of deliveryStates) {
  snapshots.push([
    `${delivery.status} delivery (${delivery.scope ?? "no restriction"})`,
    {
      published: delivery.status === "unavailable" ? null : unknownCopy,
      latestAttempt: null,
      delivery,
    },
  ]);
}

function client() {
  return new Client({
    secretKey: "fixture-key",
    workspaceId: "fixture-workspace",
    schema,
  });
}

describe("read-only page quality", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each(snapshots)(
    "preserves %s with one authenticated quality request",
    async (_name, snapshot) => {
      const response = new Response(JSON.stringify({ data: snapshot }), {
        headers: { "Content-Type": "application/json" },
      });
      const fetchMock = vi.fn().mockResolvedValue(response);
      vi.stubGlobal("fetch", fetchMock);
      const result = await client().query.abc.quality("fixture-page");
      expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
        "https://api.notcms.com/v1/ws/fixture-workspace/db/abc/pages/fixture-page/quality",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer fixture-key",
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual([snapshot, null, response]);
    }
  );

  it("does not infer delivery availability from an older API's saved copy", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { published: unknownCopy, latestAttempt: null },
        })
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    const [quality, error] = await client().query.abc.quality("fixture-page");
    expect(error).toBeNull();
    expect(quality?.published).toEqual(unknownCopy);
    expect(quality?.delivery).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps a supplied identifier inside the quality path instead of calling live get", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ data: snapshots[0][1] }))
      );
    vi.stubGlobal("fetch", fetchMock);
    await client().query.abc.quality("page?preview=false#/child");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe(
      "/v1/ws/fixture-workspace/db/abc/pages/page%3Fpreview%3Dfalse%23%2Fchild/quality"
    );
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
  });

  it.each([401, 403, 404, 429])(
    "returns the original HTTP %i response without retrying or falling back to get",
    async (status) => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const response = new Response("Quality unavailable", {
        status,
        headers: { "Retry-After": "60" },
      });
      const fetchMock = vi.fn().mockResolvedValue(response);
      vi.stubGlobal("fetch", fetchMock);
      const [data, error, actualResponse] =
        await client().query.abc.quality("fixture-page");
      expect(data).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toContain(String(status));
      expect(actualResponse).toBe(response);
      expect(actualResponse?.headers.get("Retry-After")).toBe("60");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );

  it("returns the network error without a response or a synchronization fallback", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new TypeError("fixture network unavailable");
    const fetchMock = vi.fn().mockRejectedValue(error);
    vi.stubGlobal("fetch", fetchMock);
    expect(await client().query.abc.quality("fixture-page")).toEqual([
      undefined,
      error,
      undefined,
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
