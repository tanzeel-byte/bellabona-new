import { SanityImage as Image } from "@/components/ui/SanityImage";
import Link from "next/link";
import type { Route } from "next";

import { Wordmark } from "@/components/brand/Wordmark";
import { MobileNavDrawer } from "@/components/sections/MobileNavDrawer";
import { Container } from "@/components/ui/Container";
import { CtaPopupButton } from "@/components/ui/CtaPopup";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import svgPaths from "@/lib/figma/svg-paths";
import { type Locale, pickLocale } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/types/sanity";

type Props = {
  settings: SiteSettings | null;
  locale: Locale;
};

export function Header({ settings, locale }: Props) {
  const header = settings?.header;
  const logoUrl = header?.logo?.asset
    ? urlFor(header.logo).width(206).url()
    : null;
  const logoAlt = pickLocale(header?.logo?.alt, locale) ?? "Bella&Bona";

  const secondary = header?.secondaryLink;
  const secondaryLabel = pickLocale(secondary?.label, locale);
  const ctaLabel = header?.cta?.label ? pickLocale(header.cta.label, locale) : null;

  const mobileLinks =
    header?.links
      ?.map((link) => {
        const label = pickLocale(link.label, locale);
        if (!label || !link.href) return null;
        return {
          label,
          href: link.href,
          isMore: /more|mehr/i.test(label),
        };
      })
      .filter((link): link is NonNullable<typeof link> => Boolean(link)) ?? [];

  const mobileSecondary =
    secondary?.href && secondaryLabel
      ? { label: secondaryLabel, href: secondary.href }
      : undefined;

  const mobileCta =
    header?.cta?.href && ctaLabel
      ? { label: ctaLabel, href: header.cta.href }
      : undefined;

  return (
    <header className="sticky top-0 z-40 bg-white">
      <Container className="max-w-[1440px]">
        <nav
          aria-label="Primary"
          className="flex min-h-[72px] items-center gap-3 py-4 lg:min-h-[88px] lg:gap-10 lg:py-6"
        >
          <Link
            href={`/${locale}` as Route}
            className="flex shrink-0 items-center transition-opacity hover:opacity-80"
            aria-label={logoAlt}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={206}
                height={36}
                priority
                className="h-7 w-auto max-w-[148px] sm:h-9 sm:max-w-none"
              />
            ) : (
              <Wordmark className="h-7 w-[148px] sm:h-9 sm:w-[206px]" />
            )}
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-between gap-10 lg:flex">
            {header?.links && header.links.length > 0 && (
              <ul className="flex items-center gap-3">
                {header.links.map((link, idx) => {
                  const label = pickLocale(link.label, locale);
                  if (!label || !link.href) return null;
                  const isMore = /more|mehr/i.test(label);
                  return (
                    <li key={`${link.href}-${idx}`}>
                      <Link
                        href={link.href as Route}
                        className="inline-flex h-12 items-center gap-3 rounded-md px-4 text-lg font-medium tracking-[-0.04px] text-[#1a211e] transition-colors hover:text-[var(--color-brand-green)]"
                      >
                        {label}
                        {isMore && <ChevronDownIcon />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center gap-6">
              {secondary?.href && secondaryLabel && (
                <CtaPopupButton
                  href={secondary.href}
                  label={secondaryLabel}
                  className="inline-flex h-12 items-center px-6 text-lg font-normal tracking-[-0.04px] text-[#1a211e] underline decoration-solid underline-offset-4 transition-colors hover:text-[var(--color-brand-green)]"
                >
                  {secondaryLabel}
                </CtaPopupButton>
              )}

              {header?.cta?.href && ctaLabel && (
                <CtaPopupButton
                  href={header.cta.href}
                  label={ctaLabel}
                  className="inline-flex h-12 items-center rounded-full bg-[rgba(0,38,22,0.9)] px-6 text-lg font-medium tracking-[-0.04px] text-[#fbfefc] transition-colors hover:bg-[var(--color-brand-ink)]"
                >
                  {ctaLabel}
                </CtaPopupButton>
              )}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-4">
            <div className="hidden lg:block">
              <LocaleToggle currentLocale={locale} />
            </div>

            <div className="lg:hidden">
              <MobileNavDrawer
                locale={locale}
                logoAlt={logoAlt}
                logoUrl={logoUrl}
                links={mobileLinks}
                secondary={mobileSecondary}
                cta={mobileCta}
              />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

function ChevronDownIcon() {
  return (
    <span className="relative inline-block size-[18px] shrink-0" aria-hidden="true">
      <span className="absolute inset-[40%_20%_28.33%_20%]">
        <svg
          viewBox="0 0 10.8 5.70003"
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p32a02600}
            fill="#1A211E"
            fillRule="evenodd"
          />
        </svg>
      </span>
    </span>
  );
}
