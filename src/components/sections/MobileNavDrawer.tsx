"use client";

import { SanityImage as Image } from "@/components/ui/SanityImage";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { Route } from "next";

import { Wordmark } from "@/components/brand/Wordmark";
import { CtaPopupButton } from "@/components/ui/CtaPopup";
import { InPageSectionLink } from "@/components/ui/InPageSectionLink";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import {
  HEADER_MORE_SECTION_ID,
  isDailyLunchNav,
  isMoreNav,
} from "@/lib/header-nav";
import type { Locale } from "@/lib/i18n";

type NavItem = {
  label: string;
  href: string;
  isMore?: boolean;
  isDailyLunch?: boolean;
};

type Props = {
  locale: Locale;
  logoAlt: string;
  logoUrl: string | null;
  links: NavItem[];
  secondary?: NavItem;
  cta?: NavItem;
};

const COPY = {
  en: {
    open: "Open menu",
    close: "Close menu",
    navigation: "Mobile navigation",
  },
  de: {
    open: "Menü öffnen",
    close: "Menü schließen",
    navigation: "Mobile Navigation",
  },
} as const;

export function MobileNavDrawer({
  locale,
  logoAlt,
  logoUrl,
  links,
  secondary,
  cta,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const copy = COPY[locale];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-md text-[#1a211e] transition-colors hover:bg-[#f8f7f6]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? copy.close : copy.open}</span>
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex min-h-[72px] items-center justify-between px-6 py-4">
            <Link
              href={`/${locale}` as Route}
              className="flex items-center transition-opacity hover:opacity-80"
              aria-label={logoAlt}
              onClick={close}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={206}
                  height={36}
                  className="h-7 w-auto max-w-[148px]"
                />
              ) : (
                <Wordmark className="h-7 w-[148px]" />
              )}
            </Link>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-md text-[#1a211e] transition-colors hover:bg-[#f8f7f6]"
              onClick={close}
            >
              <span className="sr-only">{copy.close}</span>
              <CloseIcon />
            </button>
          </div>

          <nav
            id={panelId}
            aria-label={copy.navigation}
            className="flex flex-col gap-6 px-6 pb-8 pt-2"
          >
            {links.length > 0 && (
              <ul className="flex flex-col gap-2">
                {links.map((link) => {
                  const rowClass =
                    "inline-flex min-h-12 items-center gap-3 rounded-md px-2 text-lg font-medium tracking-[-0.04px] text-[#1a211e] transition-colors hover:text-[var(--color-brand-green)]";
                  const isMore = link.isMore ?? isMoreNav(link.label);
                  const isDailyLunch =
                    link.isDailyLunch ?? isDailyLunchNav(link.label, link.href);
                  return (
                    <li key={`${link.href}-${link.label}`}>
                      {isDailyLunch ? (
                        <CtaPopupButton
                          href={link.href}
                          label={link.label}
                          className={rowClass}
                          onOpen={close}
                        >
                          {link.label}
                        </CtaPopupButton>
                      ) : isMore ? (
                        <InPageSectionLink
                          locale={locale}
                          sectionId={HEADER_MORE_SECTION_ID}
                          className={rowClass}
                          onNavigate={close}
                        >
                          {link.label}
                        </InPageSectionLink>
                      ) : (
                        <Link
                          href={link.href as Route}
                          className={rowClass}
                          onClick={close}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {secondary && (
              <CtaPopupButton
                href={secondary.href}
                label={secondary.label}
                className="inline-flex min-h-12 items-center px-2 text-lg font-normal tracking-[-0.04px] text-[#1a211e] underline decoration-solid underline-offset-4 transition-colors hover:text-[var(--color-brand-green)]"
                onOpen={close}
              >
                {secondary.label}
              </CtaPopupButton>
            )}

            {cta && (
              <CtaPopupButton
                href={cta.href}
                label={cta.label}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[rgba(0,38,22,0.9)] px-6 text-lg font-medium tracking-[-0.04px] text-[#fbfefc] transition-colors hover:bg-[var(--color-brand-ink)]"
                onOpen={close}
              >
                {cta.label}
              </CtaPopupButton>
            )}

            <LocaleToggle currentLocale={locale} />
          </nav>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}
