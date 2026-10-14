import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  auditDocs,
  extractSnippets,
  typecheckSnippets,
} from "./check-docs.mjs";

test("reports broken links and missing translations/navigation without treating code as links", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "docs-links-"));
  try {
    await mkdir(path.join(root, "en"));
    await mkdir(path.join(root, "ja"));
    await writeFile(
      path.join(root, "docs.json"),
      JSON.stringify({
        navigation: {
          languages: [
            {
              language: "en",
              groups: [
                {
                  pages: [
                    "en/page",
                    { group: "Nested", pages: ["en/missing"] },
                  ],
                },
              ],
            },
            { language: "ja", groups: [{ pages: ["ja/page"] }] },
          ],
        },
      })
    );
    await writeFile(
      path.join(root, "en/page.mdx"),
      [
        "[Good](/ja/page) [Relative](./page) [External](https://example.com/absent)",
        '[Bad](/en/missing) <Card href="/en/absent" />',
        "[Absolute](https://docs.notcms.com/en/deleted)",
        '```ts\nconst sample = "[Example](/not-a-link)";\n```',
      ].join("\n")
    );
    await writeFile(path.join(root, "ja/page.mdx"), "# Page");
    await writeFile(
      path.join(root, "en/untranslated.mdx"),
      "# Missing translation"
    );
    const { errors } = await auditDocs(root);
    assert.ok(
      errors.some((e) =>
        e.includes("docs.json: missing link target /en/missing")
      )
    );
    assert.ok(
      errors.some((e) =>
        e.includes("page.mdx: missing link target /en/missing")
      )
    );
    assert.ok(errors.some((e) => e.includes("/en/absent")));
    assert.ok(errors.some((e) => e.includes("/en/deleted")));
    assert.ok(
      errors.some((e) => e.includes("untranslated.mdx: missing ja counterpart"))
    );
    assert.ok(!errors.some((e) => /not-a-link|example.com|\.\/page/.test(e)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("compiles the published code and rejects missing schema and incorrect content access", async () => {
  const source =
    '{/* docs-check */}\n```ts\nimport { nc } from "./notcms/schema";\nconst [post, error] = await nc.query.blog.getFirst({ where: { published: true } });\nif (error) throw error;\nconsole.log(post?.content);\n```';
  const snippets = extractSnippets(source, "en/usage/get.mdx");
  assert.equal(snippets.length, 1);
  assert.deepEqual(await typecheckSnippets(snippets), []);
  const broken = [
    {
      ...snippets[0],
      code: snippets[0].code.replace(
        "post?.content",
        "post?.properties.content"
      ),
    },
    {
      file: "en/setup.mdx",
      line: 10,
      code: 'import { Client } from "notcms"; new Client({ secretKey: "example" });',
    },
  ];
  const errors = await typecheckSnippets(broken);
  assert.ok(
    errors.some((e) => e.includes("en/usage/get.mdx:") && e.includes("content"))
  );
  assert.ok(
    errors.some((e) => e.includes("en/setup.mdx:10") && e.includes("schema"))
  );
});
