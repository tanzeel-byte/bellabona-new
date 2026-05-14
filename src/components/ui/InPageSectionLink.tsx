"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  /** DOM id of the target section (e.g. heading id). */
  sectionId: string;
  className?: string;
  children: React.ReactNode;
  /** Runs after navigation or in-page scroll (e.g. close mobile menu). */
  onNavigate?: () => void;
};

/** Same-page scroll on the homepage; full navigation when coming from elsewhere. */
export function InPageSectionLink({
  locale,
  sectionId,
  className,
  children,
  onNavigate,
}: Props) {
  const pathname = usePathname();
  const href = `/${locale}#${sectionId}` as Route;
  const homePath = `/${locale}`;

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        const onHome = pathname === homePath;
        if (onHome) {
          event.preventDefault();
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}
