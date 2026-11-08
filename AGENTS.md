# Agent guidance

This is the public `notcms` SDK repository. The private NotCMSApp repository's
Japanese-language policy does not apply here, including when this repository is
checked out as its submodule.

## Language

- Use English for code comments, JSDoc, and documentation by default.
- Write PR titles and descriptions in English followed by Japanese, as the [PR template](.github/PULL_REQUEST_TEMPLATE.md) describes.
- For other content, add English/Japanese bilingual content only when explicitly requested. Keep facts, API examples, validation results, and checklist states aligned between both languages.
- Preserve existing translated files, such as `README.ja.md` and `docs/ja/`, and other explicitly multilingual deliverables in their intended language. The English default does not authorize deleting or converting them.

## File deferred work as issues

You may create issues, and comment on or add labels to existing issues, without asking. Proactively file an issue in these two cases:

1. You find a problem outside the current task's scope: file an issue instead of fixing it in place. Bugs introduced by the current change are fixed in the current PR.
2. Only minor review comments remain on a PR: if it is better to fix them together later, file an issue and move the PR forward.

"Minor" means it does not change behavior, data, security, or what a test checks (naming, comments, wording, small duplication or cleanup, suggestions to add tests, and similar). Never defer: bugs introduced by the current change, security or data-loss issues, CI failures, or major review findings. When unsure, fix it in the current PR.

- Before filing, search open and closed issues. If the same issue is open, comment on it instead of opening a new one. If a closed issue covers the same problem and it remains or has come back, do not reopen it; open a new issue that links to it.
- In the body, state the problem, where it came from (links to the PR, review comment, or commit), and how to fix it (write "TBD" if undecided).
- Group closely related minor comments from the same PR into one issue with a checklist. Keep items that should be prioritized independently in separate issues.
- Add the `follow-up` label. If the repository does not have it, create it with `gh label create follow-up`.
- Reply to each deferred review comment with the issue link, and list the issues under "Deferred review comments" in the PR description.
- List the issues you created or updated, with links, in your final report. Never include secrets, credentials, or personal data.
