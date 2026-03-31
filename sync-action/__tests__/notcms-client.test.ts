import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPages, fetchSchema } from "../src/notcms-client.js";

describe("notcms-client", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("fetchSchema", () => {
    it("returns schema on success", async () => {
      const mockSchema = {
        blog: { id: "db-uuid-1", properties: { title: "title" } },
        legal: { id: "db-uuid-2", properties: { title: "title" } },
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ schema: mockSchema }), {
          status: 200,
        })
      );

      const result = await fetchSchema(
        "https://api.notcms.com/v1",
        "ws-123",
        "secret-key"
      );

      expect(result).toEqual(mockSchema);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.notcms.com/v1/ws/ws-123/schema",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer secret-key",
          }),
        })
      );
    });

    it("throws on HTTP error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("Unauthorized", {
          status: 401,
          statusText: "Unauthorized",
        })
      );

      await expect(
        fetchSchema("https://api.notcms.com/v1", "ws-123", "bad-key")
      ).rejects.toThrow("Failed to fetch schema: 401 Unauthorized");
    });

    it("throws on invalid schema shape", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ schema: null }), { status: 200 })
      );

      await expect(
        fetchSchema("https://api.notcms.com/v1", "ws-123", "key")
      ).rejects.toThrow("Invalid schema response");
    });
  });

  describe("fetchPages", () => {
    it("returns pages with content", async () => {
      const mockPages = [
        {
          id: "page-1",
          title: "Post 1",
          properties: { slug: "post-1" },
          content: "# Post 1\nHello",
        },
      ];

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ data: mockPages }), { status: 200 })
      );

      const result = await fetchPages(
        "https://api.notcms.com/v1",
        "ws-123",
        "db-uuid",
        "key"
      );

      expect(result).toEqual(mockPages);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.notcms.com/v1/ws/ws-123/db/db-uuid/pages?include=content",
        expect.anything()
      );
    });

    it("throws on HTTP error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("Not Found", { status: 404, statusText: "Not Found" })
      );

      await expect(
        fetchPages("https://api.notcms.com/v1", "ws-123", "bad-db", "key")
      ).rejects.toThrow("Failed to fetch pages: 404 Not Found");
    });
  });
});
