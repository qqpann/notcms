import Image from "next/image";
import { Link } from "~/src/i18n/routing";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";
import { Separator } from "./ui/separator";

type Item = {
  title: string;
  href: string;
};
const links: Item[] = [
  { title: "Home", href: routes.home },
  { title: "Templates", href: routes.templates },
  { title: "Blog", href: routes.blog },
  // { title: "About", href: routes.about },
];
const socials: Item[] = [
  { title: "X", href: siteConfig.author.x },
  // { title: "Notion template", href: "/" },
];
const resources: Item[] = [
  // { title: "Docs", href: routes.docs },
  { title: "GitHub", href: siteConfig.github },
];

export function Footer() {
  const legal: Item[] = [
    { title: "Terms of use", href: routes.terms },
    { title: "Privacy policy", href: routes.privacy },
    { title: "Tokushoho", href: routes.tokushoho },
  ];
  return (
    <footer
      className="h-auto mt-16"
      style={{
        background:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
      }}
    >
      <div className="container max-w-[1440px] mx-auto px-4 pt-16 md:px-32 md:pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-0">
          <div className="col-span-1 md:col-span-3 flex-col justify-start items-start gap-6 inline-flex">
            <div className="flex flex-col">
              <Image
                src="/img/icon-192x192.png"
                alt="logo"
                width={64}
                height={64}
                className="mb-6"
              />
              <span className="text-2xl font-semibold font-Roobert mb-3">
                NotCMS
              </span>
              <p className="text-sm text-white text-opacity-70">
                Instantly publish your website content from Notion.
              </p>
            </div>
          </div>
          <div className="col-span-1 md:min-h-[200px] flex-col justify-start items-start gap-3 inline-flex">
            <div className="flex-col justify-start items-start gap-2.5 flex">
              <div className="self-stretch justify-start items-start inline-flex">
                <div className="text-white text-sm font-semibold leading-snug">
                  Links
                </div>
              </div>
            </div>
            {links.map((link) => (
              <Link
                key={link.title}
                className="w-full h-[22px] justify-start items-center inline-flex text-white text-opacity-70 text-sm font-normal leading-snug"
                href={link.href}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="col-span-1 md:min-h-[200px] flex-col justify-start items-start gap-3 inline-flex">
            <div className="flex-col justify-start items-start gap-2.5 flex">
              <div className="self-stretch justify-start items-start inline-flex">
                <div className="text-white text-sm font-semibold leading-snug">
                  Socials
                </div>
              </div>
            </div>
            {socials.map((link) => (
              <Link
                key={link.title}
                className="w-full h-[22px] justify-start items-center inline-flex text-white text-opacity-70 text-sm font-normal leading-snug"
                href={link.href}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="col-span-1 md:min-h-[200px] flex-col justify-start items-start gap-3 inline-flex">
            <div className="flex-col justify-start items-start gap-2.5 flex">
              <div className="self-stretch justify-start items-start inline-flex">
                <div className="text-white text-sm font-semibold leading-snug">
                  Resources
                </div>
              </div>
            </div>
            {resources.map((link) => (
              <Link
                key={link.title}
                className="w-full h-[22px] justify-start items-center inline-flex text-white text-opacity-70 text-sm font-normal leading-snug"
                href={link.href}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <Separator className="my-8 opacity-[0.12]" />
        {/* link to terms and policy */}
        <div className="w-full flex text-sm gap-8 lg:flex">
          {legal.map((link) => (
            <Link
              key={link.title}
              className="text-white text-opacity-50"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
