import type { PageData } from "./notcms-client.js";

/**
 * Sanitize a path segment (directory name or filename).
 * Preserves CJK characters, removes filesystem-forbidden chars.
 */
export function sanitizeSegment(value: string): string {
  const result = value
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "") // FS forbidden chars
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/^[-.]+/, "") // leading dots/hyphens
    .replace(/-+$/, "") // trailing hyphens
    .trim();
  return result || "untitled";
}

/**
 * Resolve a file_path template like "content/{category}/{locale}/{filename}.md"
 * by substituting {var} placeholders with page data.
 *
 * Placeholders are resolved in this order:
 *   1. page.properties[key] — Notion property (takes priority)
 *   2. Built-in fallbacks: {title} → page title, {db} → DB name, {id} → page ID
 *
 * Each substituted value is sanitized for filesystem safety.
 *
 * Returns { path, missingKeys }. When missingKeys is non-empty, path is unreliable.
 */
export function resolveFilePath(
  template: string,
  page: PageData,
  dbName: string
): { path: string; missingKeys: string[] } {
  const missingKeys: string[] = [];

  const resolved = template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    let value: string | undefined;

    // Properties take priority over built-in variables
    const prop = page.properties?.[key];
    if (prop != null) {
      value = Array.isArray(prop) ? prop.join(",") : String(prop);
    } else if (key === "title") {
      value = page.title ?? undefined;
    } else if (key === "db") {
      value = dbName;
    } else if (key === "id") {
      value = page.id;
    }

    if (value === undefined || value === "") {
      missingKeys.push(key);
      return "";
    }

    return sanitizeSegment(value);
  });

  return { path: resolved, missingKeys };
}
