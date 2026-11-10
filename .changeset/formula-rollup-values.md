---
"notcms": patch
---

Type formula and rollup values as the API now returns them.

- `formula` is `string | number | boolean | null`. Boolean formulas are returned as `true` / `false` instead of the strings `"true"` / `"false"`, and an empty result is `null` instead of `0` or `""`.
- `rollup` is `string | number | string[] | null`. Rollups return their number, date string, or the rolled-up values as strings instead of the placeholder `"unsupported"`.
- `where` accepts a boolean for formula properties.

Pages return the new values after their next sync. If your code compares a formula with `"true"`, `"false"`, `0` or `""`, update it:

```ts
// Before
const featured = post.properties.isFeatured === "true";

// After
const featured = post.properties.isFeatured === true;
```
