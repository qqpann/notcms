import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button, CandyButton } from "~/components/ui/button";
import { Link } from "~/src/i18n/routing";

import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

export function Hero() {
  const t = useTranslations("1_hero");
  return (
    <section className="container max-w-[1440px] px-4 md:px-32 mx-auto flex flex-col items-center gap-16 md:gap-24 pt-12 md:pt-24 pb-0 relative">
      <div className="flex flex-col items-center gap-12 relative self-stretch w-full flex-[0_0_auto]">
        <h1 className="w-full font-Roobert font-bold text-white text-[36px] leading-[48px] md:text-[64px] text-center md:leading-[72px]">
          Create & publish <br /> your website content
          <br className="md:hidden" />{" "}
          <span
            style={{
              display: "inline-block",
              background:
                "url('/img/home/from-notion-bg.png') no-repeat center",
              backgroundSize: "cover",
              // Follow the order! webkit first!
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            from Notion
          </span>
        </h1>

        <p className="relative self-stretch [font-family:'Inter-Medium',Helvetica] font-normal text-white text-base md:text-lg text-center leading-[26px]">
          <span className="font-medium hidden md:inline">
            Make website content management easier.
          </span>
          &nbsp;
          <span className="font-light text-white/70">
            Set up your website with NotCMS once <br />
            and update your content in Notion forever.{" "}
            <br className="md:hidden" /> See changes in seconds!
          </span>
        </p>

        <Link href={routes.dashboard}>
          <CandyButton className="w-[191px]" extraGlow>
            {t("get-started")}
          </CandyButton>
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
