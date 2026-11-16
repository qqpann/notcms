import { cn } from "~/lib/utils";
import { Link } from "~/src/i18n/routing";
import { nc } from "~/src/notcms/schema";
import { PostDate, PostThumbnail, WriterAvatar } from "./parts";

type Pages = typeof nc.query.blog.$inferPages;
type Writers = typeof nc.query.writers.$inferPages;

export function BlogPagesList({
  pages,
  writers,
}: {
  pages: Pages;
  writers: Writers;
}) {
  const featuredPage = pages[0];

  return (
    <main className="container max-w-[1440px] px-4 md:px-16 lg:px-32 mx-auto py-8">
      <div className="flex flex-col w-full mb-8 items-start gap-5">
        <h2 className="tracking-[-0.01em] font-normal text-white text-5xl">
          Recent updates
        </h2>
        <p className="font-light text-[#9f9fa4] text-[15px]">
          This blog is maintained using NotCMS itself!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {featuredPage && (
          <HeroBlogPostCard
            className="hidden md:flex"
            page={featuredPage}
            writer={writers.find(
              (writer) => writer.id === featuredPage.properties.writers?.[0]
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page, i) => {
            const writer = writers.find(
              (w) => w.id === page.properties.writers?.[0]
            );
            return (
              <BlogPostCard
                key={page.id}
                page={page}
                writer={writer}
                className={i === 0 ? "md:hidden" : undefined}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

interface Props {
  className?: string;
  page: Pages[number];
  writer?: Writers[number];
}
function HeroBlogPostCard({ className, page, writer }: Props) {
  const category = page.properties.category;
  return (
    <Link
      href={`/blog/${page.id}`}
      className={cn(
        "flex items-start p-4 gap-8 rounded-3xl w-full shadow-[inset_0px_-80px_96px_#ffffff14] border border-white border-opacity-10",
        className
      )}
    >
      <PostThumbnail
        src={page.properties.thumbnails?.[0]}
        sizes="(min-width: 1440px) 576px, 50vw"
        className="w-1/2 max-w-[576px] shrink-0 aspect-[576/310] rounded-lg"
      />

      <div className="flex flex-col items-start gap-6 min-w-0 flex-1">
        <div className="flex flex-col items-start gap-4 w-full">
          <p className="text-[25px] font-normal text-white">{page.title}</p>
          <p className="font-light text-zinc-400 text-[15px] leading-5">
            {page.properties.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {writer && (
            <div className="inline-flex items-center gap-1.5 pl-[3px] pr-2.5 py-[3px] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
              <WriterAvatar
                writer={writer}
                size={18}
                className="size-[18px] text-[10px]"
              />
              <span className="font-light text-white text-[15px] whitespace-nowrap">
                {writer.title}
              </span>
            </div>
          )}

          {category && (
            <div className="inline-flex h-6 items-center px-3 py-0.5 bg-[#ffffff29] rounded-[40px]">
              <span className="font-light text-white text-[15px] whitespace-nowrap">
                {category}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
function BlogPostCard({ className, page, writer }: Props) {
  const category = page.properties.category;
  return (
    <Link
      href={`/blog/${page.id}`}
      className={cn(
        "flex flex-col items-start gap-5 pt-4 pb-5 px-4 bg-[#ffffff03] rounded-3xl overflow-hidden border-white border-opacity-10 border-[0.5px] shadow-[inset_0px_-80px_96px_#ffffff14]",
        className
      )}
    >
      <PostThumbnail
        src={page.properties.thumbnails?.[0]}
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="w-full aspect-[352/200] rounded-md"
      />

      <div className="flex flex-col items-start gap-4 px-1.5 w-full">
        <p className="text-lg font-medium leading-snug text-white">
          {page.title}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full text-sm">
          {writer && (
            <div className="inline-flex items-center gap-1.5 text-white">
              <WriterAvatar
                writer={writer}
                size={16}
                className="size-4 text-[9px]"
              />
              <span className="whitespace-nowrap">{writer.title}</span>
            </div>
          )}

          {category && (
            <span className="text-white whitespace-nowrap">{category}</span>
          )}

          <PostDate
            value={page.properties.created_at}
            className="ml-auto text-[#9f9fa5] whitespace-nowrap"
          />
        </div>
      </div>
    </Link>
  );
}
