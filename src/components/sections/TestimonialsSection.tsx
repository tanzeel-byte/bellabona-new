import { FIGMA_IMAGES } from "@/lib/figma/assets";
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

        <div className="reveal flex w-full shrink-0 flex-col items-center justify-center gap-6 lg:flex-row">
          <TestimonialPhoto
            src={FIGMA_IMAGES.testimonialLeft}
            imageClassName="left-[-10.62%] top-[-10.63%] size-[132.38%]"
          />
          <figure className="relative flex h-[562.247px] w-full max-w-[749.663px] shrink-0 flex-col items-center justify-between overflow-clip rounded-[28.805px] bg-[#024930] px-[27.175px] pb-[28.112px] pt-[159.303px] text-white">
            {quote && (
              <blockquote className="w-full max-w-[590.359px] text-center text-[28px] font-normal leading-none tracking-[-0.7497px] lg:text-[37.483px]">
                {quote}
              </blockquote>
            )}
            {(authorName || authorRole) && (
              <figcaption className="flex w-full shrink-0 items-center justify-center gap-[14.993px]">
                <div className="flex items-center justify-center">
                  <p className="flex h-[48.728px] w-full max-w-[287.683px] flex-col justify-center text-center text-[19.203px] leading-[26.884px]">
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
            src={FIGMA_IMAGES.testimonialRight}
            imageClassName="left-[-64.25%] top-[-70.52%] h-[208.45%] w-[164.25%]"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialPhoto({
  src,
  imageClassName,
}: {
  src: string;
  imageClassName: string;
}) {
  return (
    <div className="relative mx-auto size-[400px] max-w-full shrink-0 rounded-[30px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[30px]">
        <div className="absolute inset-0 rounded-[30px] bg-[#10022c]" />
        <div className="absolute inset-0 overflow-hidden rounded-[30px]">
          <img
            alt=""
            src={src}
            className={`pointer-events-none absolute max-w-none ${imageClassName}`}
          />
        </div>
      </div>
    </div>
  );
}
