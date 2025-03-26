"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Link, usePathname } from "~/src/i18n/routing";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";
import { Button } from "./ui/button";
import { GradientSeparator, Separator } from "./ui/separator";

type NavItem = {
  title: string;
  href: string;
};
const navItems: NavItem[] = [
  { title: "Home", href: routes.home },
  { title: "Pricing", href: routes.pricing },
  { title: "Templates", href: routes.templates },
  { title: "Blog", href: routes.blog },
  // { title: "Docs", href: routes.docs },
];
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="container max-w-[1440px] px-10 md:px-32 py-0 h-16 mx-auto flex items-center">
      <Link href={routes.top} className="flex items-center gap-1.5 flex-1 grow">
        <div className="w-fit [text-shadow:0px_1px_2px_#0000000f] font-Roobert tracking-[-0.01em] font-semibold text-white text-xl leading-[normal] whitespace-nowrap">
          NotCMS
        </div>
      </Link>

      <nav className="gap-x-10 hidden md:flex">
        {navItems.map((item) => (
          <NavItem key={item.title} title={item.title} href={item.href} />
        ))}
      </nav>

      <div
        className={cn(
          "fixed bottom-0 right-0 top-0 pt-16 z-40 w-full overflow-y-auto bg-black/90 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <GradientSeparator />
                <Link
                  href={item.href}
                  className="block py-2 h-16 leading-[48px] text-2xl font-medium transition-colors hover:text-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center justify-end gap-2 flex-1 grow">
        <Button size="sm" className="hidden md:flex" asChild>
          <Link
            href={routes.dashboard}
            className="mt-[-1.00px] [font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-white text-center leading-[normal] whitespace-nowrap"
          >
            Get started
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((c) => !c)}
          aria-label="Open menu"
          className="md:hidden z-50 bg-transparent hover:bg-transparent"
        >
          <Image
            src="/img/header-icons/hamburger-open.svg"
            alt="open menu"
            className={isOpen ? "hidden" : "block"}
            width={24}
            height={24}
          />
          <Image
            src="/img/header-icons/hamburger-close.svg"
            alt="close menu"
            className={isOpen ? "block" : "hidden"}
            width={24}
            height={24}
          />
        </Button>
      </div>
    </div>
  );
}

function NavItem({ title, href }: { title: string; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`${
          isActive ? "text-white" : "text-[#aaafb5]"
        } text-sm text-center leading-[normal] whitespace-nowrap`}
      >
        {title}
      </div>
    </Link>
  );
}
