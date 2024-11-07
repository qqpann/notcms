import React from "react";
import { BlogPageDetail } from "~/components/blog/detail";
import { nc } from "~/src/notcms/schema";

// export const maxDuration = 30;
export const dynamic = "auto";
export const revalidate = 10;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [page, error] = await nc.query.blog.getPage(id);
  if (error) return <div>{error.toString()}</div>;
  if (!page) return <div>Page not found</div>;

  const writerId = page.properties.writers?.[0];
  const [writer] = writerId
    ? await nc.query.writers.getPage(writerId)
    : [undefined];

  return <BlogPageDetail page={page} writer={writer} />;
}
