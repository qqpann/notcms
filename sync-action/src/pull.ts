import fs from "node:fs/promises";
import path from "node:path";
import * as core from "@actions/core";
import matter from "gray-matter";
import {
  buildFilePath,
  parseDatabasesParam,
  resolveDbDir,
} from "./file-mapper.js";
import { generateMarkdown } from "./markdown/frontmatter.js";
import { fetchPages, fetchSchema } from "./notcms-client.js";

export interface PullOptions {
  apiHost: string;
  workspaceId: string;
  secretKey: string;
  contentDir: string;
  databases?: string;
  pathProperty?: string;
  filenameProperty?: string;
}

export interface PullResult {
  filesChanged: number;
  filesWritten: string[];
  filesSkipped: number;
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

/**
 * Compare content excluding notcms_last_synced_at to avoid unnecessary diffs.
 */
function hasContentChanged(
  existingContent: string,
  newContent: string
): boolean {
  try {
    const existing = matter(existingContent);
    const generated = matter(newContent);

    // Compare frontmatter without notcms_last_synced_at
    const existingData = { ...existing.data };
    const generatedData = { ...generated.data };
    delete existingData.notcms_last_synced_at;
    delete generatedData.notcms_last_synced_at;

    if (!deepEqual(existingData, generatedData)) {
      return true;
    }

    // Compare body content
    return existing.content.trim() !== generated.content.trim();
  } catch {
    // If parsing fails, treat as changed
    return true;
  }
}

export async function pull(options: PullOptions): Promise<PullResult> {
  const {
    apiHost,
    workspaceId,
    secretKey,
    contentDir,
    databases: databasesParam,
    pathProperty,
    filenameProperty,
  } = options;

  const databasesMap = parseDatabasesParam(databasesParam);
  const filesWritten: string[] = [];
  let filesSkipped = 0;

  // 1. Fetch schema
  core.info("Fetching schema from NotCMS...");
  const schema = await fetchSchema(apiHost, workspaceId, secretKey);
  const dbNames = Object.keys(schema);
  core.info(`Found ${dbNames.length} database(s): ${dbNames.join(", ")}`);

  // 2. Process each database
  for (const dbName of dbNames) {
    const dbDir = resolveDbDir(dbName, databasesMap);
    if (dbDir === null) {
      core.info(`Skipping database "${dbName}" (not in databases filter)`);
      continue;
    }

    const db = schema[dbName];
    core.info(`Fetching pages for "${dbName}" (${db.id})...`);
    const pages = await fetchPages(apiHost, workspaceId, db.id, secretKey);
    core.info(`Found ${pages.length} page(s) in "${dbName}"`);

    for (const page of pages) {
      if (page.content == null) {
        core.warning(
          `Skipping page "${page.title ?? page.id}" — content not yet synced`
        );
        filesSkipped++;
        continue;
      }

      // Determine filename
      const filename =
        (filenameProperty && page.properties?.[filenameProperty]?.toString()) ||
        page.title ||
        "untitled";

      // Determine path property value
      const pathValue = pathProperty
        ? page.properties?.[pathProperty]?.toString()
        : undefined;

      const filePath = buildFilePath(contentDir, dbDir, pathValue, filename);
      const markdown = generateMarkdown(page, dbName);

      // Check if file already exists with same content
      const absPath = path.resolve(filePath);
      try {
        const existing = await fs.readFile(absPath, "utf-8");
        if (!hasContentChanged(existing, markdown)) {
          continue; // No meaningful change
        }
      } catch {
        // File doesn't exist — will be created
      }

      // Write file
      await fs.mkdir(path.dirname(absPath), { recursive: true });
      await fs.writeFile(absPath, markdown, "utf-8");
      filesWritten.push(filePath);
      core.info(`Written: ${filePath}`);
    }
  }

  core.info(
    `Pull complete: ${filesWritten.length} file(s) written, ${filesSkipped} skipped`
  );
  return {
    filesChanged: filesWritten.length,
    filesWritten,
    filesSkipped,
  };
}
