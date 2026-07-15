---
"notcms": minor
---

Complete CLI initialization through the first schema pull. `notcms init` now
uses existing credentials or browser login, ensures `notcms` is a direct and
resolvable project dependency with the safely detected package manager, writes
the generated schema, and prints a safe runnable first-query example while
preserving the standalone `login`, `pull`, and `pull --check` commands.
