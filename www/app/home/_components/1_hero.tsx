import Link from "next/link";

import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

export function Hero() {
  return (
    <section className="container max-w-[1440px] px-32 mx-auto flex flex-col items-center gap-24 pt-24 pb-0 relative">
      <div className="absolute w-[1184px] h-[768px] top-[480px] left-32 [background:linear-gradient(180deg,rgb(115,115,115)_0%,rgba(217,217,217,0)_75%)] opacity-0" />

      <div className="flex flex-col items-center gap-12 relative self-stretch w-full flex-[0_0_auto]">
        <h1 className="w-full font-Roobert font-bold text-white text-[64px] text-center tracking-[-0.64px] leading-[72px]">
          Instantly create & publish <br /> your website content&nbsp;
          <span
            // className="[text-shadow:0px_0.5px_0.5px_#fffffff5] [-webkit-text-stroke:0.75px_#ffffff52] blur-[1px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,183.02,98.51,0.01)_0%,rgba(255,80.69,195.73,0.01)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] opacity-20 [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-transparent text-[64px] text-center tracking-[-0.64px] leading-[72px]"
            style={{
              // background:
              //   "radial-gradient(50% 50% at 50% 50%, rgba(255,183.02,98.51,0.01) 0%, rgba(255,80.69,195.73,0.01) 100%)",
              background: "linear-gradient(135deg, #FFB763 0%, #FF51C4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            from Notion
          </span>
        </h1>

        <p className="relative self-stretch [font-family:'Inter-Medium',Helvetica] font-normal text-white text-lg text-center tracking-[-0.18px] leading-[26px]">
          <span className="font-medium tracking-[-0.03px]">
            Make website content management easier.
          </span>

          <span className="[font-family:'Inter-Regular',Helvetica] tracking-[-0.03px]">
            &nbsp;
          </span>

          <span className="[font-family:'Inter-Light',Helvetica] font-light tracking-[-0.03px]">
            Set up your website with NotCMS once <br />
            and update your content in Notion forever. See changes in seconds!
          </span>
        </p>

        <button
          className="h-9 text-base font-medium text-white inline-flex align-center justify-center gap-2 whitespace-nowrap rounded-full"
          style={{
            position: "relative",
            width: "191px",
            padding: "0.75rem 1.5rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
          }}
        >
          <span
            className="absolute left-0 top-0 h-9 w-full rounded-full opacity-20 mix-blend-plus-lighter"
            style={{
              border: "0.75px solid rgba(255, 255, 255, 0.32)",
              background:
                "radial-gradient(115.6% 115.9% at -1.81% 0%, rgba(255, 183, 99, 0.01) 0%, rgba(255, 81, 196, 0.01) 100%)",
              boxShadow: `
                0px 0.5px 0.5px 0px rgba(255,255,255,0.96) inset,
                0px 1.5px 1.5px 0px rgba(255,255,255,0.64) inset,
                0px 3px 3px 0px rgba(255,255,255,0.48) inset,
                0px 6px 6px 0px rgba(255,255,255,0.24) inset`,
              zIndex: 10,
            }}
          />
          <span
            className="absolute inset-0 left-0 top-0 h-9 w-full rounded-full mix-blend-plus-lighter"
            style={{
              padding: "0.5px", // ボーダーの幅
              background:
                "linear-gradient(270deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 100%)",
              WebkitMask:
                "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              zIndex: "-1",
            }}
          />
          <span
            className="absolute left-0 top-0 h-9 w-full rounded-full -z-10"
            style={{
              background:
                "linear-gradient(116.55deg, #FF8763 18.62%, #FE0291 96.99%)",
            }}
          />
          <img
            src="/img/candy-glow-left.png"
            className="absolute left-0 top-0 h-9 z-0 mix-blend-plus-lighter"
          />
          <img
            src="/img/candy-glow-right.png"
            className="absolute right-0 top-0 h-9 z-0 mix-blend-plus-lighter"
          />
          <span
            className="mix-blend-plus-darker"
            style={{
              textShadow:
                "0 2px 2px rgba(0,0,0,0.24), 0 8px 8px rgba(0,0,0,0.08)",
            }}
          >
            Get started
          </span>
        </button>
      </div>

      <img
        // width={1184}
        // height={768}
        className="relative w-[1184px] h-[768px]"
        alt="Dashboard screenshot of NotCMS"
        src="/img/home/hero-image.webp"
      />

      {/* <div className="absolute w-[1184px] h-px top-[484px] left-32 blur-sm [background:linear-gradient(180deg,rgba(129,129,129,0)_0%,rgb(129,129,129)_50%,rgba(129,129,129,0)_100%)] opacity-50" /> */}

      {/* <div className="absolute w-[1184px] h-px top-[484px] left-32 blur-[2px] [background:linear-gradient(180deg,rgba(129,129,129,0)_0%,rgb(129,129,129)_50%,rgba(129,129,129,0)_100%)] opacity-50" /> */}
    </section>
  );
}
