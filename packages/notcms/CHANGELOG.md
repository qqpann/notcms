# notcms

## 1.1.1

### Patch Changes

- 1d8d8d2: Update the dependencies bundled into the `notcms` CLI:
  
  - `commander` 12 → 15. The CLI now rejects unexpected extra arguments (for example `notcms init extra`) with an error instead of ignoring them.
  - `chalk` 5 → 6.
  - `@inquirer/prompts` 8.7 → 8.8.
- d3caabb: Make `notcms` CLI failures easier to act on:
  
  - Stop printing `MISSING_ENV_FILE` errors for default env files (`.env`, `.env.local`, `.dev.vars`) that the project does not have. A file passed with `--env` is still reported when it is missing.
  - When credentials are missing, suggest `npx notcms login` and name the env files the CLI reads, instead of suggesting `source .env`.
  - When the schema request fails, show the API's reason with a fix for the status (for example a rejected key, or a key from another workspace), say when NotCMS could not be reached, and ask for an update when a successful response is not a schema this version can read.
  - `pull` now stops with an error when `notcms.config.json` exists but is not valid JSON or has no `schema` string. It used to ignore the file and write the schema to `src/notcms/schema.ts`.
- 7bf15f6: Make the CLI help and the npm page easier to follow:
  
  - `npx notcms --help` describes what `init` and `pull` do, shows the `-e, --env` default as `.env,.env.local,.dev.vars` instead of a JSON array, names `NOTCMS_SECRET_KEY` and `NOTCMS_WORKSPACE_ID`, which let commands run without a browser login, and links to the CLI docs.
  - `notcms init --help`, `notcms login --help` and `notcms pull --help` list `-e, --env` under "Global Options".
  - The README on the npm page links to the migration checklist and the content recipes with absolute URLs, so the links work outside the repository.
  - The npm package description matches the README ("NotCMS makes it easy to create a CMS, from Notion."), so npm search results say that the content comes from Notion. The keywords add "headless cms".
- 070171d: `new Client()` now names the environment variable to set (`NOTCMS_SECRET_KEY` or `NOTCMS_WORKSPACE_ID`) when credentials are missing. The generated schema module creates the client when it is imported, so this error often appears in a deployment that lacks the variables.
- 823ce0d: Fix the published type declarations. `list()`, `get()` and `getFirst()` now keep the choices of select, status and multi_select properties in their results. In the built package these values were typed as `any`, and projects with `skipLibCheck: false` failed with "Cannot find name 'O'". Code that compares these values with choices missing from the generated schema may now report type errors; run `npx notcms pull` if the choices changed in Notion. CommonJS projects now get the CommonJS declarations, so TypeScript projects that use `"moduleResolution": "node16"` can import the package instead of failing with TS1479.

## 1.1.0

### Minor Changes

- a296b7b: Add `include: ["content"]` to `list()` to receive each page's Markdown content in the same request.
  
  ```ts
  const [posts, error] = await nc.query.blog.list({
    where: { published: true },
    include: ["content"],
  });
  // posts[0].content is typed as string
  ```
  
  Without `include`, `list()` behaves as before and returns pages without content.

## 1.0.1

### Patch Changes

- 9354c80: Type formula and rollup values as the API now returns them.
  
  - `formula` is `string | number | boolean | null`. Boolean formulas are returned as `true` / `false` instead of the strings `"true"` / `"false"`, and an empty result is `null` instead of `0` or `""`.
  - `rollup` is `string | number | string[] | null`. Rollups return their number, date string, or the rolled-up values as strings instead of the placeholder `"unsupported"`.
  - `where` accepts a boolean for formula properties.
  
  Pages return the new values after their next sync. If your code compares a formula with `"true"`, `"false"`, `0` or `""`, update it:
  
  ```ts
  // Before
  const featured = post.properties.isFeatured === "true";
  
  // After
  const featured = post.properties.isFeatured === true;
  ```

## 1.0.0

### Major Changes

- ccb71f1: NotCMS 1.0.0 is the first stable release. The SDK and CLI APIs are unchanged from 0.5.0, and from this version on they follow semantic versioning.
  
  - **Breaking:** Node.js 22 or later is required (previously 18.17). The bundled CLI's prompt and output dependencies (`@inquirer/prompts` 8, `boxen` 9) no longer run on Node.js 18, and Node.js 18 and 20 have reached end of life.

