---
"notcms": minor
---

Preserve select, status, and multi-select choice names in generated schemas. Infer literal unions for page values and query operands, keep legacy string fallbacks when options are absent, and report option changes during schema pull.

The CLI requests choice metadata with `include=options`. Older CLIs keep receiving the original schema shape, so their generated modules continue to typecheck with older SDKs.
