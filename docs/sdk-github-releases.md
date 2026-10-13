# SDK GitHub Releases

The Changesets **Version Packages** PR is the review point for the SDK version and `packages/notcms/CHANGELOG.md`. Merging it confirms the intent to release. The `Publish` workflow builds, tests and stages the package on npm, then creates its GitHub Release in a dependent job. npm approval remains a separate maintainer action with 2FA. The GitHub Release can therefore appear before the package is installable from npm.

## CI flow

1. Changesets creates or updates the Version Packages PR.
2. After merge, the stage job requires a stable version increase and a changelog update. Ordinary pushes skip staging and release creation.
3. After successful staging, the release job reads the package version and **only that version's section** from the changelog at the original workflow commit (`github.sha`). A failed stage blocks release creation. An already-public exact npm version is a successful stage skip, allowing recovery after approval.
4. The job creates `notcms@<version>` at that exact commit and publishes the notes. Existing tags must point to that commit; existing public releases keep their notes, assets and Latest selection. New releases use GitHub's `make_latest=legacy` semantic-version/date selection rather than forcing every retry to Latest.
5. A maintainer reviews and approves the staged package on npm.

Everything runs in `publish.yml`. There is no periodic polling, `workflow_run`, full npm history scan, or second dependency installation/build/test for release creation. The release job uses Node and the runner's `gh` CLI with `contents: write`; the npm staging job retains only `contents: read` and `id-token: write`. No additional npm token or approval bypass is introduced.

## Recovery

If only **Create SDK GitHub Release** fails, rerun that failed job in the original `Publish` run. This does not restage npm and keeps the original commit even after main advances. A retry reuses a matching tag and leaves an existing public release untouched. Authentication, network and GitHub errors fail the job; only an explicit release-lookup HTTP 404 means the release is absent. Conflicting tags or unexpected draft/prerelease releases require maintainer review.

Avoid **Re-run all jobs** while the same npm version is awaiting approval: OIDC cannot inspect private pending stages, so duplicate staging deliberately fails. Once approved, a full rerun can skip the already-public npm version and recover the GitHub Release. If npm staging itself failed, follow [npm staged publishing recovery](./npm-staged-publishing.md).

For a read-only preview, use the original release commit from the workflow run:

```sh
GITHUB_SHA=<full-release-commit-sha> node scripts/sdk-github-releases.mjs plan
```

After verifying successful staging (or npm publication) and the preview, a maintainer can recover that single release locally with the authenticated `gh` CLI:

```sh
GITHUB_SHA=<full-release-commit-sha> node scripts/sdk-github-releases.mjs publish
```

Use a current checkout with `origin/main` fetched and avoid concurrent local publishing. Normal workflow runs are serialized by the Publish concurrency group. These commands do not stage or approve npm packages.

## Historical releases

The past npm releases were backfilled separately at npm-published version granularity. For example, unpublished `0.2.0` changes belong to the published `0.3.0` release. Historical exceptions and scans are not part of ongoing CI. If a future staged version is deliberately abandoned, review and carry its user-facing changes into the next release's changelog in the Version Packages PR; reconcile any already-announced release manually.
