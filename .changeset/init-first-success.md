---
"notcms": minor
---

Complete CLI initialization through the first schema pull. `notcms init` now
uses existing credentials or browser login, writes the generated schema, and
prints a safe first-query example while preserving the standalone `login`,
`pull`, and `pull --check` commands.
