import { Client } from "../src/client";
import { unsupportedSchemaResponse } from "./fixtures/unsupported-schema";
import { schema } from "./sample-schema";

const HOST = "https://api.notcms.com/v1";

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("Client constructor", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws when secretKey is not provided", () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", undefined);
    vi.stubEnv("NOTCMS_WORKSPACE_ID", "ws_1");

    expect(() => new Client({ schema })).toThrow(/secretKey is required/);
  });

  it("throws when workspaceId is not provided", () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", "sk_1");
    vi.stubEnv("NOTCMS_WORKSPACE_ID", undefined);

    expect(() => new Client({ schema })).toThrow(/workspaceId is required/);
  });

  it("throws when schema is not provided", () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", "sk_1");
    vi.stubEnv("NOTCMS_WORKSPACE_ID", "ws_1");

    expect(() => new Client<typeof schema>()).toThrow(/schema is required/);
  });

  it("reads credentials from environment variables and builds query handlers", () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", "sk_env");
    vi.stubEnv("NOTCMS_WORKSPACE_ID", "ws_env");

    const nc = new Client({ schema });

    expect(Object.keys(nc.query)).toEqual(Object.keys(schema));
  });
});

describe("DatabaseHandler", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("passes unsupported values through without coercing or discarding them", async () => {
    const client = new Client({
      schema: unsupportedSchemaResponse.schema,
      secretKey: "sk_test",
      workspaceId: "ws_test",
    });
    const page = {
      id: "page_1",
      title: "A page",
      properties: {
        title: "A page",
        published: true,
        language: "ja",
        action: null,
        location: { latitude: 35.68, longitude: 139.76 },
        verified: { state: "verified" },
        future: ["retained", { value: 1 }],
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ data: [page] }))
    );
    const [pages, error] = await client.query.blog.list();
    expect(error).toBeNull();
    expect(pages).toEqual([page]);
  });

  function createClient() {
    return new Client({
      secretKey: "sk_test",
      workspaceId: "ws_test",
      schema,
    });
  }

  it("lists pages with a bearer authorization header", async () => {
    const pages = [{ id: "p1", title: "Hello", properties: {} }];
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: pages }));
    vi.stubGlobal("fetch", fetchMock);

    const [data, error, response] = await createClient().query.abc.list();

    expect(fetchMock).toHaveBeenCalledWith(`${HOST}/ws/ws_test/db/abc/pages`, {
      method: "GET",
      headers: {
        Authorization: "Bearer sk_test",
        "Content-Type": "application/json",
      },
    });
    expect(error).toBeNull();
    expect(data).toEqual(pages);
    expect(response?.status).toBe(200);
  });

  it("encodes filters, dates and one sort key as JSON query parameters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: [] }));
    vi.stubGlobal("fetch", fetchMock);
    const [data, error] = await createClient().query.abc.list({
      where: {
        slug: 'a&b "quoted"',
        publishedAt: { on_or_before: new Date("2026-10-11T00:00:00Z") },
      },
      sort: { publishedAt: "desc" },
    });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe("/v1/ws/ws_test/db/abc/pages");
    expect(JSON.parse(url.searchParams.get("filter") ?? "null")).toEqual({
      slug: 'a&b "quoted"',
      publishedAt: { on_or_before: "2026-10-11T00:00:00.000Z" },
    });
    expect(JSON.parse(url.searchParams.get("sort") ?? "null")).toEqual({
      publishedAt: "desc",
    });
    expect(data).toEqual([]);
    expect(error).toBeNull();
  });

  it("returns an error tuple when the API host is invalid", async () => {
    vi.stubEnv("NOTCMS_API_HOST", "not a URL");
    vi.resetModules();
    const { Client: InvalidHostClient } = await import("../src/client");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const [data, error, response] = await new InvalidHostClient({
      secretKey: "sk_test",
      workspaceId: "ws_test",
      schema,
    }).query.abc.list();

    expect(data).toBeUndefined();
    expect(error).toBeInstanceOf(TypeError);
    expect(response).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an error tuple when serializing a query fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const date = new Date("2026-10-11T00:00:00Z");
    const serializationError = new Error("Cannot serialize date");
    vi.spyOn(date, "toJSON").mockImplementation(() => {
      throw serializationError;
    });

    const [data, error, response] = await createClient().query.abc.list({
      where: { publishedAt: { before: date } },
    });

    expect(data).toBeUndefined();
    expect(error).toBe(serializationError);
    expect(response).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves Retry-After and returns 429 without retrying", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(
          { error: "rate_limited" },
          { status: 429, headers: { "Retry-After": "60" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);
    const [data, error, response] = await createClient().query.abc.list();
    expect(data).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(response?.status).toBe(429);
    expect(response?.headers.get("Retry-After")).toBe("60");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("passes ID filters to the API including an empty list", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: [] }));
    vi.stubGlobal("fetch", fetchMock);
    await createClient().query.abc.list({
      where: { id: { in: ["p1", "p2"] } },
    });
    await createClient().query.abc.list({ where: { id: { in: [] } } });
    expect(
      JSON.parse(
        new URL(fetchMock.mock.calls[0][0]).searchParams.get("filter") ?? "null"
      )
    ).toEqual({ id: { in: ["p1", "p2"] } });
    expect(
      JSON.parse(
        new URL(fetchMock.mock.calls[1][0]).searchParams.get("filter") ?? "null"
      )
    ).toEqual({ id: { in: [] } });
  });

  it("gets the first server-ordered match with content in one request", async () => {
    const page = {
      id: "p2",
      title: "Second",
      properties: { slug: "日本語 & more" },
      content: "# Body",
    };
    const response = jsonResponse({ data: [page] });
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    const [data, error, actualResponse] =
      await createClient().query.abc.getFirst({
        where: { slug: "日本語 & more" },
        sort: { publishedAt: "desc" },
      });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(`${url.origin}${url.pathname}`).toBe(
      `${HOST}/ws/ws_test/db/abc/pages`
    );
    expect(JSON.parse(url.searchParams.get("filter") ?? "null")).toEqual({
      slug: "日本語 & more",
    });
    expect(JSON.parse(url.searchParams.get("sort") ?? "null")).toEqual({
      publishedAt: "desc",
    });
    expect(url.searchParams.get("include")).toBe("content");
    expect(url.searchParams.get("limit")).toBe("1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data).toEqual(page);
    expect(error).toBeNull();
    expect(actualResponse).toBe(response);
  });

  it("uses only the first page when the API returns more than the limit", async () => {
    const first = { id: "p1", title: "First", properties: {}, content: "1" };
    const second = { id: "p2", title: "Second", properties: {}, content: "2" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ data: [first, second] }))
    );
    const [data] = await createClient().query.abc.getFirst();
    expect(data).toEqual(first);
  });

  it("returns null with the list response when no match exists", async () => {
    const response = jsonResponse({ data: [] });
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    expect(await createClient().query.abc.getFirst()).toEqual([
      null,
      null,
      response,
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("preserves request failures instead of returning null or retrying", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = new Response("Unavailable", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    const [data, error, actualResponse] =
      await createClient().query.abc.getFirst();
    expect(data).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(actualResponse).toBe(response);
    expect(actualResponse?.headers.get("Retry-After")).toBe("60");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("gets a single page by id", async () => {
    const page = { id: "p1", title: "Hello", properties: {} };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: page }));
    vi.stubGlobal("fetch", fetchMock);

    const [data, error] = await createClient().query.abc.get("p1");

    expect(fetchMock).toHaveBeenCalledWith(
      `${HOST}/ws/ws_test/db/abc/pages/p1`,
      expect.objectContaining({ method: "GET" })
    );
    expect(error).toBeNull();
    expect(data).toEqual(page);
  });

  it("returns an error tuple with the response on HTTP failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Invalid API key", {
          status: 401,
          statusText: "Unauthorized",
        })
      )
    );

    const [data, error, response] = await createClient().query.abc.list();

    expect(data).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("401");
    expect(error?.message).toContain("Invalid API key");
    expect(response?.status).toBe(401);
  });

  it("returns an error tuple without a response on network failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed"))
    );

    const [data, error, response] = await createClient().query.abc.list();

    expect(data).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("fetch failed");
    expect(response).toBeUndefined();
  });
});
