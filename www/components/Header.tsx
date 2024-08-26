/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

export const Header = (): JSX.Element => {
  return (
    <div className="flex w-[1440px] h-16 items-center gap-10 px-32 py-0 relative">
      <div className="flex items-center gap-1.5 relative flex-1 grow">
        <div className="relative w-4 h-3.5 opacity-70">
          <img
            className="absolute w-[17px] h-[17px] -top-px left-0"
            alt="Rectangle"
            src="/img/notcms-icon.png"
          />
        </div>
        <div className="relative w-fit mt-[-1.00px] [text-shadow:0px_1px_2px_#0000000f] [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0.60px] leading-[normal] whitespace-nowrap">
          NotCMS
        </div>
      </div>
      <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-[#aaafb5] text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap">
        Pricing
      </div>
      <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-[#aaafb5] text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap">
        Templates
      </div>
      <div className="relative w-fit [font-family:'Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap">
        Blog
      </div>
      <div className="relative w-fit [font-family:'Selecta_VF_Trial-Light',Helvetica] font-light text-[#aaafb5] text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap">
        Docs
      </div>
      <div className="flex flex-col items-end justify-center gap-2 relative flex-1 grow">
        <div className="inline-flex h-7 items-center justify-center gap-2 px-3 py-[9.5px] relative bg-[#e6e6e61a] rounded-[10px]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap">
            Get started
          </div>
        </div>
      </div>
    </div>
  );
};
