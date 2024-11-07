import React from "react";
import { BlogPageDetail } from "~/components/blog/detail";
import { nc } from "~/src/notcms/schema";

// export const maxDuration = 30;
export const revalidate = 10;

export default async function Page({ params }: { params: { id: string } }) {
  const [page, error] = await nc.query.blog.getPage(params.id);
  if (error) return <div>{error.toString()}</div>;
  if (!page) return <div>Page not found</div>;

  const writerId = page.properties.writers?.[0];
  const [writer] = writerId
    ? await nc.query.writers.getPage(writerId)
    : [undefined];

  return <BlogPageDetail page={page} writer={writer} />;
}
