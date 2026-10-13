# Astro example

A static blog with a published list, ID-based detail routes, and cover images.
For the rendering and publication choices, read the [Astro guide](https://docs.notcms.com/en/examples/astro).

## Run it in a new project

Use a Node version supported by Astro. This example was checked with Node 24,
Astro 6.4.8, Vite 7.3.5, and NotCMS 0.4.0; it does not require `getFirst`.

1. In Notion, create a `blog` database with `title` (Title), `published` (Checkbox),
   `slug` (Text), and `cover` (Files & media). Add a published post with a body and
   cover, and an unpublished draft. Connect it in NotCMS and wait for synchronization.
2. Create an Astro project and install NotCMS:

   ```sh
   npm create astro@latest -- astro-notcms --template minimal --no-install --no-git
   cd astro-notcms
   npm install astro@6.4.8 notcms@0.4.0
   npm install --save-dev vite@7.3.5
   npx notcms init
   ```

3. Select your workspace and generate `src/notcms/schema.ts`. Copy this example's
   `astro.config.mjs` and `src/pages/blog/` into that project. Adapt `blog` and the
   property names if the generated schema uses different names.
4. Keep `.env.local` out of Git. The config loads its `NOTCMS_` values before the
   generated client is imported; deployment environment values take precedence.
5. Run `npm run build` and `npm run preview`. Open `/blog/` and follow a post link.
   Check the body and cover; the draft should have no generated route.

Only synchronize content intended for the workspace's consumers. The `published`
filter is a site rule, not access control, and image URLs are public. Deploy fresh
build output after unpublishing. The example renders Markdown as escaped text;
choose a renderer and sanitize its HTML when adding formatted content.

## Verify with fixture content

Build the SDK, then run from the repository root:

```sh
node scripts/verify-astro-guide.mjs /path/to/node_modules
```

The supplied directory must contain Astro and Vite. The check builds a temporary
copy of this example with a fixture API and verifies list/detail/images, escaping,
draft exclusion, secret omission, and failure on API errors. It does not use a
real Notion workspace or deploy to a host.
