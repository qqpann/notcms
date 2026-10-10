import { parseMarkdown as matter } from "./yaml.js";

export interface NotCmsMetadata {
  id: string;
  db: string;
}

/**
 * Order-independent deep equality for plain JSON-serializable values.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }

  if (typeof a === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => key in bObj && deepEqual(aObj[key], bObj[key]));
  }

  return false;
}

function removeVolatileFrontmatter(
  data: Record<string, unknown>
): Record<string, unknown> {
  const stableData = { ...data };
  delete stableData.notcms_last_synced_at;
  return stableData;
}

/**
 * Compare generated Markdown while ignoring volatile sync metadata.
 */
export function hasMeaningfulMarkdownChange(
  existingContent: string,
  newContent: string
): boolean {
  try {
    const existing = matter(existingContent);
    const generated = matter(newContent);

    if (
      !deepEqual(
        removeVolatileFrontmatter(existing.data),
        removeVolatileFrontmatter(generated.data)
      )
    ) {
      return true;
    }

    return existing.content.trim() !== generated.content.trim();
  } catch {
    return true;
  }
}

export function readNotCmsMetadata(content: string): NotCmsMetadata | null {
  try {
    const parsed = matter(content);
    const { notcms_id: id, notcms_db: db } = parsed.data;

    if (typeof id !== "string" || typeof db !== "string") {
      return null;
    }

    return { id, db };
  } catch {
    return null;
  }
}
