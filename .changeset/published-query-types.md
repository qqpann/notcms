---
"notcms": patch
---

Fix the published type declarations. `list()`, `get()` and `getFirst()` now keep the choices of select, status and multi_select properties in their results. In the built package these values were typed as `any`, and projects with `skipLibCheck: false` failed with "Cannot find name 'O'". Code that compares these values with choices missing from the generated schema may now report type errors; run `npx notcms pull` if the choices changed in Notion. CommonJS projects now get the CommonJS declarations, so TypeScript projects that use `"moduleResolution": "node16"` can import the package instead of failing with TS1479.
