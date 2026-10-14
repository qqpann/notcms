# Contribution Guide

## Local development notcms-kit

```bash
cd packages/notcms-kit

# if first time, you may need to run also:
# pnpm config set prefix ~/.pnpm-global
pnpm link --global

# watch the changes while you code
pnpm watch
```

In case you want to remove from global

```sh
pnpm remove --global notcms-kit
```

Make sure to check before submitting a PR.

```sh
pnpm check
```

## Changesets (Version Management)

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

**Changes to the published SDK or bundled CLI must include a changeset.** Workflow-only, documentation-only and private Action changes use their own validation/release process. Contributor tooling uses Node 24 and pnpm 11. See [dependency security](./docs/dependency-security.md).

### How to add a changeset

1. After making your changes, run:

   ```bash
   pnpm changeset
   ```

2. Select the packages being changed (use spacebar to select, enter to confirm)

3. Choose the version bump type:
   - `patch` - Bug fixes, minor improvements
   - `minor` - New features (backwards compatible)
   - `major` - Breaking changes

4. Write a brief description of your changes (this will appear in the CHANGELOG)

5. Commit the generated changeset file along with your changes:

   ```bash
   git add .changeset/
   git commit -m "chore: add changeset"
   ```

### Release Process

When changes with changesets are merged to `main`:

1. A "Version Packages" PR is automatically created
2. This PR updates versions and CHANGELOGs
3. After merge, packages are staged; an owner must approve npm publication as described in [staged publishing](./docs/npm-staged-publishing.md).


## Documentation

- Start with the concept or decision the reader needs to understand.
- Show the smallest example that explains that point. Omit unrelated setup and page boilerplate.
- Introduce the common case before alternatives and edge cases. Link to setup guides and references instead of repeating them.
- Keep runnable applications in `examples/` and verify those source files. Do not couple their tests to prose or section order.
- Use bullets for independent changes in PR descriptions and changesets. Add a short code example when an API change affects how users write code.
- Keep English and Japanese guidance aligned in meaning; examples should use the same API.

For structure, see Drizzle's [schema](https://orm.drizzle.team/docs/sql-schema-declaration),
[select](https://orm.drizzle.team/docs/select), and [migrations](https://orm.drizzle.team/docs/migrations) guides.

### Publishing and checking documentation

The public site at `https://docs.notcms.com` is built by Mintlify from this
repository's `main` branch, with `docs` as the configured subdirectory.
`docs/docs.json` owns navigation and site settings; `docs/en/` and `docs/ja/`
own the public prose. The private NotCMSApp repository owns the marketing
site's links, not these pages. A documentation PR merged here can publish
independently of an npm release. Do not describe an unreleased API as available;
state the first published version when introducing a new feature.

Update English and Japanese together. Before opening a PR, run:

```sh
pnpm test:docs
pnpm check:docs
```

`check:docs` checks page/navigation links and site configuration assets against local files, language parity,
and selected code examples against the SDK source. Put the invisible MDX comment
`{/* docs-check */}` immediately before a self-contained `ts` or `typescript`
fence to include it. Core guides must retain at least one checked example.
Examples may import `./notcms/schema`; the checker supplies the illustrative
schema from `scripts/docs-schema.ts`. Add real properties to that fixture only
when the guide explains them. Other imports must resolve normally; do not stub
SDK methods or weaken types to pass the check. Examples are compiled, never run.

Use `https://www.notcms.com` for marketing-site links. The checker rejects the
bare `notcms.com` host in public MDX and site configuration, including logo and
navigation URLs. As of 2026-10-14, Vercel returns `DEPLOYMENT_NOT_FOUND` for the root domain;
its DNS/redirect setup is managed separately from Mintlify and this repository.

This check does not validate external websites, fragments, Markdown rendering,
framework-specific route behavior, or every unmarked code fence. Keep complete
applications in `examples/` and run their checks when changing them. In the
Mintlify PR preview, confirm navigation, code blocks, and both languages. After
merging, confirm the deployment in Mintlify Activity and open the published
pages. An HTTP 200 alone does not prove that the latest content was deployed.
