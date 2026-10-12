# Astro CMS guide submission plan

Related: https://github.com/qqpann/NotCMSApp/issues/125

Checked 2026-10-12: [CMS overview](https://docs.astro.build/en/guides/cms/),
[Contributor Manual](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md),
[current CMS sources](https://github.com/withastro/docs/tree/main/src/content/docs/en/guides/cms).
The contribution guide asks for new content to be discussed in an issue/discussion
first and submitted in English. CMS pages include resource stubs, so a short
resource page is a possible starting point; acceptance is the maintainers' decision.

## Proposed issue (not submitted)

Title: Add a NotCMS integration resource to the CMS guides

NotCMS synchronizes Notion databases to an API and provides a TypeScript SDK.
We maintain an Astro guide showing setup from a new project, schema generation,
server-only credentials, filtered lists, static detail pages, public images,
and request-time slug lookup. Would a resource stub linking to this maintained
guide fit the CMS section? We can expand the page if you prefer an inline guide.

Guide: https://docs.notcms.com/en/examples/astro
SDK: https://github.com/qqpann/notcms

## Proposed English page

Proposed path: `src/content/docs/en/guides/cms/notcms.mdx` in `withastro/docs`.

```mdx
---
title: NotCMS & Astro
description: Fetch typed Notion content in Astro with NotCMS.
sidebar:
  label: NotCMS
type: cms
i18nReady: true
stub: true
---

[NotCMS](https://www.notcms.com/) synchronizes Notion databases and provides a
TypeScript SDK for fetching pages and their content.

## Resources

- [Build an Astro blog with NotCMS](https://docs.notcms.com/en/examples/astro):
  Generate a schema, list published pages, create static detail routes, and display images.
- [NotCMS SDK and CLI](https://github.com/qqpann/notcms)
```

## Submission order

1. Merge and publish this guide; verify the public guide URL and the SDK release
   containing findFirst and semantic checks before proposing it upstream.
2. Open the prepared proposal via https://github.com/withastro/docs/issues/new/choose
   or https://github.com/withastro/docs/discussions. Check for duplicates first.
3. After maintainer feedback, submit the English page to `withastro/docs:main`,
   following its current template and navigation conventions. Supply an approved
   NotCMS logo if required by the CMS card component. Let upstream's
   translation process handle other languages. Check its rendered PR preview.
4. Track acceptance separately; no upstream issue/PR has been sent by this change.

## Reproduce the local guide check

Build the SDK, install Astro 6.4.8 and Vite 7.3.5 in a scratch project, and run
`node scripts/verify-astro-guide.mjs /absolute/path/to/scratch/node_modules` from
this repository. The script extracts the actual English guide snippets, checks
that Japanese snippets match, generates a schema from a fixture API, and builds
a fresh temporary Astro project. It verifies list/detail/image HTML, escaped
content, draft route exclusion, absence of the fixture secret in HTML, and
build failure when the API fails. This verifies the static guide; real Notion
onboarding and production host configuration remain environment-specific checks.
