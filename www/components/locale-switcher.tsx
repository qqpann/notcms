"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "~/src/i18n/routing";

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
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1 h-7 hover:bg-white/15 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-white" />
          <span className="text-sm text-white tracking-[-0.14px]">
            {currentLocale.label}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-white" />
      </button>
      {/* Dropdown */}
      <div className="absolute bottom-full left-0 mb-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="bg-zinc-900 border border-white/10 rounded-lg py-1 min-w-[140px]">
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleLocaleChange(l.code)}
              className={`w-full text-left px-3 py-1.5 text-sm tracking-[-0.14px] hover:bg-white/10 transition-colors ${
                l.code === locale ? "text-white" : "text-white/70"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
