# notcms

## 0.2.1

### Patch Changes

- 561a6ae: Update the Next.js blog example to Next.js 16 and React 19.

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
