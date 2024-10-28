import { marked } from "marked";
import React from "react";
import { nc } from "~/src/notcms/schema";

export const revalidate = 10;

type PostDetail = {
  id: string;
  title: string;
  content: string;
};

export default async function Page({ params }: { params: { id: string } }) {
  const { data } = await nc.query.service.getPage("01J6A6NXVPFC65SM2GE6R88W2R");
  const page = {
    id: params.id,
    title: data.properties.title,
    content: data.content,
  } satisfies PostDetail;
  return <BlogDetail post={page} />;
}
function BlogDetail({ post }: { post: PostDetail }) {
  return (
    <div className="flex flex-col items-start relative bg-white [background:linear-gradient(180deg,rgb(10.82,10.81,11.21)_0%,rgb(0,0,0)_100%)]">
      <div className="flex flex-col items-center gap-12 pt-16 pb-32 px-32 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[784px] items-center gap-12 relative flex-[0_0_auto]">
          <div className="flex flex-col items-center gap-8 relative self-stretch w-full flex-[0_0_auto]">
            {/* <div className="relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-sm text-center tracking-[0.14px] leading-[normal]">
              {post.date}
            </div> */}
            <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0.48px] leading-[normal]">
              {post.title}
            </p>
          </div>
        </div>
        <main
          className="prose prose-base dark:prose-invert prose-h2:text-2xl text-white relative w-[600px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-normal text-transparent text-[15px] tracking-[0.15px] leading-[15px]"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is a markdown renderer
          dangerouslySetInnerHTML={{
            __html: marked(post.content ?? ""),
          }}
        />
      </div>
    </div>
  );
}
