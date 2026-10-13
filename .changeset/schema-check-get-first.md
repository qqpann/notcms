---
"notcms": minor
---

- Add `getFirst` with typed filters and sorting. Return the first matching page with content in one request, or `null` when no page matches.

  ```ts
  const [post, error] = await nc.query.blog.getFirst({
    where: { slug: "hello-world" },
  });
  if (error) throw error;
  console.log(post?.content);
  ```

- Compare `pull --check` schemas semantically. Ignore formatting and key/choice order while detecting schema changes.
- Add schema-check CI examples for pull requests and scheduled runs.
- Add English and Japanese Astro integration guides.
