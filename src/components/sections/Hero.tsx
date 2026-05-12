import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { PortableText } from "@portabletext/react";

import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import { lqipFor, urlFor } from "@/sanity/lib/image";
import type { FoodLabel, Homepage } from "@/types/sanity";

type Props = {
  hero: NonNullable<Homepage["hero"]>;
  locale: Locale;
};

/**
 * Hero section — implementation of the Figma "Frame 1312321274" frame.
 *
 * Pixel anchors (from the source SVG at 1440 viewport):
 *   - Two-column 50/50 grid; left=card, right=image
 *   - Card: bg #024930, 20px radius, ~623×697
 *   - Headline + subheadline + CTA stack inside the card (headline up top,
 *     subheadline + CTA at the bottom — `justify-between` accomplishes this)
 *   - Image: 20px radius, same height as card
 *   - Food labels overlay the image at three positions
 *   - App badges row sits at the bottom of the image
 *
 * Performance contract:
 *   - Server Component. No useEffect, no client fetching.
 *   - Hero image: next/image with `priority`, `fetchPriority="high"`, explicit
 *     dimensions, responsive `sizes`, Sanity LQIP blur placeholder.
 *   - Lime entrance animation via CSS-only `.reveal` (prefers-reduced-motion
 *     respected).
 */
export function Hero({ hero, locale }: Props) {
  const eyebrow = pickLocale(hero.eyebrow, locale);
  const headline = pickLocale(hero.headline, locale);
  const subheadline = pickLocale(hero.subheadline, locale);

  const imageSrc = hero.image?.asset
    ? urlFor(hero.image).width(1400).url()
    : null;
  const imageAlt = pickLocale(hero.image?.alt, locale) ?? headline ?? "";
  const lqip = lqipFor(hero.image);
  const imgWidth = hero.image?.asset?.metadata?.dimensions?.width ?? 1400;
  const imgHeight = hero.image?.asset?.metadata?.dimensions?.height ?? 1400;

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-white pt-6 pb-12 md:pt-10 md:pb-20"
    >
      <Container>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
          {/* ============ LEFT CARD ============ */}
          <div className="reveal flex aspect-[623/697] flex-col justify-between overflow-hidden rounded-[20px] bg-[var(--color-brand-forest)] p-8 sm:p-12 lg:aspect-auto lg:p-14">
            <div>
              {eyebrow && (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-accent)]/80">
                  {eyebrow}
                </p>
              )}
              {headline && (
                <h1
                  id="hero-heading"
                  className="text-[var(--color-brand-accent)] text-[44px] leading-[1.05] tracking-[-0.01em] sm:text-[56px] lg:text-[72px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {headline}
                </h1>
              )}
            </div>

            <div className="mt-12">
              {subheadline && (
                <div className="text-base leading-[1.6] text-[var(--color-brand-accent)]/85 sm:text-lg">
                  <PortableText value={subheadline} />
                </div>
              )}
              {hero.primaryCta?.href && hero.primaryCta.label && (
                <Link
                  href={hero.primaryCta.href as Route}
                  className="mt-6 inline-flex h-[48px] items-center justify-center rounded-full bg-[var(--color-brand-accent)] px-6 text-base font-medium text-[var(--color-brand-ink)] transition-colors hover:bg-[var(--color-brand-accent-hover)]"
                >
                  {pickLocale(hero.primaryCta.label, locale)}
                </Link>
              )}
            </div>
          </div>

          {/* ============ RIGHT IMAGE WITH OVERLAYS ============ */}
          {imageSrc && (
            <div className="reveal relative aspect-[623/697] overflow-hidden rounded-[20px] bg-[var(--color-tan)] lg:aspect-auto">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imgWidth}
                height={imgHeight}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder={lqip ? "blur" : "empty"}
                blurDataURL={lqip}
                className="h-full w-full object-cover"
              />

              {/* Food labels overlaid on the image */}
              {hero.foodLabels && hero.foodLabels.length > 0 && (
                <FoodLabelOverlay labels={hero.foodLabels} locale={locale} />
              )}

              {/* App store + Google review badges */}
              {hero.appBadges && (
                <AppBadgesRow
                  badges={hero.appBadges}
                  appStoreLocale={locale}
                />
              )}
            </div>
          )}
        </div>

      </Container>
    </section>
  );
}

