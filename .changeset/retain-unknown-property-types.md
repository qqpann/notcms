---
"notcms": patch
---

- Preserve unsupported property type names, including button, place, verification, and future Notion types, when generating and comparing schemas.
- Warn about unsupported columns during init, pull, and pull --check. Infer their values as unknown and exclude them from typed filters and sorting while preserving inference for supported columns.
