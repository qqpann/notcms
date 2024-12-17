import Head from "next/head";
import React from "react";
import { BlogPageDetail } from "~/components/blog/detail";
import { nc } from "~/src/notcms/schema";

export const dynamic = "auto";
export const revalidate = 10;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [page, error] = await nc.query.blog.get(id);
  if (error) return <div>{error.toString()}</div>;
  if (!page) return <div>Page not found</div>;

  const writerId = page.properties.writers?.[0];
  const [writer] = writerId
    ? await nc.query.writers.get(writerId)
    : [undefined];

  const thumbnailUrl =
    page.properties.thumbnails?.[0] ?? "/opengraph-image.jpg"; // サムネイル画像

  return (
    <>
      <Head>
        <title>{page.title ?? "Blog Page"}</title>
        <meta property="og:title" content={page.title ?? "Blog Page"} />
        <meta
          property="og:description"
          content={page.properties.description ?? "Blog post"}
        />
        <meta property="og:image" content={thumbnailUrl} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title ?? "Blog Page"} />
        <meta
          name="twitter:description"
          content={page.properties.description ?? "Blog post"}
        />
        <meta name="twitter:image" content={thumbnailUrl} />
      </Head>

      <BlogPageDetail page={page} writer={writer} />
    </>
  );
}
