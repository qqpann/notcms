# Agent guidance

This is the public `notcms` SDK repository. The private NotCMSApp repository's
Japanese-language policy does not apply here, including when this repository is
checked out as its submodule.

## Language

- Use English for code comments, JSDoc, and documentation by default.
- Write PR titles and descriptions in English followed by Japanese, as the [PR template](.github/PULL_REQUEST_TEMPLATE.md) describes.
- For other content, add English/Japanese bilingual content only when explicitly requested. Keep facts, API examples, validation results, and checklist states aligned between both languages.
- Preserve existing translated files, such as `README.ja.md` and `docs/ja/`, and other explicitly multilingual deliverables in their intended language. The English default does not authorize deleting or converting them.

## Pull requests and review

- Reviews run in Codex cloud code review. It reviews a PR automatically once the PR is open and not a draft. Do not run a local Codex reviewer.
- When the work and its checks are done and the change is ready for review, open the PR as ready for review (not a draft). Use a draft only to share unfinished work, and mark it ready when it is done.
- Fix valid Codex findings in the same PR. Reply on the PR with the reason for any finding you do not fix.

## Review guidelines

Guidance for Codex cloud code review.

- Report only concrete problems: incorrect behavior, regressions in the published SDK or CLI API, broken types, security or data-loss risks, missing changesets for published SDK or CLI changes (see [CONTRIBUTING.md](CONTRIBUTING.md)), and tests that would hide a real regression.
- Do not report style preferences, speculative concerns without a failure scenario, or pre-existing issues outside the change.
- For each finding, give the file and line, the failure scenario, and the smallest fix.

