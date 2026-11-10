---
"notcms": patch
---

`notcms pull` and `notcms init` no longer fail for the whole workspace when a database has a property type this version does not support yet (for example Notion's `button`, `place`, or `verification`). Those properties are left out of the generated schema and listed in a warning; other databases and properties are generated as usual.
