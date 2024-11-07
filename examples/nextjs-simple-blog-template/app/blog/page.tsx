import { BlogPagesList } from "~/components/blog/list";
import { nc } from "~/src/notcms/schema";

export const revalidate = 10;

export default async function Blog() {
  let [pages] = await nc.query.blog.listPages();
  let [writers] = await nc.query.writers.listPages();

  pages = pages ?? [];
  writers = writers ?? [];

  pages = pages.filter((page) => page.properties.published);

  return <BlogPagesList pages={pages} writers={writers} />;
}
