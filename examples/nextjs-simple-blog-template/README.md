# Next.js Simple Blog Template

## Getting Started

First, clone the template:

```bash
npx create-next-app@latest -e https://github.com/qqpann/notcms/tree/main/examples/nextjs-simple-blog-template
```

Add your environment variables from NotCMS dashboard.

```.env.local
# .env.local
NOTCMS_WORKSPACE_ID=xxx
NOTCMS_SECRET_KEY=ncsec_xxx
```

Develop locally.

```bash
npm run dev
# or
pnpm dev
```

Commit git changes, push to GitHub, and deploy (to Vercel or your choice).

## Content rendering

Use Node.js 22.12 or later. `MainContent` parses Markdown, then sanitizes the final HTML with `sanitize-html`. Keep that final sanitization step when customizing the renderer. Static Markdown/HTML and HTTP(S) images are supported; scripts, event handlers, SVG/MathML, inline styles, unsafe URL schemes, and iframe/HTML applications are removed. Images and linked documents still require a trustworthy media-serving policy. See the [rendering contract](https://docs.notcms.com/en/examples/nextjs#render-untrusted-content-safely).

Run `pnpm test` for the rendering regression tests. `pnpm build:ci` runs the same tests before building with a local empty API fixture; it does not use production content.
