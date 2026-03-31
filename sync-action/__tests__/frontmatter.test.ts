import matter from "gray-matter";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateMarkdown } from "../src/markdown/frontmatter.js";
import type { PageData } from "../src/notcms-client.js";

describe("generateMarkdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-24T15:00:00.000Z"));
  });

  const basePage: PageData = {
    id: "abc123-def456",
    title: "Privacy Policy",
    properties: {
      description: "Acme Privacy Policy",
      last_edited_time: "2026-03-24T12:00:00.000Z",
    },
    content: "# Privacy Policy\n\nWe respect your privacy...",
  };

  it("generates valid frontmatter with properties", () => {
    const result = generateMarkdown(basePage, "legal");
    const parsed = matter(result);

    expect(parsed.data.title).toBe("Privacy Policy");
    expect(parsed.data.description).toBe("Acme Privacy Policy");
    expect(parsed.data.last_edited_time).toBe("2026-03-24T12:00:00.000Z");
    expect(parsed.data.notcms_id).toBe("abc123-def456");
    expect(parsed.data.notcms_db).toBe("legal");
    expect(parsed.data.notcms_last_synced_at).toBe("2026-03-24T15:00:00.000Z");
  });

  it("includes content body", () => {
    const result = generateMarkdown(basePage, "legal");
    const parsed = matter(result);

    expect(parsed.content.trim()).toBe(
      "# Privacy Policy\n\nWe respect your privacy..."
    );
  });

  it("handles null content", () => {
    const page: PageData = { ...basePage, content: null };
    const result = generateMarkdown(page, "legal");
    const parsed = matter(result);

    expect(parsed.content.trim()).toBe("");
    expect(parsed.data.notcms_id).toBe("abc123-def456");
  });

  it("handles null properties", () => {
    const page: PageData = { ...basePage, properties: null };
    const result = generateMarkdown(page, "legal");
    const parsed = matter(result);

    expect(parsed.data.title).toBe("Privacy Policy");
    expect(parsed.data.notcms_id).toBe("abc123-def456");
  });

  it("handles array properties", () => {
    const page: PageData = {
      ...basePage,
      properties: { tags: ["news", "policy"] },
    };
    const result = generateMarkdown(page, "legal");
    const parsed = matter(result);

    expect(parsed.data.tags).toEqual(["news", "policy"]);
  });

  it("handles boolean properties", () => {
    const page: PageData = {
      ...basePage,
      properties: { published: true },
    };
    const result = generateMarkdown(page, "legal");
    const parsed = matter(result);

    expect(parsed.data.published).toBe(true);
  });

  it("handles null title", () => {
    const page: PageData = { ...basePage, title: null };
    const result = generateMarkdown(page, "blog");
    const parsed = matter(result);

    expect(parsed.data.title).toBeUndefined();
  });
});
