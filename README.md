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

NotCMS makes it easy to create a CMS, from Notion. It provides a type-safe TypeScript SDK to interact with Notion databases as your content backend.

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

</div>

## Key Features

- **Type Safety**: Fully typed queries and responses using TypeScript
- **Simple API**: Clean and intuitive API for fetching content
- **Notion as Backend**: Use Notion's user-friendly editor for content creation
- **Framework Agnostic**: Works with any JavaScript framework (Next.js, React, Vue, etc.)
- **CLI Tools**: Includes notcms-kit for easy project setup and schema management

## Getting Started

### Installation

#### Core Library

```bash
npm install notcms
```

#### CLI Tools (Optional)

```bash
npm install notcms-kit
```

### Usage

#### 1. Set Up Environment Variables

Create a `.env` file in your project root:

```env
NOTCMS_SECRET_KEY=your_secret_key
NOTCMS_WORKSPACE_ID=your_workspace_id
```

You can get these values from the NotCMS Dashboard.

#### 2. Define Your Schema

Create a schema file that maps your Notion databases:

```ts
// src/notcms/schema.ts
import { Client, Schema } from "notcms";

export const schema = {
  blog: {
    id: "your_notion_database_id",
    properties: {
      title: "title",
      description: "rich_text",
      published: "checkbox",
      thumbnails: "files",
      // Add other properties as needed
    },
  },
} satisfies Schema;

export const nc = new Client({ schema });
```

#### 3. Query Your Content

```ts
import { nc } from "./notcms/schema";

// List all blog posts
const [pages] = await nc.query.blog.list();

// Get a specific blog post
const [page] = await nc.query.blog.get("page_id");

// Handle errors
const [data, error] = await nc.query.blog.list();
if (error) {
  console.error("Failed to fetch blog posts:", error);
}
```

### Using NotCMS Kit (CLI)

NotCMS Kit provides command-line tools to streamline your workflow.

#### Initialize a Project

```bash
npx notcms-kit init
```

This will create a `notcms.config.json` file in your project root.

#### Pull Schema from Notion

```bash
npx notcms-kit pull
```

This will fetch your database schema from Notion and generate a TypeScript schema file.

## Examples and Templates

Check out these examples to get started quickly:

- [Next.js Simple Blog Template](https://github.com/qqpann/notcms/tree/main/examples/nextjs-simple-blog-template)
- [More templates available on our website](https://notcms.com/templates)

## Troubleshooting

### Authentication Errors

If you see errors like "secretKey is required" or "workspaceId is required", make sure:

1. Your environment variables are correctly set
2. You're using the correct variable names (`NOTCMS_SECRET_KEY` and `NOTCMS_WORKSPACE_ID`)
3. Your environment variables are being loaded properly

### Schema Errors

If you encounter schema-related errors:

1. Make sure your Notion database IDs are correct
2. Verify that the property types match what's in your Notion database
3. Try running `npx notcms-kit pull` to regenerate your schema

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Community

- [Discord Community](https://discord.gg/notcms)
- [Twitter](https://twitter.com/notcms)

## License

This project is organized as a monorepo with multiple packages:

- `packages/notcms`: [MIT License](packages/notcms/LICENSE)
- `packages/notcms-kit`: [MIT License](packages/notcms-kit/LICENSE)
- `examples/`: [MIT License](examples/LICENSE)

See individual directories for specific license details.

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
