import { notFound } from "next/navigation";
import { PostDetail } from "~/components/post-detail";
import { nc } from "~/src/notcms/schema";

export const revalidate = 10;

const MAP_SLUG_TO_ID = {
  terms: "1f941573-d2ce-4790-b00d-b45ce51f8e72",
  privacy: "bbc1e1f3-0f25-4f27-b9f0-a7452807459a",
  // company: "5c75d3dc-7ea8-4115-ae46-6ab86833c066",
  about: "1322c5fe-b55c-807b-9ef9-e517748d8760",
} as const;

export default async function Page({
  params,
}: {
  params: { service_page_slug: string };
}) {
  const slug = params.service_page_slug;
  const id = MAP_SLUG_TO_ID[slug as keyof typeof MAP_SLUG_TO_ID];
  if (!id) return notFound();
  const [data] = await nc.query.service.getPage(id);
  if (!data) return notFound();
  const page = {
    id: id,
    title: data.title,
    content: data.content,
  };
  return <PostDetail post={page} />;
}
