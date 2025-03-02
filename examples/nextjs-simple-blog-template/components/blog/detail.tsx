import Image from "next/image";
import { nc } from "~/src/notcms/schema";
import { MainContent } from "./main-content";

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
    <div className="w-screen max-w-full overflow-hidden">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center py-8">
          <div className="w-full text-center text-zinc-400 text-sm mb-6">
            {new Date(
              page.properties.created_at ?? Date.now()
            ).toLocaleDateString()}
          </div>

          <h1 className="w-full text-white text-2xl md:text-4xl text-center font-normal mb-6 px-4">
            {page.title}
          </h1>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/20 mb-8">
            <Image
              className="w-[18px] h-[18px] rounded-full"
              width={18}
              height={18}
              alt="Writer Profile"
              src={writer?.properties.images?.[0] ?? "/img/404.png"}
            />
            <span className="text-white text-sm">{writer?.title}</span>
          </div>

          <div className="w-full aspect-[16/9] relative mb-8">
            <Image
              className="rounded-lg object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              alt="Key Visual"
              src={page.properties.thumbnails?.[0] ?? "/img/404.png"}
            />
          </div>

          <div className="w-full prose prose-invert max-w-none">
            <MainContent content={page.content} />
          </div>

          {writer && (
            <div className="w-full mt-8">
              <WriterProfileCard writer={writer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WriterProfileCard({ writer }: { writer: Writer }) {
  return (
    <div className="w-full p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex gap-4 items-start">
        <Image
          width={56}
          height={56}
          className="w-14 h-14 rounded-full shrink-0"
          alt={`${writer.title}'s Profile`}
          src={writer.properties.images?.[0] ?? "/img/404.png"}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-lg font-medium mb-2">
            {writer.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            {writer.content}
          </p>
        </div>
      </div>
    </div>
  );
}
