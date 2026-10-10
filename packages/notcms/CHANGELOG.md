# notcms

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
