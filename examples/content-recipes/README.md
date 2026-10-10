# Blog and release-note recipes

The sample schema and `content.ts` cover typed list/detail queries, publication
rules, language fallback, stable ID URLs, and propagation of CMS failures.
These are adjustable application policies, not new API filtering capabilities.

- [English integration guide](../../docs/en/examples/content-recipes.mdx)
- [日本語の導入ガイド](../../docs/ja/examples/content-recipes.mdx)
- [Sample schema](schema.ts)
- [Typed selectors and server reader](content.ts)

Create and sync the two Notion databases described in the guide. Install
`notcms`, run `npx notcms init`, and copy `content.ts` next to your generated
`src/notcms/schema.ts`. Replace the sample IDs by pulling your own schema;
`sample_blog` and `sample_releases` cannot fetch real data.
If your database/property names differ, update the selectors and types to match.

The SDK tests import these exact source files. From the NotCMSApp workspace:

```bash
pnpm --filter notcms build
pnpm --filter notcms typecheck
pnpm --filter notcms exec vitest run test/content-recipes.spec.ts
```

Tests use a synthetic schema and fake HTTP responses, never live CMS data.
No framework-specific application is bundled with this example. The guide
provides Next.js routes; run your application's typecheck/build after copying
and adapting them. Markdown is initially shown as escaped plain text so the
example does not need a renderer. Add a renderer and HTML sanitization when
rendering rich content.
