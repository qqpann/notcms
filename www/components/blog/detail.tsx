import Image from "next/image";
import { nc } from "~/src/notcms/schema";
import { MainContent } from "../main-content";

type Page = typeof nc.query.blog.$inferPage;
type Writer = typeof nc.query.writers.$inferPage;

export function BlogPageDetail({
  page,
  writer,
}: {
  page: Page;
  writer?: Writer;
}) {
  return (
    <div className="container max-w-[1440px] px-32 mx-auto flex flex-col items-start relative bg-white [background:linear-gradient(180deg,rgb(10.82,10.81,11.21)_0%,rgb(0,0,0)_100%)]">
      <div className="flex flex-col items-center gap-12 pt-16 pb-32 px-32 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[784px] items-center gap-12 relative flex-[0_0_auto]">
          <div className="flex flex-col items-center gap-8 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-sm text-center tracking-[0.14px] leading-[normal]">
              {new Date(
                page.properties.created_at ?? Date.now()
              ).toLocaleDateString()}
            </div>
            <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0.48px] leading-[normal]">
              {page.title}
            </p>
            <div className="flex w-[115px] items-center gap-1.5 pl-[3px] pr-2.5 py-[3px] relative flex-[0_0_auto] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
              <Image
                className="relative size-[18px] object-cover rounded-full"
                width={18}
                height={18}
                alt="Writer Profile"
                src={writer?.properties.images?.[0] ?? "/img/404.png"}
              />
              <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-[15px] tracking-[0.15px] leading-[normal] whitespace-nowrap">
                {writer?.title}
              </div>
            </div>
          </div>
          <Image
            className="relative self-stretch w-full h-[422px] mb-[-0.50px] ml-[-0.50px] mr-[-0.50px] bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000] object-cover"
            width={784}
            height={422}
            alt="Key Visual"
            src={page.properties.thumbnails?.[0] ?? "/img/404.png"}
          />
        </div>
        <MainContent content={page.content} />

        {writer && <WriterProfileCard writer={writer} />}
      </div>
    </div>
  );
}
function WriterProfileCard({ writer }: { writer: Writer }) {
  return (
    <div
      className="w-[600px] p-6 bg-white/1 rounded-[20px] border-white border-[0.5px] border-opacity-10 justify-start items-start gap-6 inline-flex 
shadow-[inset_0px_-40px_48px_0px_rgba(255,255,255,0.08)]"
    >
      <Image
        width={56}
        height={56}
        className="Image w-14 h-14 rounded-full border border-black/10"
        alt={`${writer.title}'s Profile`}
        src={writer.properties.images?.[0] ?? "/img/404.png"}
      />
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
        <div className="self-stretch text-white text-lg font-medium font-['Inter'] leading-[18px] tracking-tight">
          {writer.title}
        </div>
        <div className="self-stretch opacity-70 text-white text-base font-normal font-['Inter'] leading-snug tracking-tight">
          {writer.content}
        </div>
      </div>
    </div>
  );
}
