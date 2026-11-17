# Next.js Simple Blog Template

A blog whose posts and writers come from Notion through NotCMS. It needs
Node.js 22 or later.

## Getting Started

First, clone the template:

```bash
npx create-next-app@latest -e https://github.com/qqpann/notcms/tree/main/examples/nextjs-simple-blog-template
```

### 1. Prepare the Notion databases

The pages read two databases. NotCMS names each database and property after its
name in Notion, so create them with these names and types:

| Database | Property | Notion type |
| --- | --- | --- |
| `blog` | `title` | Title |
| | `description` | Text |
| | `category` | Select |
| | `tags` | Multi-select |
| | `published` | Checkbox |
| | `thumbnails` | Files & media |
| | `writers` | Relation to `writers` |
| | `created_at` | Created time |
| | `updated_at` | Last edited time |
| `writers` | `name` | Title |
| | `images` | Files & media |

A post's body is the content of its `blog` page, and a writer's profile is the
content of their `writers` page. Only posts with `published` checked are shown,
including when someone opens a post by its URL.

In the [NotCMS dashboard](https://dash.notcms.com), connect Notion, register both
databases, and wait for the first sync to finish.

### 2. Connect the project

```bash
npx notcms login
npx notcms pull
```

`login` saves your credentials to `.env.local`. You can instead create a secret
under **Workspace Secrets** in the dashboard and add both values yourself:

```.env.local
# .env.local
NOTCMS_WORKSPACE_ID=xxx
NOTCMS_SECRET_KEY=ncsec_xxx
```

`pull` replaces the database IDs in `src/notcms/schema.ts` with yours. If your
databases or properties use other names, update the names used in `app/` and
`components/`; `npm run build` reports the ones that no longer match.

### 3. Develop and deploy

```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000/blog. Pages are regenerated at most every 10 seconds,
so an edit in Notion appears after NotCMS syncs it.

Commit git changes, push to GitHub, and deploy (to Vercel or your choice). Set
`NOTCMS_SECRET_KEY` and `NOTCMS_WORKSPACE_ID` in your hosting provider's
environment variables too.
