import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Pass a node_modules directory containing the guide's Astro/Vite versions.
// The SDK must be built first. All credentials and content below are fixtures.
const root = fileURLToPath(new URL("..", import.meta.url));
const modules = path.resolve(process.argv[2] ?? "node_modules");
const project = await mkdtemp(path.join(tmpdir(), "notcms-astro-guide-"));
const guide = await readFile(
  path.join(root, "docs/en/examples/astro.mdx"),
  "utf8"
);
const japanese = await readFile(
  path.join(root, "docs/ja/examples/astro.mdx"),
  "utf8"
);
const blocks = [
  ...guide.matchAll(/```(?:astro|javascript) ([^\n]+)\n([\s\S]*?)```/g),
];
for (const [, filename, source] of blocks) {
  assert.ok(japanese.includes(source), `Japanese example differs: ${filename}`);
}
const schema = {
  blog: {
    id: "db_blog",
    properties: {
      title: "title",
      published: "checkbox",
      slug: "rich_text",
      cover: "files",
    },
  },
};
let apiFailed = false;
const server = createServer((request, response) => {
  if (request.headers.authorization !== "Bearer fixture-secret") {
    response.writeHead(401).end();
    return;
  }
  const url = new URL(request.url, "http://localhost");
  response.setHeader("content-type", "application/json");
  if (url.pathname.endsWith("/schema")) {
    response.end(JSON.stringify({ schema }));
  } else if (apiFailed) {
    response.writeHead(503).end('{"error":"fixture failure"}');
  } else if (url.pathname.endsWith("/pages")) {
    assert.deepEqual(JSON.parse(url.searchParams.get("filter")), {
      published: true,
    });
    response.end(
      JSON.stringify({
        data: [
          {
            id: "published-post",
            title: "Published fixture",
            properties: { published: true },
          },
        ],
      })
    );
  } else if (url.pathname.endsWith("/pages/published-post")) {
    response.end(
      JSON.stringify({
        data: {
          id: "published-post",
          title: "Published fixture",
          properties: {
            published: true,
            cover: ["https://images.example.test/cover.png"],
          },
          content: "Body fixture <script>alert(1)</script>",
        },
      })
    );
  } else {
    response.writeHead(404).end('{"error":"not found"}');
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" };
// Verify .env.local loading, not inherited credentials.
for (const key of Object.keys(env))
  if (key.startsWith("NOTCMS_")) delete env[key];
try {
  await mkdir(path.join(project, "node_modules"));
  for (const name of ["astro", "vite"])
    await symlink(
      path.join(modules, name),
      path.join(project, "node_modules", name)
    );
  await symlink(
    path.join(root, "packages/notcms"),
    path.join(project, "node_modules/notcms")
  );
  await writeFile(
    path.join(project, "package.json"),
    JSON.stringify({
      name: "astro-guide-fixture",
      type: "module",
      scripts: { build: "astro build" },
    })
  );
  await writeFile(
    path.join(project, "notcms.config.json"),
    JSON.stringify({ schema: "src/notcms/schema.ts" })
  );
  await writeFile(
    path.join(project, ".env.local"),
    `NOTCMS_SECRET_KEY=fixture-secret\nNOTCMS_WORKSPACE_ID=fixture-workspace\nNOTCMS_API_HOST=http://127.0.0.1:${port}/v1\n`
  );
  for (const [, filename, source] of blocks) {
    if (filename.includes("[slug]")) continue;
    const destination = path.join(project, filename);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, source);
  }
  const cli = path.join(root, "packages/notcms/dist/cli.cjs");
  assert.equal((await run(cli, ["pull"])).code, 0);
  assert.equal((await run(cli, ["pull", "--check"])).code, 0);
  const astro = path.join(modules, "astro/bin/astro.mjs");
  const build = await run(astro, ["build"]);
  assert.equal(build.code, 0, build.output);
  const index = await readFile(
    path.join(project, "dist/blog/index.html"),
    "utf8"
  );
  const detail = await readFile(
    path.join(project, "dist/blog/published-post/index.html"),
    "utf8"
  );
  assert.ok(index.includes("/blog/published-post/"));
  assert.ok(detail.includes("Published fixture"));
  assert.ok(detail.includes("Body fixture &lt;script&gt;"));
  assert.ok(detail.includes('src="https://images.example.test/cover.png"'));
  assert.deepEqual((await readdir(path.join(project, "dist/blog"))).sort(), [
    "index.html",
    "published-post",
  ]);
  assert.ok(!(index + detail).includes("fixture-secret"));
  apiFailed = true;
  assert.notEqual(
    (await run(astro, ["build"])).code,
    0,
    "API failure must stop the build"
  );
  console.log(
    "PASS: generated schema, .env.local, SSG list/detail/image, escaped body, unpublished route exclusion, secret omission, API failure"
  );
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
  await rm(project, { recursive: true, force: true });
}

function run(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: project,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      signal: AbortSignal.timeout(60000),
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.once("error", reject);
    child.once("close", (code) => resolve({ code, output }));
  });
}
