"use client";
/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

type NavItem = {
  title: string;
  href: string;
};
const navItems: NavItem[] = [
  { title: "Home", href: routes.landing },
  { title: "Pricing", href: routes.pricing },
  { title: "Templates", href: routes.templates },
  { title: "Blog", href: routes.blog },
  { title: "Docs", href: routes.docs },
];
export function Header() {
  return (
    <div className="flex w-[1440px] h-16 items-center gap-10 px-32 py-0 relative">
      <Link
        href={routes.top}
        className="flex items-center gap-1.5 relative flex-1 grow"
      >
        <div className="relative w-4 h-3.5 opacity-70">
          <img
            className="absolute w-[17px] h-[17px] -top-px left-0"
            alt="Rectangle"
            src="/img/notcms-icon.png"
          />
        </div>
        <div className="relative w-fit mt-[-1.00px] [text-shadow:0px_1px_2px_#0000000f] [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0.60px] leading-[normal] whitespace-nowrap">
          NotCMS
        </div>
      </Link>
      {navItems.map((item) => (
        <NavItem key={item.title} title={item.title} href={item.href} />
      ))}
      <Link
        href={siteConfig.waitlist}
        className="flex flex-col items-end justify-center gap-2 relative flex-1 grow"
      >
        <div className="inline-flex h-7 items-center justify-center gap-2 px-3 py-[9.5px] relative bg-[#e6e6e61a] rounded-[10px]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap">
            {/* Get started */}
            Join Waitlist
          </div>
        </div>
      </Link>
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
        } text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap`}
      >
        {title}
      </div>
    </Link>
  );
}
