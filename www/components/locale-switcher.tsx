"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "~/src/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const locales = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = locales.find((l) => l.code === locale) ?? locales[0];

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1 h-7 hover:bg-white/15 transition-colors outline-none"
        >
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-sm text-white tracking-[-0.14px]">
              {currentLocale.label}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        className="min-w-[140px] border-white/10"
      >
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={handleLocaleChange}
        >
          {locales.map((l) => (
            <DropdownMenuRadioItem
              key={l.code}
              value={l.code}
              className="cursor-pointer"
            >
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
