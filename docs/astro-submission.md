# Astro CMS guide submission plan

Checked 2026-10-12: [CMS overview](https://docs.astro.build/en/guides/cms/),
[Contributor Manual](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md),
[current CMS sources](https://github.com/withastro/docs/tree/main/src/content/docs/en/guides/cms).
The contribution guide asks for new content to be discussed in an issue/discussion
first and submitted in English. CMS pages include resource stubs, so a short
resource page is a possible starting point; acceptance is the maintainers' decision.

## Proposed issue (not submitted)

Title: Add a NotCMS integration resource to the CMS guides

NotCMS synchronizes Notion databases to an API and provides a TypeScript SDK.
We maintain an Astro guide explaining rendering choices, publication rules,
content queries, and images, with a runnable static blog example. Would a resource stub linking to this maintained
guide fit the CMS section? We can expand the page if you prefer an inline guide.

Guide: https://docs.notcms.com/en/examples/astro
SDK: https://github.com/qqpann/notcms

## Proposed English page

Proposed path: `src/content/docs/en/guides/cms/notcms.mdx` in `withastro/docs`.
Register an approved NotCMS logo under the `notcms` key in the upstream CMS logo
registry before adding this page; its required `logo` field must use a registered key.

```mdx
---
title: NotCMS & Astro
description: Fetch typed Notion content in Astro with NotCMS.
sidebar:
  label: NotCMS
type: cms
logo: notcms
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
   containing getFirst and semantic checks before proposing it upstream.
2. Open the prepared proposal via https://github.com/withastro/docs/issues/new/choose
   or https://github.com/withastro/docs/discussions. Check for duplicates first.
3. After maintainer feedback, submit the English page to `withastro/docs:main`,
   following its current template and navigation conventions. Register an approved
   NotCMS logo and use its key in the required `logo` frontmatter field. Let upstream's
   translation process handle other languages. Check its rendered PR preview.
4. Track acceptance separately; no upstream issue/PR has been sent by this change.

## Verify the example

See [the Astro example](../examples/astro/README.md) for setup and the fixture
check. The check builds the maintained source files rather than extracting code
from the guide. Guide wording and section order can change without changing the
example or its verification. Real Notion onboarding and production deployment
remain environment-specific checks.
