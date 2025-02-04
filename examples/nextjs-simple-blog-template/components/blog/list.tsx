"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "~/src/i18n/routing";
import { nc } from "~/src/notcms/schema";

type Pages = typeof nc.query.blog.$inferPages;
type Writers = typeof nc.query.writers.$inferPages;

const categories = ["Blog", "Showcase", "Changelog"].map((name, i) => ({
  id: i.toString(),
  name,
}));

export function BlogPagesList({
  pages,
  writers,
}: {
  pages: Pages;
  writers: Writers;
}) {
  const categories = [
    "All",
    ...pages
      .map((page) => page.properties.category)
      .filter(
        (category): category is string =>
          category !== null && category !== undefined
      )
      .filter((category, index, self) => self.indexOf(category) === index)
      .sort(),
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPages = pages.filter(
    (p) =>
      selectedCategory === "All" || p.properties.category === selectedCategory
  );

  const getCategoryButtonStyle = (category: string) => {
    return selectedCategory === category
      ? "flex w-auto h-6 items-center px-3 py-3 rounded-[24.5px] border-[0.5px] border-solid border-[#ffffff1a] [background:linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.1)_100%)]"
      : "inline-flex items-center justify-center gap-2 px-2 md:px-3 py-0 flex-[0_0_auto]";
  };

  const getCategoryTextStyle = (category: string) => {
    return selectedCategory === category
      ? "w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-xs leading-[normal] whitespace-nowrap"
      : "w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-[#9f9fa5] text-xs leading-[normal] whitespace-nowrap";
  };

  return (
    <main className="container max-w-[1440px] px-3 md:px-32 mx-auto py-4 md:py-8">
      <div className="flex flex-col w-full mb-6 md:mb-8 items-start gap-3 md:gap-5 flex-[0_0_auto]">
        <h2 className="self-stretch mt-[-1.00px] font-Roobert tracking-[-0.01em] font-normal text-white text-2xl md:text-5xl leading-[normal]">
          Recent updates
        </h2>
        <p className="self-stretch [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-[#9f9fa4] text-xs md:text-[15px] leading-[normal]">
          This blog is maintained using NotCMS itself!
        </p>
      </div>

      <div className="flex flex-wrap items-center mb-6 md:mb-8 gap-2 md:gap-12 self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex flex-wrap items-center gap-2 md:gap-3 flex-[0_0_auto]">
          {categories.map((category) => (
            <button
              key={category}
              className={getCategoryButtonStyle(category)}
              onClick={() => setSelectedCategory(category)}
            >
              <span className={getCategoryTextStyle(category)}>{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-8">
        {filteredPages.length > 0 && (
          <HeroBlogPostCard
            page={filteredPages[0]}
            writer={writers.find(
              (w) => w.id === filteredPages[0].properties.writers?.[0]
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredPages.slice(1).map((page) => {
            const writer = writers.find(
              (w) => w.id === page.properties.writers?.[0]
            );
            return <BlogPostCard key={page.id} page={page} writer={writer} />;
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
  return (
    <Link
      href={`/blog/${page.id}`}
      className="flex flex-col md:flex-row items-start p-3 md:p-4 gap-3 md:gap-8 relative rounded-2xl md:rounded-3xl self-stretch w-full flex-[0_0_auto] shadow-[inset_0px_-80px_96px_#ffffff14] border border-white border-opacity-10"
    >
      <div className="w-full md:w-[576px] h-[160px] md:h-[310px]">
        <Image
          src={page.properties.thumbnails?.[0] ?? "/img/404.png"}
          alt="Key Visual"
          width={576}
          height={310}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-start gap-3 md:gap-4 p-0 relative flex-1 self-stretch grow">
        <div className="flex flex-col items-start gap-4 md:gap-6 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-2 md:gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <p className="text-lg md:text-[25px] relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white leading-[normal]">
              {page.title}
            </p>
            <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-xs md:text-[15px] leading-5">
              {page.properties.description}
            </p>
          </div>

          <div className="inline-flex flex-wrap items-start gap-2 relative flex-[0_0_auto]">
            <div className="inline-flex items-center gap-1.5 pl-[3px] pr-2 md:pr-2.5 py-[3px] relative flex-[0_0_auto] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
              <div className="size-4 md:size-[18px] rounded-full">
                <Image
                  src={writer?.properties.images?.[0] ?? "/img/404.png"}
                  alt="Writer Profile"
                  width={18}
                  height={18}
                  className="size-4 md:size-[18px] rounded-full object-cover"
                />
              </div>
              <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-xs md:text-[15px] leading-[normal] whitespace-nowrap">
                {writer?.title}
              </div>
            </div>

            <div className="inline-flex h-6 items-center gap-1.5 px-2 md:px-3 py-0.5 relative flex-[0_0_auto] bg-[#ffffff29] rounded-[40px]">
              <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-xs md:text-[15px] leading-[normal] whitespace-nowrap">
                {page.properties.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogPostCard({ className, page, writer }: Props) {
  return (
    <Link
      href={`/blog/${page.id}`}
      className="flex flex-col items-start gap-3 md:gap-5 pt-3 md:pt-4 pb-4 md:pb-5 px-3 md:px-4 bg-[#ffffff03] rounded-2xl md:rounded-3xl overflow-hidden border-white border-opacity-10 border-[0.5px] shadow-[inset_0px_-80px_96px_#ffffff14] w-full"
    >
      <div className="w-full h-[140px] md:h-[200px]">
        <Image
          src={page.properties.thumbnails?.[0] ?? "/img/404.png"}
          alt="Key Visual"
          width={352}
          height={200}
          className="rounded-md object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-start gap-3 md:gap-4 px-1 md:px-1.5 py-0 self-stretch w-full flex-[0_0_auto]">
        <p className="self-stretch mt-[-1px] font-h-6 font-[number:var(--h-6-font-weight)] text-white text-sm md:text-[length:var(--h-6-font-size)] leading-[var(--h-6-line-height)] [font-style:var(--h-6-font-style)]">
          {page.title}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 self-stretch w-full relative flex-[0_0_auto]">
          <div className="inline-flex h-5 items-center justify-center gap-1 pl-0.5 pr-2 py-[9.5px] rounded-[66.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] relative flex-[0_0_auto]">
            <div className="size-4 rounded-full">
              <Image
                src={writer?.properties.images?.[0] ?? "/img/404.png"}
                alt="Writer Profile"
                width={16}
                height={16}
                className="size-4 rounded-full object-cover"
              />
            </div>

            <div className="relative w-fit mt-[-5.00px] mb-[-3.00px] font-caption font-[number:var(--caption-font-weight)] text-white text-[11px] md:text-[length:var(--caption-font-size)] leading-[var(--caption-line-height)] whitespace-nowrap [font-style:var(--caption-font-style)]">
              {writer?.title}
            </div>
          </div>

          <div className="inline-flex h-5 items-center justify-center gap-2 pt-[9.5px] pb-[10.5px] px-2 rounded-[66.5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-5.50px] mb-[-3.50px] font-caption font-[number:var(--caption-font-weight)] text-white text-[11px] md:text-[length:var(--caption-font-size)] leading-[var(--caption-line-height)] whitespace-nowrap [font-style:var(--caption-font-style)]">
              {page.properties.category}
            </div>
          </div>

          <div className="relative flex-1 font-caption font-[number:var(--caption-font-weight)] text-[#9f9fa5] text-[11px] md:text-[length:var(--caption-font-size)] text-right leading-[var(--caption-line-height)] [font-style:var(--caption-font-style)]">
            {new Date(
              page.properties.created_at ?? Date.now()
            ).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
