---
"notcms": patch
---

Make `notcms` CLI failures easier to act on:

- Stop printing `MISSING_ENV_FILE` errors for default env files (`.env`, `.env.local`, `.dev.vars`) that the project does not have. A file passed with `--env` is still reported when it is missing.
- When credentials are missing, suggest `npx notcms login` and name the env files the CLI reads, instead of suggesting `source .env`.
- When the schema request fails, show the API's reason with a fix for the status (for example a rejected key, or a key from another workspace), say when NotCMS could not be reached, and ask for an update when a successful response is not a schema this version can read.
- `pull` now stops with an error when `notcms.config.json` exists but is not valid JSON or has no `schema` string. It used to ignore the file and write the schema to `src/notcms/schema.ts`.
