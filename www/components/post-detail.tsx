import { MainContent } from "./blog/main-content";

type PostDetail = {
  id: string;
  title: string;
  content: string;
};
export function PostDetail({ post }: { post: PostDetail }) {
  return (
    <div className="flex flex-col items-start relative">
      <div className="flex flex-col items-center gap-12 pt-16 pb-32 px-32 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[784px] items-center gap-12 relative flex-[0_0_auto]">
          <div className="flex flex-col items-center gap-8 relative self-stretch w-full flex-[0_0_auto]">
            {/* <div className="relative self-stretch mt-[-1.00px] [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-sm text-center leading-[normal]">
              {post.date}
            </div> */}
            <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-5xl text-center leading-[normal]">
              {post.title}
            </p>
          </div>
        </div>
        <MainContent content={post.content} />
      </div>
    </div>
  );
}
