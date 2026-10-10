import { Client } from "notcms";
import {
  type BlogPost,
  type Release,
  contentUrl,
  createContentReader,
  selectBlogPosts,
  selectReleases,
} from "../../../examples/content-recipes/content";
import { schema } from "../../../examples/content-recipes/schema";

const now = new Date("2026-10-11T00:00:00Z");

function blog(
  id: string,
  properties: Partial<BlogPost["properties"]> = {}
): BlogPost {
  return {
    id,
    title: id,
    properties: {
      title: id,
      published: true,
      published_at: "2026-10-10T00:00:00Z",
      language: null,
      ...properties,
    },
  };
}

function release(
  id: string,
  properties: Partial<Release["properties"]> = {}
): Release {
  return {
    id,
    title: id,
    properties: {
      title: id,
      released_at: "2026-10-10T00:00:00Z",
      language: null,
      products: null,
      version_number: null,
      ...properties,
    },
  };
}

describe("publication and language recipes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("excludes drafts, absent/invalid/future dates and other languages, then sorts newest first", () => {
    const posts = [
      blog("old", { published_at: "2026-10-01" }),
      blog("current", { published_at: now.toISOString() }),
      blog("draft", { published: false }),
      blog("no-flag", { published: null }),
      blog("missing-date", { published_at: null }),
      blog("invalid-date", { published_at: "invalid" }),
      blog("scheduled", { published_at: "2026-10-12" }),
      blog("english", { language: "en" }),
      blog("unsupported", { language: "fr" }),
    ];
    expect(selectBlogPosts(posts, "ja", now).map((post) => post.id)).toEqual([
      "current",
      "old",
    ]);
    expect(selectBlogPosts(posts, "en", now).map((post) => post.id)).toEqual([
      "english",
    ]);
    expect(posts[0].id).toBe("old");
  });

  it("keeps missing versions and identical versions in different products using stable ID URLs", () => {
    const releases = [
      release("missing-version"),
      release("product-a", { version_number: "1.0", products: ["A"] }),
      release("product-b", { version_number: "1.0", products: ["B"] }),
      release("draft", { released_at: null }),
      release("future", { released_at: "2026-10-12" }),
      release("english", { language: "en" }),
    ];
    expect(selectReleases(releases, "ja", now).map((item) => item.id)).toEqual([
      "missing-version",
      "product-a",
      "product-b",
    ]);
    expect(contentUrl("releases", "ja", "product-a")).not.toBe(
      contentUrl("releases", "ja", "product-b")
    );
    expect(contentUrl("blog", "en", "id/with ?#")).toBe(
      "/en/blog/id%2Fwith%20%3F%23"
    );
    expect(selectReleases([release("only-ja")], "en", now)).toEqual([]);
  });

  it("loads published detail while rechecking its current state and refusing draft ID access", async () => {
    const published = blog("published");
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        response([published, blog("draft", { published: false })])
      )
      .mockResolvedValueOnce(response([published]))
      .mockResolvedValueOnce(response({ ...published, content: "# Body" }))
      .mockResolvedValueOnce(response([published]))
      .mockResolvedValueOnce(
        response({
          ...blog("published", { published: false }),
          content: "Draft",
        })
      );
    vi.stubGlobal("fetch", fetch);
    const reader = createContentReader(
      new Client({ schema, secretKey: "ncsec_test", workspaceId: "ws_test" })
    );
    expect(await reader.getBlog("draft", "ja", now)).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect((await reader.getBlog("published", "ja", now))?.content).toBe(
      "# Body"
    );
    expect(await reader.getBlog("published", "ja", now)).toBeNull();
  });

  it("propagates CMS failures instead of turning them into empty lists or missing detail", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
      .mockResolvedValueOnce(new Response("Unauthorized", { status: 401 }))
      .mockResolvedValueOnce(response([release("release")]))
      .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }));
    vi.stubGlobal("fetch", fetch);
    const reader = createContentReader(
      new Client({ schema, secretKey: "ncsec_test", workspaceId: "ws_test" })
    );
    await expect(reader.listBlog("ja", now)).rejects.toThrow("503");
    await expect(reader.getBlog("anything", "ja", now)).rejects.toThrow("401");
    await expect(reader.getRelease("release", "ja", now)).rejects.toThrow(
      "503"
    );
  });
});

function response(data: unknown): Response {
  return new Response(JSON.stringify({ data }), { status: 200 });
}
