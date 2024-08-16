import Link from "next/link";
import React from "react";
import { Header } from "~/components/Header";
import { Category, Post } from "~/types";

const posts: Post[] = [];
for (let i = 1; i <= 7; i++) {
  posts.push({
    id: i.toString(),
    title: "NotCMS’ very first blog post",
    description:
      "Learn more about how NotCMS uses Notion to allow writers to create content worry-free.",
    category: "Blog",
    writer: "Qiushi Pan",
    writerImage: "/img/sample-profile-icon.png",
    date: "Aug 14, 2024",
  } satisfies Post);
}
const categories: Category[] = ["Blog", "Customer stories", "Changelog"].map(
  (name, i) =>
    ({
      id: i.toString(),
      name,
    }) satisfies Category
);

export default function Blog() {
  return (
    <div className="flex flex-col items-start relative bg-white [background:linear-gradient(180deg,rgb(11,11,11)_0%,rgb(0,0,0)_100%)]">
      <Header />
      <div className="flex flex-col items-start gap-12 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[947px] items-start gap-5 relative flex-[0_0_auto]">
          <div className="relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-5xl tracking-[0.48px] leading-[normal]">
            Recent updates
          </div>
          <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-[15px] tracking-[0.15px] leading-[normal]">
            This blog is maintained using NotCMS itself!
          </p>
        </div>
        <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-12 relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="flex w-[71px] h-6 items-center gap-12 px-0 py-3 relative rounded-[24.5px] border-[0.5px] border-solid border-[#ffffff1a] [background:linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.1)_100%)]">
                <div className="inline-flex items-center justify-center gap-2 px-3 py-2 relative flex-[0_0_auto] mt-[-12.00px] mb-[-12.00px] rounded-[30px]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
                    All posts
                  </div>
                </div>
              </div>
              {categories.map((category) => (
                <div
                  className="inline-flex items-center justify-center gap-2 px-3 py-0 relative flex-[0_0_auto]"
                  key={category.id}
                >
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
                    {category.name}
                  </div>
                </div>
              ))}
            </div>
            <span className="relative flex-1 grow h-px w-full block bg-white opacity-25" />
          </div>
          <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <HeroBlogPostCard post={posts[0]} />
            <div className="flex items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <BlogPostCard1
                post={posts[1]}
                className="!flex-1 !grow !w-[unset]"
              />
              <BlogPostCard1
                post={posts[2]}
                className="!flex-1 !grow !w-[unset]"
              />
              <BlogPostCard2 post={posts[3]} />
            </div>
            <div className="flex items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <BlogPostCard2
                post={posts[4]}
                className="!mt-[-0.50px] !mb-[-0.50px] !ml-[-0.50px] !grow !flex-1 !w-[unset]"
              />
              <BlogPostCard3
                post={posts[5]}
                className="!mt-[-0.50px] !mb-[-0.50px] !flex-1 !grow !w-[unset]"
              />
              <BlogPostCard3
                post={posts[6]}
                className="!mt-[-0.50px] !mb-[-0.50px] !mr-[-0.50px] !grow !flex-1 !w-[unset]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  className?: string;
  post: Post;
}
function HeroBlogPostCard({ className, post }: Props) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="flex items-start gap-8 relative self-stretch w-full flex-[0_0_auto]"
    >
      <div className="w-[785px] h-[422px] ml-[-0.50px] bg-black border-[#ffffff1f] relative mt-[-0.50px] mb-[-0.50px] rounded-[10px] border-[0.5px] border-solid shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]" />
      <div className="flex flex-col items-start gap-4 px-0 py-5 relative flex-1 self-stretch grow">
        <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <p className="text-[25px] tracking-[0.25px] relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white leading-[normal]">
              {post.title}
            </p>
            <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-[15px] tracking-[0.15px] leading-5">
              {post.description}
            </p>
          </div>
          <div className="inline-flex items-start gap-2 relative flex-[0_0_auto]">
            <div className="inline-flex h-6 items-center gap-1.5 px-3 py-0.5 relative flex-[0_0_auto] bg-[#ffffff29] rounded-[40px]">
              <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-[15px] tracking-[0.15px] leading-[normal] whitespace-nowrap">
                {post.category}
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 pl-[3px] pr-2.5 py-[3px] relative flex-[0_0_auto] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
              <img
                className="w-[18px] h-[18px] relative object-cover"
                alt="Image"
                src="/img/sample-profile-icon.png"
              />
              <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-[15px] tracking-[0.15px] leading-[normal] whitespace-nowrap">
                {post.writer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
function BlogPostCard1({ className, post }: Props) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className={`flex flex-col items-start justify-center gap-4 pt-1.5 pb-3.5 px-1.5 relative w-96 rounded-[10px] overflow-hidden border-[0.5px] border-solid border-[#ffffff14] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000] [background:linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.04)_100%)] ${className}`}
    >
      <div className="relative w-[373px] h-[201px] mt-[-0.50px] ml-[-0.50px] mr-[-0.50px] bg-black rounded border-[0.5px] border-solid border-[#ffffff14]" />
      <div className="flex flex-col items-start gap-3 px-2.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Space_Mono',Helvetica] font-normal text-[#f44b99] text-xs tracking-[0.12px] leading-[normal]">
          {post.category.toUpperCase()}
        </div>
        <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-[17px] tracking-[0.17px] leading-[normal]">
          {post.title}
        </p>
        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
          <img
            className="relative w-4 h-4 object-cover"
            alt="Image"
            src="/img/sample-profile-icon.png"
          />
          <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
            {post.writer}
          </div>
          <div className="relative flex-1 [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-xs text-right tracking-[0.12px] leading-[normal]">
            {post.date}
          </div>
        </div>
      </div>
    </Link>
  );
}
function BlogPostCard2({ className, post }: Props) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="flex flex-col items-start justify-center gap-4 pt-1.5 pb-3.5 px-1.5 flex-1 grow rounded-[10px] overflow-hidden shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000] [background:linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.04)_100%)] relative self-stretch border-[0.5px] border-solid border-[#ffffff14]"
    >
      <div className="relative w-[373px] h-[201px] mt-[-0.50px] ml-[-0.50px] mr-[-0.50px] bg-black rounded border-[0.5px] border-solid border-[#ffffff14]" />
      <div className="px-2.5 py-0 flex-1 grow flex flex-col items-start gap-3 relative self-stretch w-full">
        <p className="flex-1 text-[17px] tracking-[0.17px] relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white leading-[normal]">
          {post.title}
        </p>
        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex h-5 items-center gap-1.5 px-2 py-0.5 relative flex-[0_0_auto] bg-[#ffffff29] rounded-[40px]">
            <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
              {post.category}
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 pl-0.5 pr-2 py-0.5 relative flex-[0_0_auto] bg-[#ffffff0a] rounded-[40px] border-[0.5px] border-solid border-[#ffffff1f]">
            <img
              className="w-4 h-4 relative object-cover"
              alt="Image"
              src="/img/sample-profile-icon.png"
            />
            <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
              {post.writer}
            </div>
          </div>
          <div className="relative flex-1 [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-xs text-right tracking-[0.12px] leading-[normal]">
            {post.date}
          </div>
        </div>
      </div>
    </Link>
  );
}
function BlogPostCard3({ className, post }: Props) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className={`flex flex-col items-start justify-center gap-4 pt-0 pb-3.5 px-0 relative w-[385px] rounded-[10px] overflow-hidden border-[0.5px] border-solid border-[#ffffff29] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000] [background:linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.04)_100%)] ${className}`}
    >
      <div className="relative self-stretch w-full h-[201px] mt-[-0.50px] ml-[-0.50px] bg-black border-[0.5px] border-solid border-[#ffffff14]" />
      <div className="flex flex-col items-start gap-3 px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-[25px] h-2">
          <div className="absolute -top-px left-0 [background:linear-gradient(180deg,rgb(142,43.65,89.04)_0%,rgb(244,75,153)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-transparent text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
            {post.category}
          </div>
        </div>
        <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-[17px] tracking-[0.17px] leading-[normal]">
          {post.title}
        </p>
        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
          <img
            className="relative w-4 h-4 object-cover"
            alt="Image"
            src="/img/sample-profile-icon.png"
          />
          <p className="relative flex-1 [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-zinc-400 text-xs tracking-[0.12px] leading-[normal]">
            {post.writer} on {post.date}
          </p>
        </div>
      </div>
    </Link>
  );
}
