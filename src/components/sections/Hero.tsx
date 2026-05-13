import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { PortableText } from "@portabletext/react";

import { AppStoreBadge, GoogleReviewsBadge } from "@/components/figma/AppStoreBadge";
import { Container } from "@/components/ui/Container";
import { FIGMA_IMAGES } from "@/lib/figma/assets";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { FoodLabel, Homepage } from "@/types/sanity";

type Props = {
  hero: NonNullable<Homepage["hero"]>;
  locale: Locale;
};

const LABEL_LAYOUT = [
  {
    className: "left-[6%] top-[44%] w-[62px] sm:w-[74px] xl:left-[34.03px] xl:top-[343px] xl:w-[97.629px]",
    reactionClassName: "left-[12%] top-[47%] xl:left-[82.03px] xl:top-[368px]",
  },
  {
    className: "left-1/2 top-[46%] w-[78px] -translate-x-1/2 sm:w-[88px] xl:left-[231.03px] xl:top-[352px] xl:w-[114.631px] xl:translate-x-0",
    reactionClassName: "left-[calc(50%+22px)] top-[49%] w-[32px] xl:left-[290.81px] xl:top-[377px] xl:w-[44.223px]",
  },
  {
    className: "right-[6%] top-[50%] w-[84px] sm:w-[96px] xl:left-[446.03px] xl:right-auto xl:top-[397px] xl:w-[115.629px]",
    reactionClassName: "right-[7%] top-[53%] xl:left-[509.03px] xl:right-auto xl:top-[422px]",
  },
] as const;

