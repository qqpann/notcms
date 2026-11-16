---
"notcms": patch
---

`new Client()` now names the environment variable to set (`NOTCMS_SECRET_KEY` or `NOTCMS_WORKSPACE_ID`) when credentials are missing. The generated schema module creates the client when it is imported, so this error often appears in a deployment that lacks the variables.
