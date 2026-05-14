"use client";

import { useEffect, useState } from "react";

import { SanityImage as Image } from "@/components/ui/SanityImage";

import { FIGMA_IMAGES } from "@/lib/figma/assets";
import { sanityImageUrl } from "@/lib/sanity-image";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage, SanityImage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["testimonialsSection"]>;
  locale: Locale;
};

type TestimonialSlideData = {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  photo?: SanityImage;
  photoAlt: string;
};

export function TestimonialsSection({ section, locale }: Props) {
  const heading = pickLocale(section.heading, locale);
  const quote = pickLocale(section.quote, locale);
  const authorName = pickLocale(section.authorName, locale);
  const authorRole = pickLocale(section.authorRole, locale);
  const carouselItems =
    section.items
      ?.map((item) => ({
        quote: pickLocale(item.quote, locale),
        authorName: pickLocale(item.authorName, locale),
        authorRole: pickLocale(item.authorRole, locale),
        photo: item.photo,
        photoAlt: pickLocale(item.photo?.alt, locale) ?? "",
      }))
      .filter((item) => item.quote || item.photo) ?? [];

  const leftSrc =
    sanityImageUrl(section.leftPhoto, 900) ?? FIGMA_IMAGES.testimonialLeft;
  const rightSrc =
    sanityImageUrl(section.rightPhoto, 900) ?? FIGMA_IMAGES.testimonialRight;
  const leftAlt = pickLocale(section.leftPhoto?.alt, locale) ?? "";
  const rightAlt = pickLocale(section.rightPhoto?.alt, locale) ?? "";
  const fallbackItems: TestimonialSlideData[] =
    quote || section.leftPhoto || section.rightPhoto
      ? [
          {
            quote,
            authorName,
            authorRole,
            photo: section.rightPhoto,
            photoAlt: rightAlt,
          },
        ]
      : [];
  const baseItems: TestimonialSlideData[] =
    carouselItems.length > 0 ? carouselItems : fallbackItems;
  const loopItems =
    baseItems.length === 1
      ? [baseItems[0], baseItems[0], baseItems[0]]
      : baseItems;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (loopItems.length <= 1) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % loopItems.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [loopItems.length]);

  if (!heading && baseItems.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="overflow-x-clip bg-[#e6ffa9] py-20"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-12 px-5 sm:gap-16 sm:px-10 lg:px-20">
        {heading && (
          <div className="relative w-full shrink-0">
            <div className="flex size-full flex-col items-center">
              <div className="relative flex size-full flex-col items-center px-5">
                <h2
                  id="testimonials-heading"
                  className="reveal w-full max-w-[1018px] text-center text-[40px] font-semibold leading-[1.2] text-black sm:text-[52px] lg:text-[60px]"
                >
                  {heading}
                </h2>
              </div>
            </div>
          </div>
        )}

        {baseItems.length > 0 && (
          <div className="testimonial-carousel-viewport reveal relative w-[calc(100%+2.5rem)] -translate-x-5 overflow-hidden py-1 sm:w-[calc(100%+5rem)] sm:-translate-x-10 lg:w-[calc(100%+10rem)] lg:-translate-x-20">
            <div
              className="flex w-full items-stretch transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {loopItems.map((item, index) => (
                <TestimonialSlide
                  key={`${item.authorName ?? item.quote ?? "slide"}-${index}`}
                  item={item}
                  leftSrc={leftSrc}
                  leftAlt={leftAlt}
                  rightSrc={rightSrc}
                  rightAlt={rightAlt}
                  ariaHidden={index !== activeIndex}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialSlide({
  item,
  leftSrc,
  leftAlt,
  rightSrc,
  rightAlt,
  ariaHidden,
}: {
  item: TestimonialSlideData;
  leftSrc: string;
  leftAlt: string;
  rightSrc: string;
  rightAlt: string;
  ariaHidden?: boolean;
}) {
  const testimonialSrc = sanityImageUrl(item.photo, 900) ?? rightSrc;
  const testimonialAlt = item.photoAlt || rightAlt;

  return (
    <article
      aria-hidden={ariaHidden}
      className="flex w-full shrink-0"
    >
      <div className="grid h-[22rem] w-full grid-cols-[minmax(5.5rem,0.72fr)_minmax(14rem,1.8fr)_minmax(5.5rem,0.72fr)] items-center gap-4 overflow-hidden bg-[#e6ffa9] sm:h-[25rem] sm:grid-cols-[minmax(11rem,0.8fr)_minmax(27rem,2.1fr)_minmax(11rem,0.8fr)] sm:gap-7 lg:h-[26.25rem] lg:grid-cols-[minmax(16rem,0.85fr)_minmax(36rem,2.2fr)_minmax(16rem,0.85fr)] lg:gap-10">
        <div className="relative h-[67%] w-full overflow-hidden rounded-r-[18px] bg-[#0a1f18] shadow-[0_18px_40px_-26px_rgba(0,38,22,0.55)] sm:h-[70%] sm:rounded-r-[20px] lg:h-[71%]">
          <Image
            alt={leftAlt}
            src={leftSrc}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 24vw, 110px"
            className="pointer-events-none object-cover"
          />
        </div>

        <figure className="relative z-10 flex h-full min-w-0 flex-col items-center justify-center rounded-[22px] bg-[#024930] px-6 py-9 text-center text-white shadow-[0_24px_52px_-28px_rgba(0,38,22,0.72)] sm:rounded-[24px] sm:px-12 sm:py-12 lg:rounded-[26px] lg:px-16">
          {item.quote && (
            <blockquote className="mx-auto max-w-[36rem] text-[clamp(1.05rem,2.8vw,1.75rem)] font-normal leading-[1.06] tracking-[-0.035em] sm:leading-[1.08] lg:text-[2rem]">
              {item.quote}
            </blockquote>
          )}
          {(item.authorName || item.authorRole) && (
            <figcaption className="mt-12 shrink-0 text-center sm:mt-16 lg:mt-20">
              <p className="text-[0.8rem] leading-snug text-white/90 sm:text-[0.9375rem]">
                {item.authorName && (
                  <span className="block font-semibold tracking-tight text-white">{item.authorName}</span>
                )}
                {item.authorRole && (
                  <span className="mt-1 block text-white/80">{item.authorRole}</span>
                )}
              </p>
            </figcaption>
          )}
        </figure>

        <div className="relative h-[67%] w-full overflow-hidden rounded-l-[18px] bg-[#0a1f18] shadow-[0_18px_40px_-26px_rgba(0,38,22,0.55)] sm:h-[70%] sm:rounded-l-[20px] lg:h-[71%]">
          <Image
            alt={testimonialAlt}
            src={testimonialSrc}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 24vw, 110px"
            className="pointer-events-none object-cover"
          />
        </div>
      </div>
    </article>
  );
}
