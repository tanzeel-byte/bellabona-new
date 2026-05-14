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
  fallbackSrc: string;
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
            fallbackSrc: rightSrc,
          },
        ]
      : [];
  const baseItems: TestimonialSlideData[] =
    carouselItems.length > 0
      ? carouselItems.map((item, i) => ({
          ...item,
          fallbackSrc: i % 2 === 0 ? rightSrc : leftSrc,
          photoAlt: item.photoAlt || (i % 2 === 0 ? rightAlt : leftAlt),
        }))
      : fallbackItems;
  const trackItems = [...baseItems, ...baseItems];

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
          <div className="testimonial-carousel-viewport reveal relative w-full overflow-hidden py-2">
            <div className="testimonial-carousel-track flex w-max items-stretch gap-5 sm:gap-7 lg:gap-10">
              {trackItems.map((item, index) => (
                <TestimonialSlide
                  key={`${item.authorName ?? item.quote ?? "slide"}-${index}`}
                  item={item}
                  ariaHidden={index >= baseItems.length}
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
  ariaHidden,
}: {
  item: TestimonialSlideData;
  ariaHidden?: boolean;
}) {
  const src = sanityImageUrl(item.photo, 1000) ?? item.fallbackSrc;

  return (
    <article
      aria-hidden={ariaHidden}
      className="flex h-[min(22rem,calc(100vw-2.5rem))] w-[min(calc(100vw-2rem),56rem)] shrink-0 overflow-hidden rounded-[22px] shadow-[0_22px_50px_-18px_rgba(2,73,48,0.35)] ring-1 ring-[#024930]/15 sm:h-[min(24rem,calc(100vw-3rem))] sm:rounded-[26px] lg:h-[26.5rem] lg:w-[58rem] lg:rounded-[28px]"
    >
      <div className="relative w-[38%] min-w-[9.5rem] shrink-0 bg-[#0a1f18] sm:min-w-[11rem] lg:min-w-[13.5rem]">
        <Image
          alt={item.photoAlt}
          src={src}
          fill
          sizes="(min-width: 1024px) 240px, 38vw"
          className="pointer-events-none object-cover"
        />
      </div>

      <figure className="relative flex min-w-0 flex-1 flex-col bg-[#024930] px-5 pb-5 pt-8 text-white sm:px-7 sm:pb-6 sm:pt-10 lg:px-10 lg:pb-8 lg:pt-12">
        {item.quote && (
          <blockquote className="mx-auto w-full max-w-[36rem] flex-1 text-center text-[clamp(1rem,2.8vw,1.35rem)] font-normal leading-snug tracking-[-0.02em] sm:leading-[1.35] lg:text-[1.65rem] lg:leading-[1.25]">
            {item.quote}
          </blockquote>
        )}
        {(item.authorName || item.authorRole) && (
          <figcaption className="mt-6 w-full shrink-0 self-end text-right sm:mt-8">
            <p className="ml-auto inline-block max-w-[16rem] text-right text-[0.9375rem] leading-snug text-white/95 sm:text-base lg:text-[1.05rem]">
              {item.authorName && (
                <span className="block font-semibold tracking-tight text-white">{item.authorName}</span>
              )}
              {item.authorRole && (
                <span className="mt-0.5 block text-white/80">{item.authorRole}</span>
              )}
            </p>
          </figcaption>
        )}
      </figure>
    </article>
  );
}
