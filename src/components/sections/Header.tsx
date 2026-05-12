import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/Container";
import { LOCALES, type Locale, pickLocale } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/types/sanity";

type Props = {
  settings: SiteSettings | null;
  locale: Locale;
};

/**
 * Site header — implementation of the Figma "Banner nav bar Pink" frame.
 *
 * Pixel anchors (1440 viewport from the source SVG):
 *   - 88px tall
 *   - White background, no border, sits on the page (not over the hero)
 *   - BELLABONA wordmark in #024930 (brand-forest)
 *   - Nav links: "Daily lunch", "More ▾" (dropdown trigger; static for v1)
 *   - Right cluster: underlined "Download menu" + dark-green pill CTA + locale toggle
 *
 * Server Component — zero client JS. Locale toggle is just two anchor tags.
 * A real `More` dropdown is a small client island that comes in phase 2.
 */
export function Header({ settings, locale }: Props) {
  const header = settings?.header;
  const logoUrl = header?.logo?.asset
    ? urlFor(header.logo).width(160).url()
    : null;
  const logoAlt = pickLocale(header?.logo?.alt, locale) ?? "Bella&Bona";

  const secondary = header?.secondaryLink;
  const secondaryLabel = pickLocale(secondary?.label, locale);

  return (
    <header className="relative z-40 bg-white">
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-[88px] items-center justify-between gap-8"
        >
          {/* Left cluster: wordmark + primary nav */}
          <div className="flex items-center gap-12">
            <Link
              href={`/${locale}` as Route}
              className="flex items-center transition-opacity hover:opacity-80"
              aria-label={logoAlt}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={180}
                  height={40}
                  priority
                  className="h-9 w-auto"
                />
              ) : (
                <span
                  className="text-3xl tracking-[0.02em] text-[var(--color-brand-forest)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  BELLA&amp;BONA
                </span>
              )}
            </Link>

            {header?.links && header.links.length > 0 && (
              <ul className="hidden items-center gap-8 lg:flex">
                {header.links.map((link, idx) => {
                  const label = pickLocale(link.label, locale);
                  if (!label || !link.href) return null;
                  // Treat any link whose label includes "more" as a dropdown
                  // trigger and append a chevron. Real dropdown menu lands in
                  // phase 2 with proper keyboard semantics.
                  const isMore = /more|mehr/i.test(label);
                  return (
                    <li key={`${link.href}-${idx}`}>
                      <Link
                        href={link.href as Route}
                        className="inline-flex items-center gap-1 text-base font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-brand-green)]"
                      >
                        {label}
                        {isMore && <ChevronDownIcon className="h-4 w-4" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right cluster: secondary link + CTA pill + locale toggle */}
          <div className="flex items-center gap-6">
            {secondary?.href && secondaryLabel && (
              <Link
                href={secondary.href as Route}
                className="hidden text-base font-medium text-[var(--color-ink)] underline underline-offset-[5px] decoration-1 transition-colors hover:text-[var(--color-brand-green)] md:inline-block"
              >
                {secondaryLabel}
              </Link>
            )}

            {header?.cta?.href && header.cta.label && (
              <Link
                href={header.cta.href as Route}
                className="inline-flex h-[48px] items-center rounded-full bg-[var(--color-brand-forest)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--color-brand-ink)]"
              >
                {pickLocale(header.cta.label, locale)}
              </Link>
            )}

            <LocaleToggle currentLocale={locale} />
          </div>
        </nav>
      </Container>
    </header>
  );
}

function LocaleToggle({ currentLocale }: { currentLocale: Locale }) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--color-line)] p-1"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => {
        const active = l === currentLocale;
        return (
          <Link
            key={l}
            href={`/${l}` as Route}
            aria-current={active ? "page" : undefined}
            className={`flex h-8 min-w-[36px] items-center justify-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              active
                ? "bg-[var(--color-tan)] text-[var(--color-ink)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
