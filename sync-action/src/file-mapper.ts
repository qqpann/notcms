import path from "node:path";

/**
 * Minimal filename sanitization that preserves CJK characters.
 * Only removes filesystem-forbidden characters.
 */
export function sanitizeFilename(title: string): string {
  const result = title
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "") // FS forbidden chars
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/^[-.]+/, "") // leading dots/hyphens
    .replace(/-+$/, "") // trailing hyphens
    .trim();
  return result || "untitled";
}

/**
 * Parse the `databases` input parameter.
 * Format: "dbName:dirPath" lines, newline-separated.
 * Returns a Map of dbName → dirPath.
 */
export function parseDatabasesParam(
  input: string | undefined
): Map<string, string> {
  const map = new Map<string, string>();
  if (!input?.trim()) return map;

  for (const line of input.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;
    const dbName = trimmed.slice(0, colonIndex).trim();
    const dirPath = trimmed.slice(colonIndex + 1).trim();
    if (dbName && dirPath) {
      map.set(dbName, dirPath);
    }
  }
  return map;
}

/**
 * Resolve the directory for a database.
 * If databasesMap is non-empty, only mapped databases are included (returns null for unmapped).
 * If databasesMap is empty, uses the DB name as directory.
 */
export function resolveDbDir(
  dbName: string,
  databasesMap: Map<string, string>
): string | null {
  if (databasesMap.size === 0) return dbName;
  return databasesMap.get(dbName) ?? null;
}

/**
 * Build the full file path for a page.
 */
export function buildFilePath(
  contentDir: string,
  dbDir: string,
  pathPropertyValue: string | undefined,
  filename: string
): string {
  const sanitized = sanitizeFilename(filename);
  const parts = [contentDir, dbDir];
  if (pathPropertyValue?.trim()) {
    parts.push(pathPropertyValue.trim());
  }
  parts.push(`${sanitized}.md`);
  return path.join(...parts);
}
