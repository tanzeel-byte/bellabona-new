import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/Container";
import { FIGMA_IMAGES } from "@/lib/figma/assets";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["supportSection"]>;
  locale: Locale;
};

export function SupportSection({ section, locale }: Props) {
  const heading = pickLocale(section.heading, locale);
  const body = pickLocale(section.body, locale);
  const ctaLabel = pickLocale(section.cta?.label, locale);
  const ctaHref = section.cta?.href;

  if (!heading && !body && !(ctaLabel && ctaHref)) return null;

  return (
    <section aria-labelledby="support-heading" className="bg-white pb-20">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10 lg:px-10">
        <div className="reveal rounded-[20px] bg-[#f9ffe9]">
          <div className="flex flex-col gap-12 p-8 lg:flex-row lg:items-stretch lg:gap-12 lg:px-12 lg:py-8">
            <div className="flex flex-1 flex-col items-start gap-12">
              <div className="flex w-full flex-col gap-6 text-[#024930]">
                {heading && (
                  <h2
                    id="support-heading"
                    className="text-[40px] font-bold leading-none sm:text-[48px] lg:text-[54px]"
                  >
                    {heading}
                  </h2>
                )}
                {body && (
                  <p className="text-2xl font-medium leading-[1.5] lg:text-[28px]">{body}</p>
                )}
              </div>
              {ctaLabel && ctaHref && (
                <Link
                  href={ctaHref as Route}
                  className="inline-flex h-[54px] items-center justify-center rounded-[77.707px] bg-[#024930] px-8 py-2.5 text-base font-semibold tracking-[0.192px] text-[#f9ffe9] transition-colors hover:bg-[#013724]"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>

            <div className="relative w-full max-w-[449px] shrink-0 self-stretch overflow-clip rounded-2xl bg-[#fff0ed] lg:min-h-[280px]">
              <div className="absolute left-[-41px] top-[-67.02px] h-[654px] w-[523px]">
                <Image
                  alt=""
                  src={FIGMA_IMAGES.supportEmail}
                  width={1024}
                  height={1024}
                  className="pointer-events-none absolute left-[-38.79%] top-[-2.05%] h-[92.85%] w-[174.06%] max-w-none object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
