# SDK GitHub Releases

The Changesets **Version Packages** PR is the review point for the SDK version and `packages/notcms/CHANGELOG.md`. Review the generated changelog in that PR along with the package version. After merge, `Publish` stages the package on npm; a maintainer still reviews and approves the staged package with 2FA. GitHub Releases are created only after the version is publicly available on npm.

`SDK GitHub Releases` reconciles public npm versions after a successful `Publish` run, hourly at minute 23, or through **Run workflow**. Approval often happens after the staging workflow finishes, so the scheduled run catches it later. Scheduled runs can be delayed by GitHub; use the manual run on main for immediate reconciliation. No additional npm token or approval bypass is introduced. GitHub's normal `GITHUB_TOKEN` needs `contents: write` in the release job.

## What gets published

- Each public stable `notcms` version gets one release named and tagged `notcms@X.Y.Z`. Development/prerelease versions and Sync Action tags are outside this workflow.
- The commit comes from the published version's npm `gitHead`, not the current tip of main. It must be an ancestor of main, and its package manifest must match the published name and version.
- Notes come from the changelog at that commit. All stable changelog sections after the previous **npm-published** stable version through the target version are combined by change category. For example, npm skipped `0.2.0`, so `0.3.0` includes both the `0.2.0` and `0.3.0` changes. No standalone `0.2.0` GitHub Release is created.
- Existing releases and manually edited notes are preserved. Historical `vX.Y.Z` release names are recognized, including `v0.0.13`, to avoid duplicate releases. Drafts, prerelease flags on stable versions, and duplicate canonical/legacy releases require manual review.
- Missing changelogs or `gitHead` values fail with a request for manual backfill. Do not guess a commit or write generic release notes. The historical `0.0.13` notes were reconstructed from published package differences because that release predates the Changesets changelog.
- New version tags point to the exact npm commit. A conflicting tag is never moved. A retry can complete release creation when the correct tag already exists. Only a newly created version that is npm's `latest` is marked latest on GitHub.

## Validation and recovery

Run `pnpm test:sdk-releases` for offline release selection, note grouping, publication boundary and immutable-tag tests. The regular PR CI and release job both run these tests.

After fetching `origin/main` and tags, inspect missing releases without writing to GitHub:

```sh
node scripts/sdk-github-releases.mjs plan
```

This command reads the public npm registry and GitHub Releases using the authenticated `gh` CLI. It prints the commit, npm publication timestamp and complete release notes for each missing version. If no versions are missing, it prints an empty array.

To publish a reviewed plan, rerun the workflow on main, or run:

```sh
node scripts/sdk-github-releases.mjs publish
```

The script rechecks npm and GitHub before publishing. Runs are serialized by the workflow; avoid a concurrent local publish. Registry, Git, or GitHub errors fail the run rather than being interpreted as “no release.” Existing GitHub Releases make later runs a no-op, so retry after resolving transient failures. Conflicting tags, missing historical metadata, or existing drafts require a maintainer to inspect the affected version before retrying.

GitHub records the time a Release is created; a historical backfill does not change npm's original publication date. The public website's editorial release notes remain separate from this developer changelog.
