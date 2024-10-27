import { type Renderer, marked } from "marked";
import Image from "next/image";
import React from "react";
import { Header } from "~/components/Header";
import { nc } from "~/src/notcms/schema";
import type { PostDetail, Writer } from "~/src/types";

export const revalidate = 10;

const renderer: Partial<Renderer> = {
  paragraph({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<p class="font-light text-zinc-300 tracking-[0.02px] leading-[25px] mb-[2rem]">${text}</p>`;
  },
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

    return `<h${depth} class="[font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-[#f8f7f7] tracking-[0.06px] leading-8 mb-[1.5rem]">
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
  },
  image({ href, title, text }) {
    // return `<img src="${href}" alt="${text}" title="${title}" class="w-full h-auto mb-[2rem]">`;
    return `<img src="${href}" alt="${text}" title="${title}" class="relative w-[601px] h-auto bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]">`;
  },
} as Renderer;
marked.use({ renderer: renderer, pedantic: false, gfm: true, breaks: true });

export default async function Page({ params }: { params: { id: string } }) {
  const { data: _page } = await nc.query.blog.getPage(params.id);
  console.log("data.properties", _page);
  const post = {
    id: params.id,
    title: _page.properties.title,
    description: _page.properties.description ?? "",
    writer: _page.properties.writer ?? "",
    writerImage: "/img/sample-profile-icon.png",
    keyVisualImage: _page.properties.thumbnail[0] ?? "/img/404.png",
    category: _page.properties.category,
    date: new Date(
      _page.properties?.created_at ?? Date.now()
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    content: _page.content,
  } satisfies PostDetail;
  console.log("get writer id", _page.properties.writers[0]);
  const { data: _writer } = await nc.query.writers.getPage(
    _page.properties.writers[0]
  );
  const writer = _writer
    ? {
        name: _writer.properties?.名前,
        description: _writer.content,
        image: _writer.properties?.image[0],
      }
    : undefined;
  console.log(writer);
  return <BlogDetail post={post} writer={writer} />;
}
function BlogDetail({ post, writer }: { post: PostDetail; writer?: Writer }) {
  return (
    <div className="flex flex-col items-start relative bg-white [background:linear-gradient(180deg,rgb(10.82,10.81,11.21)_0%,rgb(0,0,0)_100%)]">
      <div className="flex flex-col items-center gap-12 pt-16 pb-32 px-32 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[784px] items-center gap-12 relative flex-[0_0_auto]">
          <div className="flex flex-col items-center gap-8 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-sm text-center tracking-[0.14px] leading-[normal]">
              {post.date}
            </div>
            <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0.48px] leading-[normal]">
              {post.title}
            </p>
            <div className="flex w-[115px] items-center gap-1.5 pl-[3px] pr-2.5 py-[3px] relative flex-[0_0_auto] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
              <img
                className="relative w-[18px] h-[18px] object-cover"
                alt="Writer Profile"
                src={post.writerImage}
              />
              <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-[15px] tracking-[0.15px] leading-[normal] whitespace-nowrap">
                {post.writer}
              </div>
            </div>
          </div>
          <img
            className="relative self-stretch w-full h-[422px] mb-[-0.50px] ml-[-0.50px] mr-[-0.50px] bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]"
            alt="Key Visual"
            src={post.keyVisualImage}
          />
        </div>
        <main
          className="prose prose-base dark:prose-invert prose-h2:text-2xl text-white relative w-[600px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-normal text-transparent text-[15px] tracking-[0.15px] leading-[15px]"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is a markdown renderer
          dangerouslySetInnerHTML={{
            __html: marked(post.content ?? ""),
          }}
        />

        {writer && <WriterProfileCard writer={writer} />}
      </div>
    </div>
  );
}
function WriterProfileCard({ writer }: { writer: Writer }) {
  return (
    <div className="w-[600px] p-6 bg-white/0 rounded-[20px] shadow-inner border border-white justify-start items-start gap-6 inline-flex">
      <Image
        width={56}
        height={56}
        className="Image w-14 h-14 rounded-full border border-black/10"
        alt={`${writer.name}'s Profile`}
        src={writer.image}
      />
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
        <div className="self-stretch text-white text-lg font-medium font-['Inter'] leading-[18px] tracking-tight">
          {writer.name}
        </div>
        <div className="self-stretch opacity-70 text-white text-base font-normal font-['Inter'] leading-snug tracking-tight">
          {writer.description}
        </div>
      </div>
    </div>
  );
}
