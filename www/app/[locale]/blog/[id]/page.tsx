import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPageDetail } from "~/components/blog/detail";
import { nc } from "~/src/notcms/schema";

// ISR: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const [pages, error] = await nc.query.blog.list();

  if (error || !pages) {
    console.error("Failed to fetch blog list:", error);
    return [];
  }

  // 静的に生成するパスのリスト
  return pages
    .filter((p) => p.properties.published)
    .map((page: any) => ({
      id: page.id,
    }));
}

// SEOメタタグ用の動的Metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;
  const [page, error] = await nc.query.blog.get(id);

  if (error || !page) {
    return {
      title: "Page Not Found",
    };
  }

  const thumbnailUrl =
    page.properties.thumbnails?.[0] ?? "/opengraph-image.jpg";

  return {
    title: page.title ?? "Blog Page",
    description: page.properties.description ?? "Blog post",
    openGraph: {
      title: page.title ?? "Blog Page",
      description: page.properties.description ?? "Blog post",
      images: [{ url: thumbnailUrl }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title ?? "Blog Page",
      description: page.properties.description ?? "Blog post",
      images: [thumbnailUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const [page, error] = await nc.query.blog.get(id);

  if (error || !page) {
    notFound(); // 404ページを表示
  }

  const writerId = page.properties.writers?.[0];
  const [writer] = writerId
    ? await nc.query.writers.get(writerId)
    : [undefined];

  const thumbnailUrl =
    page.properties.thumbnails?.[0] ?? "/opengraph-image.jpg";

  return (
    <>
      <BlogPageDetail page={page} writer={writer} />
    </>
  );
}
