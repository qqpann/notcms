import { describe, expect, it } from "vitest";
import {
  buildFilePath,
  parseDatabasesParam,
  resolveDbDir,
  sanitizeFilename,
} from "../src/file-mapper.js";

describe("sanitizeFilename", () => {
  it("replaces spaces with hyphens", () => {
    expect(sanitizeFilename("Privacy Policy")).toBe("Privacy-Policy");
  });

  it("removes filesystem forbidden characters", () => {
    expect(sanitizeFilename('file<>:"/\\|?*name')).toBe("filename");
  });

  it("removes control characters", () => {
    expect(sanitizeFilename("file\x00\x1fname")).toBe("filename");
  });

  it("removes leading dots", () => {
    expect(sanitizeFilename("...hidden")).toBe("hidden");
  });

  it("returns 'untitled' for empty string", () => {
    expect(sanitizeFilename("")).toBe("untitled");
  });

  it("returns 'untitled' for whitespace only", () => {
    expect(sanitizeFilename("   ")).toBe("untitled");
  });

  it("preserves CJK characters", () => {
    expect(sanitizeFilename("プライバシーポリシー")).toBe(
      "プライバシーポリシー"
    );
  });

  it("preserves Korean characters", () => {
    expect(sanitizeFilename("개인정보 처리방침")).toBe("개인정보-처리방침");
  });

  it("handles mixed CJK and ASCII", () => {
    expect(sanitizeFilename("Blog 記事 01")).toBe("Blog-記事-01");
  });

  it("collapses multiple spaces", () => {
    expect(sanitizeFilename("a   b   c")).toBe("a-b-c");
  });
});

describe("parseDatabasesParam", () => {
  it("returns empty map for undefined", () => {
    expect(parseDatabasesParam(undefined).size).toBe(0);
  });

  it("returns empty map for empty string", () => {
    expect(parseDatabasesParam("").size).toBe(0);
  });

  it("parses single mapping", () => {
    const map = parseDatabasesParam("blog:content/posts");
    expect(map.get("blog")).toBe("content/posts");
  });

  it("parses multiple mappings", () => {
    const map = parseDatabasesParam("legal:docs/legal\nblog:content/posts");
    expect(map.size).toBe(2);
    expect(map.get("legal")).toBe("docs/legal");
    expect(map.get("blog")).toBe("content/posts");
  });

  it("skips blank lines", () => {
    const map = parseDatabasesParam("blog:posts\n\nlegal:docs");
    expect(map.size).toBe(2);
  });

  it("skips lines without colon", () => {
    const map = parseDatabasesParam("invalid\nblog:posts");
    expect(map.size).toBe(1);
  });

  it("trims whitespace", () => {
    const map = parseDatabasesParam("  blog : posts  ");
    expect(map.get("blog")).toBe("posts");
  });
});

describe("resolveDbDir", () => {
  it("returns db name when map is empty", () => {
    expect(resolveDbDir("blog", new Map())).toBe("blog");
  });

  it("returns mapped dir when present", () => {
    const map = new Map([["blog", "content/posts"]]);
    expect(resolveDbDir("blog", map)).toBe("content/posts");
  });

  it("returns null for unmapped db when map is non-empty", () => {
    const map = new Map([["blog", "posts"]]);
    expect(resolveDbDir("legal", map)).toBeNull();
  });
});

describe("buildFilePath", () => {
  it("builds basic path", () => {
    expect(buildFilePath("content", "blog", undefined, "My Post")).toBe(
      "content/blog/My-Post.md"
    );
  });

  it("includes path property value", () => {
    expect(buildFilePath("content", "legal", "en", "Privacy Policy")).toBe(
      "content/legal/en/Privacy-Policy.md"
    );
  });

  it("handles nested path property", () => {
    expect(buildFilePath("content", "legal", "en/policies", "privacy")).toBe(
      "content/legal/en/policies/privacy.md"
    );
  });

  it("skips empty path property", () => {
    expect(buildFilePath("content", "blog", "", "post")).toBe(
      "content/blog/post.md"
    );
  });

  it("skips whitespace-only path property", () => {
    expect(buildFilePath("content", "blog", "   ", "post")).toBe(
      "content/blog/post.md"
    );
  });

  it("sanitizes filename", () => {
    expect(buildFilePath("content", "blog", undefined, "My <Post>")).toBe(
      "content/blog/My-Post.md"
    );
  });
});
