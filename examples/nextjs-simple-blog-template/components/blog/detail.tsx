import Image from "next/image";
import { nc } from "~/src/notcms/schema";
import { MainContent } from "./main-content";
import { PostDate, WriterAvatar } from "./parts";

type Page = typeof nc.query.blog.$inferPage;
type Writer = typeof nc.query.writers.$inferPage;

export function BlogPageDetail({
  page,
  writer,
}: {
  page: Page;
  writer?: Writer;
}) {
  const thumbnail = page.properties.thumbnails?.[0];
  return (
    <div className="container max-w-[1440px] px-4 md:px-16 lg:px-32 mx-auto flex flex-col items-start">
      <div className="flex flex-col items-center gap-12 pt-16 pb-16 md:py-32 w-full">
        <div className="flex flex-col w-full max-w-[784px] items-center gap-12">
          <div className="flex flex-col items-center gap-8 w-full">
            <PostDate
              value={page.properties.created_at}
              className="font-light text-zinc-400 text-sm text-center"
            />
            <h1 className="font-normal text-white text-4xl md:text-5xl text-center">
              {page.title}
            </h1>
            {writer && (
              <div className="flex items-center gap-1.5 pl-[3px] pr-2.5 py-[3px] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
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
          </div>
          {thumbnail && (
            <Image
              className="w-full h-auto bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000] object-cover"
              width={784}
              height={422}
              sizes="(min-width: 832px) 784px, 100vw"
              alt=""
              src={thumbnail}
            />
          )}
        </div>
        <MainContent content={page.content} />

        {writer && <WriterProfileCard writer={writer} />}
      </div>
    </div>
  );
}
function WriterProfileCard({ writer }: { writer: Writer }) {
  return (
    <div className="max-w-[600px] p-6 rounded-[20px] border-white border-[0.5px] border-opacity-10 items-start gap-6 inline-flex shadow-[inset_0px_-40px_48px_0px_rgba(255,255,255,0.08)]">
      <WriterAvatar
        writer={writer}
        size={56}
        className="size-14 text-2xl border border-black/10"
      />
      <div className="grow shrink basis-0 flex-col items-start gap-4 inline-flex">
        <div className="text-white text-lg font-medium leading-[18px]">
          {writer.title}
        </div>
        <div className="opacity-70 text-white text-base font-normal leading-snug">
          {writer.content}
        </div>
      </div>
    </div>
  );
}
