---
"notcms": patch
---

Update the dependencies bundled into the `notcms` CLI:

- `commander` 12 → 15. The CLI now rejects unexpected extra arguments (for example `notcms init extra`) with an error instead of ignoring them.
- `chalk` 5 → 6.
- `@inquirer/prompts` 8.7 → 8.8.
