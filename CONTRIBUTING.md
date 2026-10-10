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

公開SDKまたはバンドル済みCLIを変更するPRにはchangesetが必要です。ワークフロー、文書、非公開Actionのみの変更は各検証・公開手順に従います。開発ツールはNode24・pnpm11を使います。[依存関係のセキュリティ](./docs/dependency-security.md)も参照してください。

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

マージ後は段階的公開を準備し、npm公開には所有者の承認が必要です。
