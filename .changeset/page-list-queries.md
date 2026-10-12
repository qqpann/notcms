---
"notcms": minor
---

Add typed property filters and single-property sorting to `list()`, preserving calls without arguments. Return request-construction errors through the existing error tuple.

Correct formula inference from `string | null` to `string | number | null` to match numeric API values. Code that previously assumed every non-null formula was a string must now narrow the value before using string methods.
