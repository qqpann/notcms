---
"notcms": major
---

NotCMS 1.0.0 is the first stable release. The SDK and CLI APIs are unchanged from 0.5.0, and from this version on they follow semantic versioning.

- **Breaking:** Node.js 22 or later is required (previously 18.17). The bundled CLI's prompt and output dependencies (`@inquirer/prompts` 8, `boxen` 9) no longer run on Node.js 18, and Node.js 18 and 20 have reached end of life.
