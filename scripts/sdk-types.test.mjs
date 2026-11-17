import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// Type-checks projects that install the built package, because the published
// declaration files can differ from the source the unit tests compile.
// Run `pnpm run build` in packages/notcms first.
const root = fileURLToPath(new URL("..", import.meta.url));
const packageDirectory = path.join(root, "packages", "notcms");

// The TypeScript versions this repository already installs: 7 for the
// workspace typecheck and 6 for tsup's declaration build.
const compilers = [
  path.join(root, "node_modules", "typescript", "bin", "tsc"),
  path.join(packageDirectory, "node_modules", "typescript", "bin", "tsc"),
];

const consumers = [
  {
    name: "an ES module project with bundler resolution",
    type: "module",
    module: "esnext",
    moduleResolution: "bundler",
  },
  {
    name: "an ES module project with Node.js resolution",
    type: "module",
    module: "node16",
    moduleResolution: "node16",
  },
  {
    name: "a CommonJS project with Node.js resolution",
    type: "commonjs",
    module: "node16",
    moduleResolution: "node16",
  },
];

const source = `import { Client } from "notcms";

const schema = {
  blog: {
    id: "db_fixture",
    properties: {
      language: "select",
      state: "status",
      tags: "multi_select",
      published: "checkbox",
    },
    options: {
      language: ["en", "ja"],
      state: ["Draft", "Published"],
      tags: ["AI", "Web"],
    },
  },
} as const;

const client = new Client({
  secretKey: "fixture",
  workspaceId: "fixture",
  schema,
});

export async function readBlog() {
  const [pages] = await client.query.blog.list();
  const [pagesWithContent] = await client.query.blog.list({
    include: ["content"],
  });
  const [page] = await client.query.blog.get("page");
  const [first] = await client.query.blog.getFirst();
  if (!pages?.[0] || !pagesWithContent?.[0] || !page || !first) return;

  const language: "en" | "ja" | null = pages[0].properties.language;
  const state: "Draft" | "Published" | null = page.properties.state;
  const tags: ("AI" | "Web")[] | null = first.properties.tags;
  const published: boolean | null = first.properties.published;
  const content: string = pagesWithContent[0].content;
  // @ts-expect-error list() keeps the select choices
  const otherLanguage: (typeof pages)[number]["properties"]["language"] = "fr";
  // @ts-expect-error get() keeps the status choices
  const otherState: typeof page.properties.state = "Archived";
  // @ts-expect-error getFirst() keeps the multi_select choices
  const otherTags: typeof first.properties.tags = ["Other"];
  // @ts-expect-error list() omits content unless it is included
  pages[0].content;
  return [language, state, tags, published, content, otherLanguage, otherState, otherTags];
}
`;

for (const compiler of compilers) {
  const version = spawnSync(process.execPath, [compiler, "--version"], {
    encoding: "utf8",
  }).stdout.trim();

  for (const consumer of consumers) {
    test(`${version}: the built package type-checks in ${consumer.name}`, async () => {
      const directory = await mkdtemp(path.join(tmpdir(), "notcms-types-"));
      try {
        await mkdir(path.join(directory, "node_modules"));
        await symlink(
          packageDirectory,
          path.join(directory, "node_modules", "notcms"),
          "dir"
        );
        await writeFile(
          path.join(directory, "package.json"),
          JSON.stringify({ private: true, type: consumer.type })
        );
        await writeFile(
          path.join(directory, "tsconfig.json"),
          JSON.stringify({
            compilerOptions: {
              module: consumer.module,
              moduleResolution: consumer.moduleResolution,
              target: "es2022",
              strict: true,
              noEmit: true,
              // Check the published declaration files too.
              skipLibCheck: false,
              types: [],
            },
            files: ["index.ts"],
          })
        );
        await writeFile(path.join(directory, "index.ts"), source);

        const result = spawnSync(
          process.execPath,
          [compiler, "--project", directory],
          { encoding: "utf8" }
        );
        assert.equal(
          result.status,
          0,
          `${result.stdout}${result.stderr}`.trim() || "tsc failed"
        );
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    });
  }
}
