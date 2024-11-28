import Image from "next/image";
import Link from "next/link";
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
];
const socials: Item[] = [
  { title: "X", href: siteConfig.author.x },
  // { title: "Notion template", href: "/" },
];
const resources: Item[] = [
  { title: "Docs", href: routes.docs },
  { title: "GitHub", href: siteConfig.github },
  { title: "About", href: routes.about },
];

export function Footer() {
  return (
    <footer
      className="h-auto px-32 pt-16 pb-8 mt-16"
      style={{
        background:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
      }}
    >
      {/* <div className="w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex pb-4">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href={siteConfig.author.x}
          target="_blank"
          rel="noopener noreferrer"
        >
          Coded by {siteConfig.author.name} (@{siteConfig.author.handle})
        </a>
      </div> */}
      <div className="w-full grid grid-cols-6">
        <div className="col-span-3 flex-col justify-start items-start gap-6 inline-flex">
          <div className="flex flex-col">
            {/* <siX.svg /> */}
            <Image
              src="/img/icon-192x192.png"
              alt="logo"
              width={64}
              height={64}
              className="mb-6"
            />
            <span className="text-2xl tracking-tight mb-3">NotCMS</span>
            <p className="text-sm text-white text-opacity-70">
              Instantly publish your website content from Notion.
            </p>
            {/* <div className="w-6 h-6 flex-col justify-center items-center inline-flex" />
            <div className="w-6 h-6 justify-center items-center flex" />
            <div className="w-6 h-6 py-[3px] justify-center items-center flex" />
            <div className="w-6 h-6 justify-center items-center flex" /> */}
          </div>
        </div>
        <div className="col-span-1 min-h-[200px] flex-col justify-start items-start gap-3 inline-flex">
          <div className="flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="text-white text-sm font-semibold font-['Inter'] leading-snug">
                Links
              </div>
            </div>
          </div>
          {links.map((link) => (
            <Link
              key={link.title}
              className="w-full h-[22px] justify-start items-center inline-flex text-white text-opacity-70 text-sm font-normal font-['Inter'] leading-snug"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="col-span-1 min-h-[200px] flex-col justify-start items-start gap-3 inline-flex">
          <div className="flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="text-white text-sm font-semibold font-['Inter'] leading-snug">
                Socials
              </div>
            </div>
          </div>
          {socials.map((link) => (
            <Link
              key={link.title}
              className="w-full h-[22px] justify-start items-center inline-flex text-white text-opacity-70 text-sm font-normal font-['Inter'] leading-snug"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="col-span-1 min-h-[200px] flex-col justify-start items-start gap-3 inline-flex">
          <div className="flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="text-white text-sm font-semibold font-['Inter'] leading-snug">
                Resources
              </div>
            </div>
          </div>
          {resources.map((link) => (
            <Link
              key={link.title}
              className="w-full h-[22px] justify-start items-center inline-flex text-white text-opacity-70 text-sm font-normal font-['Inter'] leading-snug"
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
        <Link className="text-white text-opacity-50" href={routes.terms}>
          Terms of use
        </Link>
        <Link className="text-white text-opacity-50" href={routes.privacy}>
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
