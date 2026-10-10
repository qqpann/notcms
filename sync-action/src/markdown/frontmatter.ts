import type { PageData } from "../notcms-client.js";
import { stringifyMarkdown } from "./yaml.js";

/**
 * Generate a Markdown file string with YAML frontmatter from page data.
 */
export function generateMarkdown(page: PageData, dbName: string): string {
  const frontmatterData: Record<string, unknown> = { ...page.properties };

  // Override title with page.title (the canonical Notion page title)
  if (page.title != null) {
    frontmatterData.title = page.title;
  }

  // Add notcms metadata (always takes precedence)
  frontmatterData.notcms_id = page.id;
  frontmatterData.notcms_db = dbName;
  frontmatterData.notcms_last_synced_at = new Date().toISOString();

  const content = page.content ?? "";

  return stringifyMarkdown(content, frontmatterData);
}
