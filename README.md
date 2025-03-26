<div align="center">
  <a href="https://notcms.com">
    <picture>
      <img alt="NotCMS logo" src="/docs/assets/notcms-icon.png" height="128">
    </picture>
  </a>
  <h1>NotCMS</h1>

  <a href="https://notcms.com">
    Website
  </a> · 
  <a href="https://dash.notcms.com">
    Dashboard
  </a> · 
  <a href="https://notcms.com/templates">
    Templates
  </a> · 
  <a href="https://notcms.com/blog">
    Blog
  </a>

NotCMS makes it easy to create a CMS, from Notion.

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

</div>

## Getting Started

## Install

```bash
npm install notcms
```

## Usage

```ts
import { Client } from "notcms";

const nc = Client({ schema });

const [pages] = await nc.query.blog.list();
const [page] = await nc.query.blog.get(pages[0].id);
```

## LICENSE

Each sub directory has individual license.

<!-- -->

[build-img]: https://github.com/qqpann/notcms/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/qqpann/notcms/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/notcms
[downloads-url]: https://www.npmtrends.com/notcms
[npm-img]: https://img.shields.io/npm/v/notcms
[npm-url]: https://www.npmjs.com/package/notcms
[issues-img]: https://img.shields.io/github/issues/qqpann/notcms
[issues-url]: https://github.com/qqpann/notcms/issues
[codecov-img]: https://codecov.io/gh/qqpann/notcms/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/qqpann/notcms
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
