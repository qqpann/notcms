import { describe, expect, it } from "vitest";
import { resolveFilePath, sanitizeSegment } from "../src/file-mapper.js";
import type { PageData } from "../src/notcms-client.js";

describe("sanitizeSegment", () => {
  it("replaces spaces with hyphens", () => {
    expect(sanitizeSegment("Privacy Policy")).toBe("Privacy-Policy");
  });

  it("removes filesystem forbidden characters", () => {
    expect(sanitizeSegment('file<>:"/\\|?*name')).toBe("filename");
  });

  it("removes control characters", () => {
    expect(sanitizeSegment("file\x00\x1fname")).toBe("filename");
  });

  it("removes leading dots and hyphens", () => {
    expect(sanitizeSegment("...hidden")).toBe("hidden");
  });

  it("returns 'untitled' for empty string", () => {
    expect(sanitizeSegment("")).toBe("untitled");
  });

  it("returns 'untitled' for whitespace only", () => {
    expect(sanitizeSegment("   ")).toBe("untitled");
  });

  it("preserves CJK characters", () => {
    expect(sanitizeSegment("プライバシーポリシー")).toBe(
      "プライバシーポリシー"
    );
  });

  it("preserves Korean characters", () => {
    expect(sanitizeSegment("개인정보 처리방침")).toBe("개인정보-처리방침");
  });

  it("handles mixed CJK and ASCII", () => {
    expect(sanitizeSegment("Blog 記事 01")).toBe("Blog-記事-01");
  });

  it("collapses multiple spaces", () => {
    expect(sanitizeSegment("a   b   c")).toBe("a-b-c");
  });
});

describe("resolveFilePath", () => {
  const basePage: PageData = {
    id: "page-001",
    title: "Privacy Policy",
    properties: {
      category: "legal",
      locale: "en",
      filename: "privacy",
      slug: "privacy-policy",
    },
    content: "# Privacy Policy",
  };

  it("resolves basic template with {db} and {title}", () => {
    const result = resolveFilePath("content/{db}/{title}.md", basePage, "docs");
    expect(result.path).toBe("content/docs/Privacy-Policy.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("resolves template with property placeholders", () => {
    const result = resolveFilePath(
      "content/{category}/{locale}/{filename}.md",
      basePage,
      "content"
    );
    expect(result.path).toBe("content/legal/en/privacy.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("resolves {id} placeholder", () => {
    const result = resolveFilePath("pages/{id}.md", basePage, "db");
    expect(result.path).toBe("pages/page-001.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("returns missingKeys when a placeholder has no value", () => {
    const page: PageData = {
      ...basePage,
      properties: { locale: "en" },
    };
    const result = resolveFilePath(
      "content/{category}/{locale}/{filename}.md",
      page,
      "db"
    );
    expect(result.missingKeys).toEqual(["category", "filename"]);
  });

  it("returns missingKeys when title is null and {title} is used", () => {
    const page: PageData = { ...basePage, title: null };
    const result = resolveFilePath("{title}.md", page, "db");
    expect(result.missingKeys).toEqual(["title"]);
  });

  it("sanitizes each segment", () => {
    const page: PageData = {
      ...basePage,
      title: "My <Post>",
      properties: { category: "blog posts" },
    };
    const result = resolveFilePath("{category}/{title}.md", page, "db");
    expect(result.path).toBe("blog-posts/My-Post.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("handles template with no placeholders", () => {
    const result = resolveFilePath("static/page.md", basePage, "db");
    expect(result.path).toBe("static/page.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("handles array property values", () => {
    const page: PageData = {
      ...basePage,
      properties: { tags: ["a", "b"] },
    };
    const result = resolveFilePath("{tags}.md", page, "db");
    expect(result.path).toBe("a,b.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("handles boolean property as string", () => {
    const page: PageData = {
      ...basePage,
      properties: { published: true },
    };
    const result = resolveFilePath("posts/{published}/{title}.md", page, "db");
    expect(result.path).toBe("posts/true/Privacy-Policy.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("handles boolean false without treating as missing", () => {
    const page: PageData = {
      ...basePage,
      properties: { published: false },
    };
    const result = resolveFilePath("posts/{published}/{title}.md", page, "db");
    expect(result.path).toBe("posts/false/Privacy-Policy.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("handles numeric 0 without treating as missing", () => {
    const page: PageData = {
      ...basePage,
      properties: { order: 0 },
    };
    const result = resolveFilePath("docs/{order}-{title}.md", page, "db");
    expect(result.path).toBe("docs/0-Privacy-Policy.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("resolves property names with hyphens", () => {
    const page: PageData = {
      ...basePage,
      properties: { "seo-title": "my-seo-title" },
    };
    const result = resolveFilePath("{seo-title}.md", page, "db");
    expect(result.path).toBe("my-seo-title.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("resolves property names with spaces", () => {
    const page: PageData = {
      ...basePage,
      properties: { "content type": "blog" },
    };
    const result = resolveFilePath("{content type}/{title}.md", page, "db");
    expect(result.path).toBe("blog/Privacy-Policy.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("resolves non-ASCII property names", () => {
    const page: PageData = {
      ...basePage,
      properties: { 名前: "テスト" },
    };
    const result = resolveFilePath("{名前}.md", page, "db");
    expect(result.path).toBe("テスト.md");
    expect(result.missingKeys).toEqual([]);
  });

  it("property takes priority over built-in {title}", () => {
    const page: PageData = {
      ...basePage,
      title: "Page Title",
      properties: { title: "Property Title" },
    };
    const result = resolveFilePath("{title}.md", page, "db");
    expect(result.path).toBe("Property-Title.md");
  });

  it("property takes priority over built-in {db}", () => {
    const page: PageData = {
      ...basePage,
      properties: { db: "my-custom-db" },
    };
    const result = resolveFilePath("{db}/{title}.md", page, "actual-db-name");
    expect(result.path).toBe("my-custom-db/Privacy-Policy.md");
  });

  it("falls back to built-in when property does not exist", () => {
    const page: PageData = {
      ...basePage,
      properties: { category: "legal" },
    };
    const result = resolveFilePath("{db}/{category}/{title}.md", page, "docs");
    expect(result.path).toBe("docs/legal/Privacy-Policy.md");
  });
});
