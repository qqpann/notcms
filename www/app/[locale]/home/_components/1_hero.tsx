import Image from "next/image";
import { Button, CandyButton } from "~/components/ui/button";
import { Link } from "~/src/i18n/routing";

import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

export function Hero() {
  return (
    <section className="container max-w-[1440px] px-4 md:px-32 mx-auto flex flex-col items-center gap-16 md:gap-24 pt-12 md:pt-24 pb-0 relative">
      <div className="flex flex-col items-center gap-12 relative self-stretch w-full flex-[0_0_auto]">
        <h1 className="w-full font-Roobert font-bold text-white text-[36px] leading-[48px] md:text-[64px] text-center tracking-[-0.64px] md:leading-[72px]">
          <span className="hidden md:inline">Instantly c</span>
          <span className="inline md:hidden">C</span>
          reate & publish <br /> your website content
          <br className="md:hidden" />{" "}
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

        <p className="relative self-stretch [font-family:'Inter-Medium',Helvetica] font-normal text-white text-base md:text-lg text-center tracking-[-0.18px] leading-[26px]">
          <span className="font-medium tracking-[-0.03px] hidden md:inline">
            Make website content management easier.
          </span>
          &nbsp;
          <span className="font-light tracking-[-0.03px] text-white/70">
            Set up your website with NotCMS once <br />
            and update your content in Notion forever.{" "}
            <br className="md:hidden" /> See changes in seconds!
          </span>
        </p>

        <Link href={routes.dashboard}>
          <CandyButton className="w-[191px]">Get started</CandyButton>
        </Link>
      </div>

      <Image
        width={1184}
        height={768}
        className="relative"
        alt="Dashboard screenshot of NotCMS"
        src="/img/home/hero-image.webp"
      />

      {/* <div className="absolute w-[1184px] h-px top-[484px] left-32 blur-sm [background:linear-gradient(180deg,rgba(129,129,129,0)_0%,rgb(129,129,129)_50%,rgba(129,129,129,0)_100%)] opacity-50" /> */}

      {/* <div className="absolute w-[1184px] h-px top-[484px] left-32 blur-[2px] [background:linear-gradient(180deg,rgba(129,129,129,0)_0%,rgb(129,129,129)_50%,rgba(129,129,129,0)_100%)] opacity-50" /> */}
    </section>
  );
}
