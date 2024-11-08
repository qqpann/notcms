import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "./_components/1_hero";

export const metadata: Metadata = {
  title: "NotCMS - Turn Notion into Blog",
  applicationName: "NotCMS",
  description:
    "NotCMS is a Headless CMS that turns Notion into your content database. Say goodbye to legacy or custom bloated CMS, and start writing in Notion today. Deploy your blog with confidence with NotCMS SDK, and grow your audience fast.",
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
  ],
};

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
