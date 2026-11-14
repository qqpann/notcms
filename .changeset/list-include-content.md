---
"notcms": minor
---

Add `include: ["content"]` to `list()` to receive each page's Markdown content in the same request.

```ts
const [posts, error] = await nc.query.blog.list({
  where: { published: true },
  include: ["content"],
});
// posts[0].content is typed as string
```

Without `include`, `list()` behaves as before and returns pages without content.