export function Hero({ hero, locale }: Props) {
  const headline = pickLocale(hero.headline, locale);
  const subheadline = pickLocale(hero.subheadline, locale);
  const imageAlt = pickLocale(hero.image?.alt, locale) ?? headline ?? "";

  return (
    <section aria-labelledby="hero-heading" className="bg-white">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10 xl:pb-20 xl:pt-10">
        <div className="grid grid-cols-1 items-center gap-[33.943px] xl:grid-cols-[623px_minmax(0,1fr)]">
          <div className="reveal relative flex shrink-0 flex-col justify-center overflow-clip rounded-[20px] bg-[#024930] px-6 py-8 sm:px-8 xl:h-[697px] xl:px-0 xl:py-0">
            <div className="flex flex-col items-start gap-10 xl:absolute xl:left-[calc(50%-1.01px)] xl:top-1/2 xl:h-[607px] xl:w-[531px] xl:max-w-[calc(100%-4rem)] xl:-translate-x-1/2 xl:-translate-y-1/2 xl:justify-between xl:gap-0">
              {headline && (
                <h1
                  id="hero-heading"
                  className="w-full text-[34px] font-medium leading-[1.1] tracking-[-1.1px] text-[#e6ffa9] sm:text-[40px] sm:tracking-[-1.2px] lg:min-w-full lg:w-min lg:text-[69.85px] lg:tracking-[-1.397px]"
                >
                  {headline}
                </h1>
              )}

              <div className="flex w-full flex-col items-start gap-4 lg:gap-8">
                {subheadline && (
                  <div className="w-full max-w-[512px] text-base leading-[1.4] text-[#e6ffa9] sm:text-[18px] lg:text-[20px]">
                    <PortableText value={subheadline} />
                  </div>
                )}
                {hero.primaryCta?.href && hero.primaryCta.label && (
                  <Link
                    href={hero.primaryCta.href as Route}
                    className="inline-flex h-10 items-center justify-center self-center rounded-[77.707px] bg-[#e6ffa9] px-5 text-base font-medium leading-none tracking-[0.216px] text-[#024930] transition-colors hover:bg-[var(--color-brand-accent-hover)] sm:h-11 sm:px-6 sm:text-[17px] lg:h-[47.37px] lg:self-start lg:px-6 lg:py-2.5 lg:text-lg"
                  >
                    {pickLocale(hero.primaryCta.label, locale)}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="reveal flex min-w-0 flex-1 flex-col gap-5 xl:relative xl:h-[697px] xl:gap-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] sm:aspect-[5/6] xl:absolute xl:inset-0 xl:aspect-auto">
              <div className="absolute left-1/2 top-[-6%] h-[112%] w-[104%] -translate-x-1/2 xl:top-[-10%] xl:h-[120%] xl:w-full">
                <Image
                  alt={imageAlt}
                  src={FIGMA_IMAGES.hero}
                  fill
                  priority
                  sizes="(min-width: 1280px) 50vw, 100vw"
                  className="pointer-events-none max-w-none object-cover"
                />
              </div>

              {hero.foodLabels && hero.foodLabels.length > 0 && (
                <FoodLabelOverlay labels={hero.foodLabels} locale={locale} />
              )}
            </div>

            {hero.appBadges && <AppBadgesRow badges={hero.appBadges} />}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FoodLabelOverlay({
  labels,
  locale,
}: {
  labels: FoodLabel[];
  locale: Locale;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-[34.03px] top-[343px] contents">
        {labels.slice(0, LABEL_LAYOUT.length).map((label, index) => {
          const name = pickLocale(label.name, locale);
          if (!name) return null;
          const layout = LABEL_LAYOUT[index];
          return (
            <div key={`${name}-${index}`}>
              <div
                className={`absolute flex flex-col items-start rounded-[33.931px] bg-white py-[3px] pl-[3px] pr-[5px] xl:py-[6.059px] xl:pl-[6.059px] xl:pr-2 ${layout.className}`}
              >
                <div className="flex w-full items-start gap-[2px] xl:gap-[5px]">
                  <FoodLabelIcon accent={label.accent ?? "red"} />
                  <p className="whitespace-nowrap text-[9px] font-medium leading-[1.2] text-black sm:text-[11px] xl:text-[14.542px]">
                    {name}
                  </p>
                </div>
              </div>
              {label.rating && (
                <div
                  className={`absolute flex h-[12px] items-center rounded-[8.02px] bg-white py-[1.5px] pl-[3px] pr-[2px] xl:h-[17px] xl:py-[2.713px] xl:pl-[5.897px] xl:pr-[4.177px] ${layout.reactionClassName}`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[-0.5px] rounded-[8.52px] border-[0.5px] border-solid border-[#e7e7e7]"
                  />
                  <p className="text-center text-[7px] font-semibold leading-[0.9] text-[#070c0f] xl:text-[10.405px]">
                    {label.ratingType === "heart" ? (
                      <span className="inline-flex items-center gap-[1px] xl:gap-[2.241px]">
                        <HeartReactionIcon className="size-[6px] xl:h-[9.419px] xl:w-[9.534px]" />
                        {label.rating}
                      </span>
                    ) : (
                      `⭐ ${label.rating}`
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FoodLabelIcon({ accent }: { accent: "red" | "amber" | "green" }) {
  if (accent === "amber") {
    return (
      <div className="flex size-[10px] items-center justify-center rounded-[101.977px] bg-[#fcf5db] p-[1.75px] xl:size-[17.571px] xl:p-[3.295px]">
        <svg viewBox="0 0 12.3103 12.3078" className="size-[7px] xl:h-[12.308px] xl:w-[12.31px]" aria-hidden="true">
          <path d={svgPaths.p10692a70} fill="#DA9B34" />
          <path d={svgPaths.p13e2de00} fill="#DA9B34" />
          <path d={svgPaths.p2b364f00} fill="#DA9B34" />
        </svg>
      </div>
    );
  }

  if (accent === "green") {
    return (
      <svg viewBox="0 0 17.57 17.57" className="size-[10px] xl:size-[17.57px]" aria-hidden="true">
        <rect fill="#E1FAE7" height="17.57" rx="8.785" width="17.57" />
        <path d={svgPaths.p1b042500} fill="#48BC69" />
      </svg>
    );
  }

  return (
    <div className="flex size-[10px] items-center justify-center rounded-[101.969px] bg-[#fdefee] p-[1.75px] xl:size-[17.57px] xl:p-[3.294px]">
      <svg viewBox="0 0 12.9509 11.3067" className="h-[6.4px] w-[7.4px] xl:h-[10.668px] xl:w-[12.312px]" aria-hidden="true">
        <path
          clipRule="evenodd"
          d={svgPaths.p1aadab00}
          fillRule="evenodd"
          stroke="#E96A60"
          strokeLinecap="square"
          strokeWidth="0.639014"
        />
      </svg>
    </div>
  );
}

function HeartReactionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 9.53378 9.41892" className={className} aria-hidden="true">
      <path d={svgPaths.p9286d40} fill="#E96A60" />
    </svg>
  );
}

function AppBadgesRow({
  badges,
}: {
  badges: NonNullable<Homepage["hero"]>["appBadges"];
}) {
  if (!badges) return null;
  const { playStoreUrl, appStoreUrl, googleReviewUrl } = badges;
  const hasAny = !!playStoreUrl || !!appStoreUrl || !!googleReviewUrl;
  if (!hasAny) return null;

  return (
    <div className="flex w-full items-center justify-center gap-[6px] sm:gap-2 xl:absolute xl:left-[calc(50%-0.33px)] xl:top-[612px] xl:w-auto xl:-translate-x-1/2 xl:gap-[16.659px] xl:px-4">
      {playStoreUrl && (
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 shrink-0 items-center justify-center transition-transform hover:scale-[1.02] sm:h-9 md:max-w-none xl:h-[59.971px] xl:w-[202.403px]"
        >
          <Image
            alt="Get it on Google Play"
            src={FIGMA_IMAGES.googlePlayBadge}
            width={202}
            height={60}
            className="pointer-events-none block h-full w-auto max-w-[96px] object-contain sm:max-w-[110px] md:max-w-[118px] xl:h-full xl:w-full xl:max-w-none xl:object-contain"
          />
        </a>
      )}
      {appStoreUrl && (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 shrink-0 items-center justify-center transition-transform hover:scale-[1.02] sm:h-9 xl:h-[59.971px] xl:w-[179.41px]"
        >
          <AppStoreBadge className="h-full w-auto max-w-[86px] aspect-[179.914/59.9714] sm:max-w-[98px] md:max-w-[106px] xl:h-[59.971px] xl:w-[179.41px] xl:max-w-none" />
        </a>
      )}
      {googleReviewUrl && (
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 shrink-0 items-center justify-center rounded-[8.096px] bg-white px-1.5 py-1 transition-transform hover:scale-[1.02] sm:h-9 sm:px-2 xl:h-[59.971px] xl:w-[166.648px] xl:px-[14.243px] xl:py-[9.745px]"
        >
          <GoogleReviewsBadge className="h-[22px] w-auto max-w-[74px] sm:h-6 sm:max-w-[84px] md:max-w-[92px] xl:h-[40.481px] xl:w-[138.162px] xl:max-w-none" />
        </a>
      )}
    </div>
  );
}
