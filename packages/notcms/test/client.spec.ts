import { Client } from "../src/client";
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
