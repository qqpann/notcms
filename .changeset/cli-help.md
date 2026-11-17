---
"notcms": patch
---

Make `npx notcms --help` explain the CLI:

- Describe what `init` and `pull` do, and list `-e, --env` with its comma-separated default (`.env,.env.local,.dev.vars`) instead of a JSON array.
- Show `-e, --env` under "Global Options" in `notcms init --help`, `notcms login --help` and `notcms pull --help`.
- Name `NOTCMS_SECRET_KEY` and `NOTCMS_WORKSPACE_ID`, which let commands run without a browser login, and link to the CLI docs.
- The README on the npm page now links to the migration checklist and the content recipes with absolute URLs. Its relative links did not open from npm.
