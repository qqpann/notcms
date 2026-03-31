import matter from "gray-matter";
import type { PageData } from "../notcms-client.js";

/**
 * Generate a Markdown file string with YAML frontmatter from page data.
 */
export function generateMarkdown(page: PageData, dbName: string): string {
  const frontmatterData: Record<string, unknown> = {};

  // Add all properties first (may include "title" from Notion properties)
  if (page.properties) {
    for (const [key, value] of Object.entries(page.properties)) {
      frontmatterData[key] = value;
    }
  }

  // Override title with page.title (the canonical Notion page title)
  if (page.title != null) {
    frontmatterData.title = page.title;
  }

  // Add notcms metadata (always takes precedence)
  frontmatterData.notcms_id = page.id;
  frontmatterData.notcms_db = dbName;
  frontmatterData.notcms_last_synced_at = new Date().toISOString();

  const content = page.content ?? "";

  return matter.stringify(content, frontmatterData);
}
