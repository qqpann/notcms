import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  auditDocs,
  auditPublishedReadmes,
  checkConfigKeys,
  extractSnippets,
  findRelativeLinks,
  publishedReadmes,
  typecheckSnippets,
} from "./check-docs.mjs";

test("reports broken links, missing English sources, and missing navigation without treating code as links", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "docs-links-"));
  try {
    await mkdir(path.join(root, "en"));
    await mkdir(path.join(root, "ja"));
    await writeFile(path.join(root, "logo.svg"), "<svg />");
    await writeFile(
      path.join(root, "docs.json"),
      JSON.stringify({
        logo: {
          href: "https://notcms.com",
          dark: "/missing-logo.svg",
          light: "/logo.svg",
        },
        navbar: { links: [{ label: "Home", href: "https://www.notcms.com" }] },
        navigation: {
          global: {
            anchors: [
              {
                anchor: "Missing",
                href: "https://docs.notcms.com/en/missing-anchor",
              },
            ],
          },
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
        "[Old website](https://notcms.com/blog)",
        '```ts\nconst sample = "[Example](/not-a-link)";\n```',
      ].join("\n")
    );
    await writeFile(path.join(root, "ja/page.mdx"), "# Page");
    await writeFile(
      path.join(root, "en/untranslated.mdx"),
      "# English-only page"
    );
    await writeFile(
      path.join(root, "ja/orphan.mdx"),
      "# Missing English source"
    );
    const { errors } = await auditDocs(root);
    assert.ok(
      errors.some((e) =>
        e.includes("docs.json.logo.href: use https://www.notcms.com")
      )
    );
    assert.ok(
      errors.some((e) =>
        e.includes("docs.json.logo.dark: missing link target /missing-logo.svg")
      )
    );
    assert.ok(
      errors.some((e) =>
        e.includes(
          "docs.json.navigation.global.anchors[0].href: missing link target"
        )
      )
    );
    assert.ok(
      errors.some((e) => e.includes("en/page.mdx: use https://www.notcms.com"))
    );
    assert.ok(!errors.some((e) => /navbar|logo.light/.test(e)));
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
    assert.ok(!errors.some((e) => e.includes("untranslated.mdx")));
    assert.ok(
      errors.some((e) => e.includes("ja/orphan.mdx: missing en counterpart"))
    );
    assert.ok(
      !errors.some((e) => e.includes("ja/page.mdx: missing en counterpart"))
    );
    assert.ok(!errors.some((e) => /not-a-link|example.com|\.\/page/.test(e)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects mint.json keys that Mintlify ignores in docs.json", () => {
  const errors = checkConfigKeys({
    topbarLinks: [],
    topbarCtaButton: {},
    modeToggle: { default: "dark" },
    footerSocials: {},
    anchors: [],
    analytics: {},
    feedback: {},
    i18n: [],
    metadata: { timestamp: true, "og:site_name": "NotCMS" },
  });
  for (const [key, replacement] of [
    ["topbarLinks", "navbar.links"],
    ["topbarCtaButton", "navbar.primary"],
    ["modeToggle", "appearance"],
    ["footerSocials", "footer.socials"],
    ["anchors", "navigation.global.anchors"],
    ["analytics", "integrations"],
    ["feedback", "the Mintlify dashboard"],
    ["i18n", "navigation.languages"],
  ]) {
    assert.ok(
      errors.some(
        (e) => e.includes(`docs.json: ${key} is`) && e.endsWith(replacement)
      ),
      key
    );
  }
  assert.ok(
    errors.includes(
      "docs.json: move og:site_name from metadata to seo.metatags"
    )
  );
  assert.equal(errors.length, 9);
  assert.deepEqual(
    checkConfigKeys({
      appearance: { default: "dark" },
      navbar: { links: [] },
      footer: { socials: {} },
      metadata: { timestamp: true },
      seo: { metatags: { "og:site_name": "NotCMS" } },
    }),
    []
  );
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

test("finds relative links that break when a registry shows the published README", () => {
  const source = [
    "[Docs](https://docs.notcms.com/en/introduction) [Section](#install)",
    "[Migration](../../docs/en/cli-commands/migration.mdx) [Local](./CHANGELOG.md)",
    '<img src="https://docs.notcms.com/assets/notcms-icon.png"> <img src="./logo.png">',
    "[mail](mailto:support@example.com)",
    "[npm-url]: https://www.npmjs.com/package/notcms",
    "[local-ref]: docs/guide.md",
    "[^note]: A footnote, not a link.",
    "```md",
    "[Inside code](../ignored.md)",
    "```",
  ].join("\n");

  assert.deepEqual(findRelativeLinks(source), [
    "../../docs/en/cli-commands/migration.mdx",
    "./CHANGELOG.md",
    "./logo.png",
    "docs/guide.md",
  ]);
});

test("the published SDK README uses only absolute links", async () => {
  assert.deepEqual(publishedReadmes, ["packages/notcms/README.md"]);
  assert.deepEqual(await auditPublishedReadmes(), []);
});
