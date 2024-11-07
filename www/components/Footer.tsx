import Link from "next/link";
import { siX } from "simple-icons";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

type Item = {
  title: string;
  href: string;
};
const links: Item[] = [
  { title: "Home", href: routes.home },
  { title: "Templates", href: routes.templates },
  { title: "Blog", href: routes.blog },
  { title: "Docs", href: routes.docs },
];
const explore: Item[] = [
  { title: "X", href: siteConfig.author.x },
  { title: "GitHub", href: siteConfig.github },
  // { title: "Notion template", href: "/" },
];
const resources: Item[] = [
  { title: "Terms of use", href: routes.terms },
  { title: "Privacy policy", href: routes.privacy },
  { title: "About", href: routes.about },
];

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between h-auto">
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
      <div className="h-[404px] px-32 py-16 justify-center items-start gap-12 inline-flex">
        <div className="w-[262px] flex-col justify-start items-start gap-6 inline-flex">
          <div className="justify-start items-center gap-4 inline-flex">
            {/* <siX.svg /> */}
            <Link href={siteConfig.author.x}>
              <svg
                className="size-6 text-white fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={siX.path} />
              </svg>
            </Link>
            {/* <div className="w-6 h-6 flex-col justify-center items-center inline-flex" />
            <div className="w-6 h-6 justify-center items-center flex" />
            <div className="w-6 h-6 py-[3px] justify-center items-center flex" />
            <div className="w-6 h-6 justify-center items-center flex" /> */}
          </div>
        </div>
        <div className="w-[262px] flex-col justify-start items-start gap-3 inline-flex">
          <div className="self-stretch h-[38px] pb-4 flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="text-white text-base font-semibold font-['Inter'] leading-snug">
                Links
              </div>
            </div>
          </div>
          {links.map((link) => (
            <Link
              key={link.title}
              className="w-full h-[22px] justify-start items-center inline-flex text-white text-base font-normal font-['Inter'] leading-snug"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="w-[262px] flex-col justify-start items-start gap-3 inline-flex">
          <div className="self-stretch h-[38px] pb-4 flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="text-white text-base font-semibold font-['Inter'] leading-snug">
                Explore
              </div>
            </div>
          </div>
          {explore.map((link) => (
            <Link
              key={link.title}
              className="w-full h-[22px] justify-start items-center inline-flex text-white text-base font-normal font-['Inter'] leading-snug"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="w-[262px] flex-col justify-start items-start gap-3 inline-flex">
          <div className="self-stretch h-[38px] pb-4 flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="text-white text-base font-semibold font-['Inter'] leading-snug">
                Resources
              </div>
            </div>
          </div>
          {resources.map((link) => (
            <Link
              key={link.title}
              className="w-full h-[22px] justify-start items-center inline-flex text-white text-base font-normal font-['Inter'] leading-snug"
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
