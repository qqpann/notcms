import { BlogPagesList } from "~/components/blog/list";
import { nc } from "~/src/notcms/schema";

export const revalidate = 10;

export default async function Blog() {
  const [pages, error] = await nc.query.blog.list({
    where: { published: true },
  });
  // Throw instead of rendering an empty list, so a failed request is not
  // mistaken for a blog without posts and does not replace a cached page.
  if (error) throw error;
  const [writers, writersError] = await nc.query.writers.list();
  if (writersError) throw writersError;

  return <BlogPagesList pages={pages} writers={writers} />;
}
