import Link from "next/link";
import type { Route } from "next";

import { LOCALES, type Locale } from "@/lib/i18n";

export function LocaleToggle({ currentLocale }: { currentLocale: Locale }) {
  return (
    <div
      className="inline-flex h-8 w-[89px] shrink-0 items-center rounded-[4px] p-0"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0, 20, 10, 0.204) 0%, rgba(0, 45, 30, 0.067) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)",
      }}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => {
        const active = l === currentLocale;
        const label = l === "de" ? "DU" : l.toUpperCase();
        return (
          <Link
            key={l}
            href={`/${l}` as Route}
            aria-current={active ? "page" : undefined}
            className={`flex h-full flex-1 items-center justify-center rounded-[4px] px-4 text-sm leading-5 tracking-normal transition-colors ${
              active
                ? "bg-white font-medium text-[rgba(0,8,5,0.9)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05),0px_2px_1px_0px_rgba(0,0,0,0.05),0px_1px_4px_0px_rgba(0,31,21,0.1)]"
                : "font-normal text-[rgba(0,8,5,0.9)] hover:bg-white/40"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
