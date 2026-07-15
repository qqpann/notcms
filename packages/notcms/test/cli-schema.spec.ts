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
      "https://api.notcms.com/v1/ws/ws_test/schema",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sk_test",
        },
      }
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
      "https://api.notcms.com/v1/ws/ws_login/schema",
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
      // missing id
      { schema: { blog: { properties: {} } } },
      // missing properties
      { schema: { blog: { id: "db_1" } } },
      // property value is not a string
      { schema: { blog: { id: "db_1", properties: { slug: 123 } } } },
      // unknown property type
      { schema: { blog: { id: "db_1", properties: { slug: "bogus" } } } },
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
