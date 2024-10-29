import { notFound } from "next/navigation";
import { BlogDetail } from "~/components/BlogDetail";
import { nc } from "~/src/notcms/schema";

const MAP_SLUG_TO_ID = {
  terms: "",
  privacy: "",
  company: "",
} as const;

export default async function Page({
  params,
}: {
  params: { service_page_slug: string };
}) {
  // const { data: pages } = await nc.query.service.listPages();
  // console.log(pages);
  const slug = params.service_page_slug;
  const id = MAP_SLUG_TO_ID[slug as keyof typeof MAP_SLUG_TO_ID];
  return notFound();
  // const { data } = await nc.query.service.getPage(id);
  // const page = {
  //   id: id,
  //   title: data.properties.title,
  //   content: data.content,
  // };
  // return <BlogDetail post={page} />;
}
