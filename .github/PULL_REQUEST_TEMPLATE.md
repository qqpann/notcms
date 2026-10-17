<!--
Use English for the PR title and description by default: <type>: <English summary>.
Add a Japanese translation only when explicitly requested. In that case, append a Japanese
section with the same facts, validation results, and checklist states, and reuse the same screenshots.
-->

## Description of change

<!--
Explain what changes, why it is needed, and the resulting behavior.
List only validation you actually performed, including commands and results.
Link related issues; use Fixes #0000 only when merging should close that issue.
If another PR is a prerequisite, link it and state the base branch and merge order.
-->

## UI screenshots

<!--
For intentional UI changes or visual regression risk, include representative Before/After screenshots.
Otherwise write "N/A (reason)".
-->

| Before | After |
| --- | --- |
| <!-- Before screenshot or N/A (reason) --> | <!-- After screenshot or N/A (reason) --> |

## Pull-Request Checklist

<!-- Keep every item. For unavailable commands or inapplicable items, leave unchecked and add N/A (reason). -->

- [ ] Code is up-to-date with the `main` branch
- [ ] `pnpm check` passes with this change
- [ ] `pnpm test` passes with this change
- [ ] This pull request links relevant issues as `Fixes #0000`
- [ ] There are new or updated unit tests validating the change
- [ ] Documentation has been updated to reflect this change
- [ ] The new commits follow conventions outlined in the [conventional commit spec](https://www.conventionalcommits.org/en/v1.0.0/)