// --------------------------------------------------------------------------
// Food labels — small pills overlaid on the image at varied positions
// --------------------------------------------------------------------------

/** Pre-set positions so editors can add up to 6 labels without specifying
 * coordinates; they cycle through visually-balanced anchors. */
const LABEL_POSITIONS = [
  "left-[6%] top-[42%]",
  "left-[40%] top-[48%]",
  "right-[6%] top-[55%]",
  "left-[12%] top-[62%]",
  "right-[14%] top-[40%]",
  "left-[34%] top-[34%]",
];

function FoodLabelOverlay({
  labels,
  locale,
}: {
  labels: FoodLabel[];
  locale: Locale;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {labels.slice(0, LABEL_POSITIONS.length).map((label, idx) => {
        const name = pickLocale(label.name, locale);
        if (!name) return null;
        const pos = LABEL_POSITIONS[idx];
        return (
          <div
            key={`${name}-${idx}`}
            className={`absolute ${pos} flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-3 text-xs font-medium shadow-md shadow-black/10 sm:text-sm`}
          >
            <FoodLabelIcon accent={label.accent ?? "red"} />
            <span className="text-[var(--color-ink)]">{name}</span>
            {label.rating && (
              <span className="flex items-center gap-1 text-[var(--color-ink-muted)]">
                <RatingIcon
                  type={label.ratingType ?? "star"}
                  className="h-3.5 w-3.5"
                />
                {label.rating}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FoodLabelIcon({ accent }: { accent: "red" | "amber" | "green" }) {
  const fill =
    accent === "red"
      ? "bg-[#fdefee] text-[#c2410c]"
      : accent === "amber"
      ? "bg-[#fcf5db] text-[#a16207]"
      : "bg-[#e1fae7] text-[#15803d]";
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${fill}`}
    >
      <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </span>
  );
}

function RatingIcon({
  type,
  className,
}: {
  type: "star" | "heart" | "leaf";
  className?: string;
}) {
  if (type === "heart") {
    return (
      <svg viewBox="0 0 24 24" fill="#e11d48" className={className}>
        <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
      </svg>
    );
  }
  if (type === "leaf") {
    return (
      <svg viewBox="0 0 24 24" fill="#15803d" className={className}>
        <path d="M17 8C8 10 5 16 5 21h2c0-4 3-8 10-9l2-1c1-1 1-3 0-4-1-1-2-1-2 1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="#f59e0b" className={className}>
      <path d="M12 2 14.6 8.6 22 9.4l-5.6 5 1.8 7.6L12 18l-6.2 4 1.8-7.6L2 9.4l7.4-.8L12 2z" />
    </svg>
  );
}

// --------------------------------------------------------------------------
// App store + Google review badges
// --------------------------------------------------------------------------

function AppBadgesRow({
  badges,
  appStoreLocale,
}: {
  badges: NonNullable<Homepage["hero"]>["appBadges"];
  appStoreLocale: Locale;
}) {
  if (!badges) return null;
  const { playStoreUrl, appStoreUrl, googleReviewUrl, googleRatingValue, googleRatingScale } =
    badges;
  const hasAny =
    !!playStoreUrl || !!appStoreUrl || !!(googleReviewUrl || googleRatingValue);
  if (!hasAny) return null;

  const appStoreCopy =
    appStoreLocale === "de" ? "Laden im" : "Download on the";

  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 sm:bottom-6 sm:left-6 sm:right-6 sm:gap-3">
      {playStoreUrl && (
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center gap-3 rounded-md bg-black px-3 py-2 text-white shadow-md transition-transform hover:scale-[1.02] sm:flex-none"
        >
          <PlayStoreIcon className="h-7 w-7 shrink-0" />
          <span className="leading-tight">
            <span className="block text-[10px] uppercase tracking-wide">
              Get it on
            </span>
            <span className="block text-base font-semibold leading-tight">
              Google Play
            </span>
          </span>
        </a>
      )}
      {appStoreUrl && (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center gap-3 rounded-md bg-black px-3 py-2 text-white shadow-md transition-transform hover:scale-[1.02] sm:flex-none"
        >
          <AppleIcon className="h-7 w-7 shrink-0" />
          <span className="leading-tight">
            <span className="block text-[10px] uppercase tracking-wide">
              {appStoreCopy}
            </span>
            <span className="block text-base font-semibold leading-tight">
              App Store
            </span>
          </span>
        </a>
      )}
      {(googleRatingValue || googleReviewUrl) && (
        <a
          href={googleReviewUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-2 shadow-md transition-transform hover:scale-[1.02] sm:flex-none"
        >
          <GoogleGIcon className="h-7 w-7 shrink-0" />
          <span className="leading-tight">
            <span className="flex items-center gap-0.5 text-[#f59e0b]">
              <RatingIcon type="star" className="h-3 w-3" />
              <RatingIcon type="star" className="h-3 w-3" />
              <RatingIcon type="star" className="h-3 w-3" />
              <RatingIcon type="star" className="h-3 w-3" />
              <RatingIcon type="star" className="h-3 w-3" />
            </span>
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              {googleRatingValue ?? "4.7"}
              <span className="text-xs font-normal text-[var(--color-ink-muted)]">
                {googleRatingScale ?? "/5"}
              </span>
            </span>
          </span>
        </a>
      )}
    </div>
  );
}

function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3.6 2.3a1 1 0 0 0-.6.9v17.5a1 1 0 0 0 .6.9l9.86-9.66z" fill="#34a853" />
      <path d="M14.46 11.95 3.6 2.3l9.86 9.66z" fill="#4285f4" />
      <path d="M5.04 21.6l9.42-5.43-3.06-3z" fill="#ea4335" />
      <path d="M19.2 13.22 21.86 11.7a1 1 0 0 0 0-1.74L19.2 8.4l-3.4 3.32z" fill="#fbbc04" />
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M17.05 12.04c-.03-3.13 2.56-4.63 2.67-4.7-1.46-2.13-3.73-2.42-4.53-2.45-1.93-.2-3.77 1.13-4.75 1.13-1 0-2.5-1.1-4.1-1.07-2.11.03-4.06 1.23-5.15 3.1-2.2 3.8-.56 9.42 1.58 12.5 1.05 1.5 2.3 3.2 3.93 3.14 1.58-.07 2.18-1.02 4.1-1.02 1.9 0 2.45 1.02 4.13 1 1.7-.03 2.78-1.53 3.82-3.05a13.6 13.6 0 0 0 1.74-3.55 5.78 5.78 0 0 1-3.44-5.03zm-3.15-9.24c.86-1.05 1.45-2.5 1.3-3.95-1.25.06-2.77.83-3.66 1.86-.8.92-1.5 2.4-1.32 3.82 1.4.1 2.83-.71 3.68-1.73z" />
    </svg>
  );
}

function GoogleGIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M22 12.06c0-.72-.06-1.42-.18-2.1H12v3.97h5.62c-.24 1.27-.96 2.34-2.05 3.05v2.52h3.32C20.87 17.63 22 15.07 22 12.06z" fill="#4285f4" />
      <path d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.32-2.52c-.92.6-2.1.96-3.3.96-2.54 0-4.7-1.7-5.47-4H3.1v2.52A10 10 0 0 0 12 22z" fill="#34a853" />
      <path d="M6.53 14.02c-.2-.6-.3-1.24-.3-1.9s.1-1.3.3-1.9V7.7H3.1A10 10 0 0 0 2 12c0 1.62.4 3.16 1.1 4.52L6.53 14z" fill="#fbbc04" />
      <path d="M12 6.16c1.46 0 2.77.5 3.8 1.5l2.85-2.85A10 10 0 0 0 12 2 10 10 0 0 0 3.1 7.48L6.53 10c.76-2.3 2.93-3.84 5.47-3.84z" fill="#ea4335" />
    </svg>
  );
}
