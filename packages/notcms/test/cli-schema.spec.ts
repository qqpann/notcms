import { fetchSchema, fetchSchemaResponse } from "../src/cli/features/schema";
import { PROPERTY_TYPES } from "../src/types";

describe("fetchSchema", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  function stubCredentials() {
    vi.stubEnv("NOTCMS_SECRET_KEY", "sk_test");
    vi.stubEnv("NOTCMS_WORKSPACE_ID", "ws_test");
  }

  it("throws a setup guide when credentials are missing", async () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", undefined);
    vi.stubEnv("NOTCMS_WORKSPACE_ID", undefined);

    await expect(fetchSchema()).rejects.toThrow(
      /NOTCMS_SECRET_KEY.+NOTCMS_WORKSPACE_ID.+must be set/
    );
  });

  it("fetches and returns the workspace schema", async () => {
    stubCredentials();
    const schema = {
      blog: { id: "db_1", properties: { slug: "rich_text" } },
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ schema }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchSchema()).resolves.toEqual(schema);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.notcms.com/v1/ws/ws_test/schema?include=options",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sk_test",
        },
      }
    );
  });

  it("uses an API host loaded after the schema module was imported", async () => {
    stubCredentials();
    vi.stubEnv("NOTCMS_API_HOST", "http://127.0.0.1:12345/v1");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ schema: {} }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    await fetchSchema();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:12345/v1/ws/ws_test/schema?include=options",
      expect.any(Object)
    );
  });

  it("returns the server-selected onboarding database metadata", async () => {
    stubCredentials();
    const schema = {
      Blog: { id: "db_1", properties: { slug: "rich_text" } },
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ onboardingDatabaseName: "Blog", schema }),
            { status: 200 }
          )
        )
    );

    await expect(fetchSchemaResponse()).resolves.toEqual({
      onboardingDatabaseName: "Blog",
      schema,
      unsupportedProperties: [],
    });
  });

  it("uses explicitly supplied credentials when the environment is empty", async () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", undefined);
    vi.stubEnv("NOTCMS_WORKSPACE_ID", undefined);
    const schema = {
      blog: { id: "db_1", properties: { slug: "rich_text" } },
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ schema }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchSchema({ secretKey: "ncsec_login", workspaceId: "ws_login" })
    ).resolves.toEqual(schema);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.notcms.com/v1/ws/ws_login/schema?include=options",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer ncsec_login",
        }),
      })
    );
  });

  it("accepts every supported property type", async () => {
    stubCredentials();
    const properties = Object.fromEntries(
      PROPERTY_TYPES.map((type, index) => [`prop_${index}`, type])
    );
    const schema = { blog: { id: "db_1", properties } };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ schema }), { status: 200 })
        )
    );

    await expect(fetchSchema()).resolves.toEqual(schema);
  });

  it("omits properties with unsupported types and reports them", async () => {
    stubCredentials();
    const schema = {
      blog: {
        id: "db_1",
        properties: {
          title: "title",
          action: "button",
          location: "place",
          review: "verification",
          tag: "select",
        },
        options: { tag: ["a", "b"] },
      },
      authors: { id: "db_2", properties: { name: "title" } },
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ schema }), { status: 200 })
        )
    );

    await expect(fetchSchemaResponse()).resolves.toEqual({
      schema: {
        blog: {
          id: "db_1",
          properties: { title: "title", tag: "select" },
          options: { tag: ["a", "b"] },
        },
        authors: { id: "db_2", properties: { name: "title" } },
      },
      unsupportedProperties: [
        { database: "blog", property: "action", type: "button" },
        { database: "blog", property: "location", type: "place" },
        { database: "blog", property: "review", type: "verification" },
      ],
    });
  });

  it("keeps prototype-like names as data while omitting a property", async () => {
    stubCredentials();
    const payload = `{"schema":{"__proto__":{"id":"db_1","properties":{"__proto__":"title","x":"button"}}}}`;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(payload, { status: 200 }))
    );

    const schema = await fetchSchema();
    expect(Object.keys(schema)).toEqual(["__proto__"]);
    expect(Object.keys(schema["__proto__"].properties)).toEqual(["__proto__"]);
  });

  it("drops options that belong to an omitted property", async () => {
    stubCredentials();
    const schema = {
      blog: {
        id: "db_1",
        properties: { kind: "future_select" },
        options: { kind: ["a"] },
      },
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ schema }), { status: 200 })
        )
    );

    await expect(fetchSchema()).resolves.toEqual({
      blog: { id: "db_1", properties: {}, options: {} },
    });
  });

  it("accepts a workspace with no databases", async () => {
    stubCredentials();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ schema: {} }), { status: 200 })
        )
    );

    await expect(fetchSchema()).resolves.toEqual({});
  });

  it("rejects schema payloads that are not keyed database maps", async () => {
    stubCredentials();

    const malformedPayloads = [
      { schema: null },
      { schema: ["not", "a", "map"] },
      // unknown database field
      { schema: { blog: { id: "db_1", properties: {}, note: "stale" } } },
      // missing id
      { schema: { blog: { properties: {} } } },
      // missing properties
      { schema: { blog: { id: "db_1" } } },
      // property value is not a string
      { schema: { blog: { id: "db_1", properties: { slug: 123 } } } },
    ];

    for (const payload of malformedPayloads) {
      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValue(
            new Response(JSON.stringify(payload), { status: 200 })
          )
      );
      await expect(fetchSchema()).rejects.toThrow(/Failed to fetch schema/);
    }
  });

  it("throws a fetch failure message for error and malformed responses", async () => {
    stubCredentials();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Unauthorized", {
          status: 401,
          statusText: "Unauthorized",
        })
      )
    );
    await expect(fetchSchema()).rejects.toThrow(/Failed to fetch schema/);

    // HTTP エラーは、body が有効な schema JSON でも成功扱いにしない
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            schema: { blog: { id: "db_1", properties: {} } },
          }),
          { status: 500, statusText: "Internal Server Error" }
        )
      )
    );
    await expect(fetchSchema()).rejects.toThrow(/Failed to fetch schema/);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ schema: "not-an-object" }), {
          status: 200,
        })
      )
    );
    await expect(fetchSchema()).rejects.toThrow(/Failed to fetch schema/);
  });
});
