# Dependency security

The October 2026 refresh removes vulnerable dependency paths from the Sync Action and SDK CLI, and updates build tooling through `pnpm-lock.yaml`. The Action dependency change is reviewed separately.

- Upgrade Changesets CLI to 3.0.3: its new dependency graph removes the old js-yaml/argparse/sprintf-js path. Contributor tooling uses Node 24 and pnpm 11; the published SDK still supports Node >=18.17.
- Remove ts-node, which is unused in build/test workflows, eliminating its vulnerable diff dependency. Legacy VS Code launch entries still reference ts-node/Jest; those obsolete debugger settings require a separate update.
- Refresh compatible transitive versions, including brace-expansion, cross-spawn, glob, minimatch, picomatch and rollup. The SDK patch changeset covers rebuilt CLI dependencies.
- Override postcss-selector-parser to 7.1.6 for Tailwind 3/PostCSS, and tmp to 0.2.7 for legacy external-editor consumers. These cross-version overrides require demo build/visual checks and an actual external-editor temporary-file compatibility check. No install-hook permissions are expanded.

### Remaining upstream advisory

`pnpm audit` still reports one high advisory for braces 3.0.3: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). npm reports >=3.0.4 as patched, but no such release is published; the GitHub advisory lists no patched version. [Upstream issue #70](https://github.com/micromatch/braces/issues/70) remains open and the maintainer disputes the reported threat model.

The installed paths are confined to the demo's Tailwind devDependency (chokidar and micromatch/fast-glob). They process repository-controlled glob patterns during builds and local file watching, rather than SDK or Action request data. Do not pass untrusted user-defined glob patterns to this toolchain. No advisory is suppressed or represented as fixed. Recheck the upstream release before removing this note; a Tailwind major migration is a separate decision.

For npm release approval, follow [staged publishing](./npm-staged-publishing.md). The changeset prepares a future SDK patch release; it does not republish 0.3.0 or approve publication automatically.
