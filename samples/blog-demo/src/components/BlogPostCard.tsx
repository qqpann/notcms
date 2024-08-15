/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: string;
}

export const BlogPostCard = ({ className }: Props): JSX.Element => {
  return (
    <div
      className={`flex flex-col items-start justify-center gap-4 pt-1.5 pb-3.5 px-1.5 relative w-96 rounded-[10px] overflow-hidden border-[0.5px] border-solid border-[#ffffff14] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000] [background:linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.04)_100%)] ${className}`}
    >
      <div className="relative w-[373px] h-[201px] mt-[-0.50px] ml-[-0.50px] mr-[-0.50px] bg-black rounded border-[0.5px] border-solid border-[#ffffff14]" />
      <div className="flex flex-col items-start gap-3 px-2.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Space_Mono',Helvetica] font-normal text-[#f44b99] text-xs tracking-[0.12px] leading-[normal]">
          BLOG
        </div>
        <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-[17px] tracking-[0.17px] leading-[normal]">
          NotCMS’ very first blog post
        </p>
        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
          <img
            className="relative w-4 h-4 object-cover"
            alt="Image"
            src="/img/sample-profile-icon.png"
          />
          <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-white text-xs tracking-[0.12px] leading-[normal] whitespace-nowrap">
            Qiushi Pan
          </div>
          <div className="relative flex-1 [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-zinc-400 text-xs text-right tracking-[0.12px] leading-[normal]">
            Aug 14, 2024
          </div>
        </div>
      </div>
    </div>
  );
};
