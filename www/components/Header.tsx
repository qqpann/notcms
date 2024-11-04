"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

type NavItem = {
  title: string;
  href: string;
};
const navItems: NavItem[] = [
  { title: "Home", href: routes.home },
  // { title: "Pricing", href: routes.pricing },
  // { title: "Templates", href: routes.templates },
  { title: "Blog", href: routes.blog },
  // { title: "Docs", href: routes.docs },
];
export function Header() {
  return (
    <div className="container max-w-[1440px] px-32 py-0 h-16 mx-auto flex items-center">
      <Link href={routes.top} className="flex items-center gap-1.5 flex-1 grow">
        <Image
          width={17}
          height={17}
          alt="NotCMS logo"
          src="/img/notcms-icon.png"
        />
        <div className="w-fit [text-shadow:0px_1px_2px_#0000000f] [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0.60px] leading-[normal] whitespace-nowrap">
          NotCMS
        </div>
      </Link>

      <nav className="flex gap-x-10">
        {navItems.map((item) => (
          <NavItem key={item.title} title={item.title} href={item.href} />
        ))}
      </nav>

      <div className="flex items-center justify-end gap-2 flex-1 grow">
        <div className="inline-flex h-7 items-center justify-center gap-2 px-3 py-[9.5px] bg-[#e6e6e61a] rounded-[10px]">
          <Link
            href={siteConfig.waitList}
            className="w-fit mt-[-1.00px] [font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap"
          >
            {/* Get started */}
            Join Waitlist
          </Link>
        </div>
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
        } text-sm text-center tracking-[0.14px] leading-[normal] whitespace-nowrap`}
      >
        {title}
      </div>
    </Link>
  );
}
