---
"notcms": patch
---

Make the CLI help and the npm README easier to follow:

- `npx notcms --help` describes what `init` and `pull` do, shows the `-e, --env` default as `.env,.env.local,.dev.vars` instead of a JSON array, names `NOTCMS_SECRET_KEY` and `NOTCMS_WORKSPACE_ID`, which let commands run without a browser login, and links to the CLI docs.
- `notcms init --help`, `notcms login --help` and `notcms pull --help` list `-e, --env` under "Global Options".
- The README on the npm page links to the migration checklist and the content recipes with absolute URLs, so the links work outside the repository.
