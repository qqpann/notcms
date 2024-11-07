<div align="center">
  <a href="https://notcms.com">
    <picture>
      <img alt="NotCMS logo" src="/docs/assets/notcms-icon.png" height="128">
    </picture>
  </a>
  <h1>NotCMS</h1>

  <a href="https://notcms.com">
    Website
  </a>
  |
  <a href="https://dash.notcms.com">
    Dashboard
  </a>
  |
  <a href="https://notcms.com/templates">
    Templates
  </a>
  |
  <a href="https://notcms.com/blog">
    Blog
  </a>
</div>

## Getting Started

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

> NotCMS makes it easy to create a CMS, from Notion.

## Install

```bash
npm install notcms
```

## Usage

```ts
import { Client } from "notcms";

const nc = Client({ schema });

const [pages] = await nc.query.blog.listPages();
const [page] = await nc.query.blog.getPage(pages[0].id);
```

<!-- -->

[build-img]: https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/typescript-npm-package-template
[downloads-url]: https://www.npmtrends.com/typescript-npm-package-template
[npm-img]: https://img.shields.io/npm/v/typescript-npm-package-template
[npm-url]: https://www.npmjs.com/package/typescript-npm-package-template
[issues-img]: https://img.shields.io/github/issues/ryansonshine/typescript-npm-package-template
[issues-url]: https://github.com/ryansonshine/typescript-npm-package-template/issues
[codecov-img]: https://codecov.io/gh/ryansonshine/typescript-npm-package-template/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/ryansonshine/typescript-npm-package-template
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
