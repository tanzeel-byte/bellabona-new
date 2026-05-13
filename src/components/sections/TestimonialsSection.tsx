import { SanityImage as Image } from "@/components/ui/SanityImage";

import { FIGMA_IMAGES } from "@/lib/figma/assets";
import { sanityImageUrl } from "@/lib/sanity-image";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["testimonialsSection"]>;
  locale: Locale;
};

export function TestimonialsSection({ section, locale }: Props) {
  const heading = pickLocale(section.heading, locale);
  const quote = pickLocale(section.quote, locale);
  const authorName = pickLocale(section.authorName, locale);
  const authorRole = pickLocale(section.authorRole, locale);

  const leftSrc =
    sanityImageUrl(section.leftPhoto, 900) ?? FIGMA_IMAGES.testimonialLeft;
  const rightSrc =
    sanityImageUrl(section.rightPhoto, 900) ?? FIGMA_IMAGES.testimonialRight;
  const leftAlt = pickLocale(section.leftPhoto?.alt, locale) ?? "";
  const rightAlt = pickLocale(section.rightPhoto?.alt, locale) ?? "";

  if (!heading && !quote) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="overflow-x-clip bg-[#e6ffa9] py-20"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-16 px-5 sm:px-10 lg:px-20">
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

        <div className="reveal flex w-full shrink-0 items-center justify-center gap-3 overflow-hidden lg:gap-6 lg:overflow-visible">
          <TestimonialPhoto
            src={leftSrc}
            alt={leftAlt}
            containerClassName="relative h-[210px] w-[56px] shrink-0 rounded-[30px] lg:mx-auto lg:size-[400px] lg:max-w-full"
            imageClassName="left-[-104px] top-0 h-full w-[210px] lg:left-[-10.62%] lg:top-[-10.63%] lg:size-[132.38%]"
          />
          <figure className="relative z-10 flex h-[298px] w-[75vw] max-w-[397px] shrink-0 flex-col items-center justify-between overflow-clip rounded-[12px] bg-[#024930] px-6 pb-5 pt-12 text-white lg:h-[562.247px] lg:w-full lg:max-w-[749.663px] lg:rounded-[28.805px] lg:px-[27.175px] lg:pb-[28.112px] lg:pt-[159.303px]">
            {quote && (
              <blockquote className="w-full max-w-[590.359px] text-center text-[22px] font-normal leading-[1.06] tracking-[-0.7497px] lg:text-[37.483px] lg:leading-none">
                {quote}
              </blockquote>
            )}
            {(authorName || authorRole) && (
              <figcaption className="flex w-full shrink-0 items-center justify-center gap-[14.993px]">
                <div className="flex items-center justify-center">
                  <p className="flex w-full max-w-[287.683px] flex-col justify-center text-center text-[16px] leading-[1.25] lg:h-[48.728px] lg:text-[19.203px] lg:leading-[26.884px]">
                    {authorName && <span className="font-semibold">{authorName}</span>}
                    {authorName && authorRole && (
                      <>
                        <br aria-hidden="true" />
                        {authorRole}
                      </>
                    )}
                    {!authorName && authorRole}
                  </p>
                </div>
              </figcaption>
            )}
          </figure>
          <TestimonialPhoto
            src={rightSrc}
            alt={rightAlt}
            containerClassName="relative h-[210px] w-[56px] shrink-0 rounded-[30px] lg:mx-auto lg:size-[400px] lg:max-w-full"
            imageClassName="left-[-57px] top-0 h-full w-[158px] lg:left-[-64.25%] lg:top-[-70.52%] lg:h-[208.45%] lg:w-[164.25%]"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialPhoto({
  src,
  alt,
  imageClassName,
  containerClassName,
}: {
  src: string;
  alt: string;
  imageClassName: string;
  containerClassName?: string;
}) {
  return (
    <div className={containerClassName ?? "relative mx-auto size-[400px] max-w-full shrink-0 rounded-[30px]"}>
      <div className="pointer-events-none absolute inset-0 rounded-[30px]">
        <div className="absolute inset-0 rounded-[30px] bg-[#10022c]" />
        <div className="absolute inset-0 overflow-hidden rounded-[30px]">
          <Image
            alt={alt}
            src={src}
            width={1024}
            height={1024}
            className={`pointer-events-none absolute max-w-none ${imageClassName}`}
          />
        </div>
      </div>
    </div>
  );
}
