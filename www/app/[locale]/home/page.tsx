import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Hero } from "./_components/1_hero";
import { WhyBetter } from "./_components/2_why-better";
import { HowWorks } from "./_components/3_how-works";
import { WhoNeeds } from "./_components/4_who-needs";
import { MakeWith } from "./_components/5_make-with";
import { KillerFeatures } from "./_components/6_killer-features";
import { LastCatch } from "./_components/last-catch";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "home.metadata",
  });

  return {
    title: t("title"),
    applicationName: "NotCMS",
    description: t("description"),
    // "NotCMS is a Headless CMS that turns Notion into your content database. Say goodbye to legacy or custom bloated CMS, and start writing in Notion today. Deploy your blog with confidence with NotCMS SDK, and grow your audience fast.",
    keywords: [
      "Notion",
      "Blog",
      "CMS",
      "Headless CMS",
      "HCMS",
      "Content Management System",
      "WordPress",
      "Next.js",
      "React",
      "TypeScript",
      "Notion API",
      "Notion Blog",
      "Notion to Blog",
      "Notion as CMS",
      "Notion as Headless CMS",
      "Notion as Blog",
      "ブログ",
      "コンテンツ管理システム",
      "ヘッドレスCMS",
      "ワードプレス",
      "ノーション",
    ],
  } satisfies Metadata;
}

export default function Home() {
  return (
    <>
      <Image
        src="/img/home/hero-bg-tiles.svg"
        width={1440}
        height={720}
        alt=""
        // center
        className="absolute top-0 left-[50%] transform -translate-x-1/2 -z-10"
      />
      <Hero />
      <WhyBetter />
      <HowWorks />
      <WhoNeeds />
      <MakeWith />
      <KillerFeatures />
      {/* <LastCatch /> */}
    </>
  );
}
