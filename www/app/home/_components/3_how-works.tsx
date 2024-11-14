import Image from "next/image";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

export function HowWorks() {
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>Composable content architecture</SectionPreTitle>
        <SectionTitle>How NotCMS works</SectionTitle>
      </SectionHeader>
      <div className="flex flex-col items-center">
        {/* 1 */}
        <div className="relative -mb-[45px] z-50">
          <Image
            src="/img/home/lp-3-how-works-1-website.png"
            width={256}
            height={148}
            alt="Website"
          />
          <div className="absolute top-0 right-0 transform translate-x-full pl-8 w-64 text-right">
            <h3 className="text-xl font-semibold mb-2">Your website</h3>
            <span className="shrink-0 bg-border h-[1px] w-full" />
            <p className="text-sm text-gray-400">
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
            </p>
          </div>
        </div>
        {/* 2 */}
        <div className="relative -mb-[45px] z-40">
          <Image
            src="/img/home/lp-3-how-works-2-codebase.png"
            width={256}
            height={148}
            alt="API"
          />
          <div className="absolute top-0 left-0 transform -translate-x-full pr-8 w-64">
            <h3 className="text-xl font-semibold mb-2">Website codebase</h3>
            <p className="text-sm text-gray-400">
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
            </p>
          </div>
        </div>
        {/* 3 */}
        <div className="relative -mb-[45px] z-30">
          <Image
            src="/img/home/lp-3-how-works-3-api.png"
            width={256}
            height={148}
            alt="Dashboard"
          />
          <div className="absolute top-0 right-0 transform translate-x-full pl-8 w-64 text-right">
            <h3 className="text-xl font-semibold mb-2">NotCMS API</h3>
            <p className="text-sm text-gray-400">
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
            </p>
          </div>
        </div>
        {/* 4 */}
        <div className="relative -mb-[45px] z-20">
          <Image
            src="/img/home/lp-3-how-works-4-dashboard.png"
            width={256}
            height={148}
            alt="NotCMS Dashboard"
          />
          <div className="absolute top-0 left-0 transform -translate-x-full pr-8 w-64">
            <h3 className="text-xl font-semibold mb-2">NotCMS Dashboard</h3>
            <p className="text-sm text-gray-400">
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
            </p>
          </div>
        </div>
        {/* 5 */}
        <div className="relative z-10">
          <Image
            src="/img/home/lp-3-how-works-5-editor.png"
            width={256}
            height={148}
            alt="Notion editor/database"
          />
          <div className="absolute top-0 right-0 transform translate-x-full pl-8 w-64 text-right">
            <h3 className="text-xl font-semibold mb-2">
              Notion editor/database
            </h3>
            <p className="text-sm text-gray-400">
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
