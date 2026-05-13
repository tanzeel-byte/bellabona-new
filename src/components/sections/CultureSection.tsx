import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { FIGMA_IMAGES } from "@/lib/figma/assets";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import { sanityImageUrl } from "@/lib/sanity-image";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["cultureSection"]>;
  locale: Locale;
};

export function CultureSection({ section, locale }: Props) {
  const heading = pickLocale(section.heading, locale);
  const stats =
    section.stats
      ?.map((stat) => ({
        value: pickLocale(stat.value, locale),
        title: pickLocale(stat.title, locale),
        body: pickLocale(stat.body, locale),
      }))
      .filter((stat) => stat.value || stat.title || stat.body) ?? [];
  const timeline =
    section.timeline
      ?.map((item) => ({
        title: pickLocale(item.title, locale),
        body: pickLocale(item.body, locale),
      }))
      .filter((item) => item.title || item.body) ?? [];

  const imageSrc =
    sanityImageUrl(section.image, 1400) ?? FIGMA_IMAGES.cultureSpotlight;
  const imageAlt =
    pickLocale(section.image?.alt, locale) ?? heading ?? "Team enjoying lunch";

  if (!heading && stats.length === 0 && timeline.length === 0) return null;

  return (
    <section aria-labelledby="culture-heading" className="bg-white py-5 md:px-10 lg:px-20">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10">
        {heading && (
          <h2
            id="culture-heading"
            className="reveal mx-auto max-w-[1018px] text-center text-[40px] font-semibold leading-[1.2] text-black sm:text-[52px] lg:text-[60px]"
          >
            {heading}
          </h2>
        )}

        {stats.length > 0 && (
          <dl className="reveal mt-16 grid grid-cols-1 gap-[30px] lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={`${stat.value ?? "culture-stat"}-${index}`}
                className="flex min-h-[426px] flex-col justify-between rounded-[16px] bg-[#024930] px-10 py-8 text-[#f9ffe9]"
              >
                <div>
                  {stat.value && (
                    <dt className="text-[64px] font-medium leading-[0.95] tracking-[-2.82px] lg:text-[94px]">
                      {stat.value}
                    </dt>
                  )}
                  {stat.title && (
                    <p className="mt-2 text-[24px] font-semibold leading-[1.5] lg:text-[30px]">
                      {stat.title}
                    </p>
                  )}
                </div>
                {stat.body && (
                  <dd className="max-w-[279px] text-[20px] leading-[1.5] text-[#f9ffe9] lg:text-[24px]">
                    {stat.body}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        )}

        {(timeline.length > 0 || imageSrc) && (
          <div className="reveal mt-16 grid grid-cols-1 gap-[30px] lg:grid-cols-2">
            <div className="relative min-h-[360px] overflow-hidden rounded-[16px] bg-[#f8f7f6]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {timeline.length > 0 && (
              <div className="flex flex-col justify-end rounded-[16px] bg-[#f8f7f6] px-10 py-14">
                <ul className="space-y-10">
                  {timeline.map((item, index) => (
                    <li key={`${item.title ?? "timeline"}-${index}`} className="flex gap-6">
                      <TimelineIcon />
                      <div>
                        {item.title && (
                          <p className="text-[24px] font-medium leading-[1.4] tracking-[0.288px] text-[#1d0505]">
                            {item.title}
                          </p>
                        )}
                        {item.body && (
                          <p className="mt-3 text-[20px] leading-[1.5] text-black">
                            {item.body}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

function TimelineIcon() {
  return (
    <svg
      className="h-8 w-8 shrink-0"
      viewBox="0 0 31.6496 31.6522"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect fill="#024930" height="31.6522" rx="15.8248" width="31.6496" />
      <path
        d={svgPaths.pb54ef40}
        stroke="#E6FFA9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.26087"
      />
    </svg>
  );
}