### Patch Changes

- 32527b1: Update the bundled CLI environment-file loader to dotenvx 2.
- 0b79daa: Refresh the bundled CLI parser and template dependencies.
- 81a14ed: Refresh compiler and build dependencies.
- 967575c: `notcms pull` and `notcms init` no longer fail for the whole workspace when a database has a property type this version does not support yet (for example Notion's `button`, `place`, or `verification`). Those properties are left out of the generated schema and listed in a warning; other databases and properties are generated as usual.

## 0.5.0

### Minor Changes

- 3a6a924: - Add `getFirst` with typed filters and sorting. Return the first matching page with content in one request, or `null` when no page matches.
  
    ```ts
    const [post, error] = await nc.query.blog.getFirst({
      where: { slug: "hello-world" },
    });
    if (error) throw error;
    console.log(post?.content);
    ```
  
  - Compare `pull --check` schemas semantically. Ignore formatting and key/choice order while detecting schema changes.
  - Add schema-check CI examples for pull requests and scheduled runs.
  - Add English and Japanese Astro integration guides.

## 0.4.0

### Minor Changes

- 297fccb: Add typed property filters and single-property sorting to `list()`, preserving calls without arguments. Return request-construction errors through the existing error tuple.
  
  Correct formula inference from `string | null` to `string | number | null` to match numeric API values. Code that previously assumed every non-null formula was a string must now narrow the value before using string methods.
- c0c3f6e: Support typed `where: { id: { in: [...] } }` queries to retrieve related pages in one list request.
- 7a459d3: Preserve select, status, and multi-select choice names in generated schemas. Infer literal unions for page values and query operands, keep legacy string fallbacks when options are absent, and report option changes during schema pull.
  
  The CLI requests choice metadata with `include=options`. Older CLIs keep receiving the original schema shape, so their generated modules continue to typecheck with older SDKs.

### Patch Changes

- 54afe66: Update bundled CLI dependencies to patched versions.

## 0.3.0

### Minor Changes

- 9323ae5: Complete CLI initialization through the first schema pull. `notcms init` now
  uses existing credentials or browser login, ensures `notcms` is a direct and
  resolvable project dependency with the safely detected package manager, writes
  the generated schema, and prints a safe runnable first-query example while
  preserving the standalone `login`, `pull`, and `pull --check` commands.

### Patch Changes

- 5a14295: Align the SDK README and documentation with the bundled `npx notcms` CLI and add a blog and release notes implementation recipe.
- e49affe: Add tested blog and release-note recipes covering publication dates, language fallback, stable ID URLs and error propagation.
- 133a7d2: Fix schema generation when the configured output file is at the project root.
- 561a6ae: Update the Next.js blog example to Next.js 16 and React 19.
- 7ef0ea3: Document migration from notcms-kit and prerelease SDKs to the bundled CLI, including dependency upgrades, config preservation and CI schema checks.
- b395219: Show database, ID, and property changes after `notcms pull` so schema synchronization is easier to review.

## 0.2.0

### Minor Changes

- 24036a5: Add browser login to the CLI and a CI check mode for pull

  - `notcms login`: opens the dashboard in the browser, mints a secret key for the selected workspace, and saves `NOTCMS_SECRET_KEY` / `NOTCMS_WORKSPACE_ID` to an env file (default `.env.local`)
  - `notcms init`: offers to log in via browser when credentials are missing
  - `notcms pull --check`: verifies the local schema is up to date without writing (exits 1 when stale, for CI/CD)
  - `notcms --version` now reports the actual version from package.json
  - The CLI now exits with code 1 on unhandled errors (previously errors were logged but the process exited 0)
  - Env files written by login are kept owner-only (0600): new files are created with that mode, and existing files with group/other access are tightened after the secret is written (POSIX only)

- 39ea706: Use Node.js 24 and pnpm 11 for development while keeping the published packages compatible with Node.js 18.17 and later.

### Patch Changes

- 2fcf3c9: Remove the bundler-specific `import.meta.env` fallback while retaining runtime environment lookup for Node.js, Deno, and Bun.

## 0.1.0

### Minor Changes

- f9da077: Add CLI commands to notcms package. You can now use `npx notcms init` and `npx notcms pull` directly instead of `npx notcms-kit`.
