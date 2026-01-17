import Image from "next/image";
import { Link } from "~/src/i18n/routing";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";
import { LocaleSwitcher } from "./locale-switcher";
import { CandyButton } from "./ui/button";
import { GradientSeparator } from "./ui/separator";

type Item = {
  title: string;
  href: string;
};

const resourcesLinks: Item[] = [
  { title: "Home", href: routes.home },
  { title: "Templates", href: routes.templates },
  { title: "Blog", href: routes.blog },
  { title: "Docs", href: routes.docs },
];

const resourcesLinks2: Item[] = [
  { title: "Github", href: siteConfig.github },
  // { title: "Notion", href: "https://notion.so" },
  { title: "About", href: routes.about },
];

const socialsLinks: Item[] = [
  { title: "Twitter", href: siteConfig.author.x },
  // { title: "LinkedIn", href: "https://linkedin.com" },
];

const othersLinks: Item[] = [
  { title: "Terms of service", href: routes.terms },
  { title: "Privacy policy", href: routes.privacy },
];

function LinkColumn({ title, links }: { title: string; links: Item[] }) {
  return (
    <div className="flex flex-1 flex-col gap-8 items-start">
      <p className="text-sm font-semibold text-white tracking-[-0.14px]">
        {title}
      </p>
      <div className="flex flex-col gap-4 items-start">
        {links.map((link) => (
          <Link
            key={link.title}
            className="text-sm text-white/70 tracking-[-0.14px] hover:text-white transition-colors"
            href={link.href}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 flex flex-col gap-12 items-center pt-16 px-8 md:px-32">
      {/* CTA Section */}
      <div className="flex flex-col gap-10 items-center w-full">
        <div className="flex flex-col gap-6 items-center w-full">
          {/* Logo Mark */}
          <div className="relative w-9 h-9 rounded-[10px] overflow-hidden shadow-[0px_0.205px_0.205px_0px_rgba(0,0,0,0.1),0px_8.182px_8.182px_0px_rgba(0,0,0,0.2)]">
            <Image
              src="/img/icon-192x192.png"
              alt="NotCMS Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Title */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-[32px] font-semibold font-Roobert text-white tracking-[-0.32px] leading-[1.28]">
              Create & publish your
            </h2>
            <h2 className="text-2xl md:text-[32px] font-semibold font-Roobert text-white tracking-[-0.32px] leading-[1.28]">
              website content from Notion
            </h2>
          </div>
        </div>
        {/* CTA Button */}
        <Link href={routes.dashboard}>
          <CandyButton extraGlow>Start publishing</CandyButton>
        </Link>
      </div>

      {/* Separator */}
      <GradientSeparator className="w-full" />

      {/* Links Section */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-0 items-start px-0 md:px-32 w-full">
        <LinkColumn title="Resources" links={resourcesLinks} />
        <LinkColumn title="Resources" links={resourcesLinks2} />
        <LinkColumn title="Socials" links={socialsLinks} />
        <LinkColumn title="Others" links={othersLinks} />
      </div>

      {/* Separator */}
      <GradientSeparator className="w-full" />

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        {/* Language Selector */}
        <LocaleSwitcher />
        {/* Copyright */}
        <p className="text-sm text-white/50 tracking-[-0.14px]">
          © {new Date().getFullYear()} NotCMS. All rights reserved.
        </p>
      </div>

      {/* Large NotCMS Text */}
      <div className="relative w-full overflow-hidden">
        <p
          className="text-[120px] md:text-[256px] font-semibold font-Roobert text-white/[0.08] text-center tracking-[-2.56px] leading-none select-none"
          style={{
            WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.2)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          NotCMS
        </p>
      </div>
    </footer>
  );
}
