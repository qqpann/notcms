import { notFound } from "next/navigation";
import { BlogPageDetail } from "~/components/blog/detail";
import { nc } from "~/src/notcms/schema";

// export const maxDuration = 30;
export const revalidate = 10;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Apply the list's publication rule here too, so an unpublished draft is not
  // reachable by its ID.
  const [page, error] = await nc.query.blog.getFirst({
    where: { id: { in: [id] }, published: true },
  });
  if (error) throw error;
  if (!page) notFound();

  const writerId = page.properties.writers?.[0];
  const [writer, writerError] = writerId
    ? await nc.query.writers.getFirst({ where: { id: { in: [writerId] } } })
    : ([null, null] as const);
  if (writerError) throw writerError;

  return <BlogPageDetail page={page} writer={writer ?? undefined} />;
}
