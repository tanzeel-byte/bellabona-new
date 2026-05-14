import { SanityImage as Image } from "@/components/ui/SanityImage";

import { Container } from "@/components/ui/Container";
import { CtaPopupButton } from "@/components/ui/CtaPopup";
import { FIGMA_IMAGES } from "@/lib/figma/assets";
import { sanityImageUrl } from "@/lib/sanity-image";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["taxCtaSection"]>;
  locale: Locale;
};

export function TaxCtaSection({ section, locale }: Props) {
  const headline = pickLocale(section.headline, locale);
  const ctaLabel = pickLocale(section.cta?.label, locale);
  const ctaHref = section.cta?.href;
  const dishTitle = pickLocale(section.dishName, locale);
  const dishPrice = pickLocale(section.salePrice, locale);
  const dishOriginalPrice = pickLocale(section.listPrice, locale);
  const savingsLabel = pickLocale(section.savingsLabel, locale);
  const dishPhotoSrc =
    sanityImageUrl(section.dishImage, 900) ?? FIGMA_IMAGES.dish5b;
  const dishPhotoAlt = pickLocale(section.dishImage?.alt, locale) ?? "";

  if (!headline && !(ctaLabel && ctaHref)) return null;

  return (
    <section aria-labelledby="tax-cta-heading" className="bg-white">
      <Container className="max-w-[1440px] px-6 py-10 md:px-10">
        <div className="grid min-w-0 grid-cols-1 gap-8 rounded-[20px] bg-[#fff0ed] p-6 sm:p-8 lg:h-[387px] lg:grid-cols-[minmax(0,1fr)_minmax(220px,min(530px,48vw))] lg:items-center lg:gap-5 lg:py-[30px] lg:pl-6 lg:pr-5 xl:grid-cols-[minmax(0,1fr)_530px] xl:gap-6 xl:pl-[50px] xl:pr-[30px] 2xl:gap-0">
          <div className="flex w-full min-w-0 flex-col items-start gap-8 lg:h-full lg:justify-between xl:max-w-[637px]">
            {headline && (
              <h2
                id="tax-cta-heading"
                className="reveal w-full min-w-0 text-[32px] font-bold leading-[1.05] text-[#9a0103] sm:text-[40px] lg:text-[60px] lg:leading-none"
              >
                {headline}
              </h2>
            )}
            {ctaLabel && ctaHref && (
              <CtaPopupButton
                href={ctaHref}
                label={ctaLabel}
                className="reveal flex h-11 w-full items-center justify-center rounded-[77.707px] bg-[#9a0103] px-6 text-base font-medium tracking-[0.216px] text-[#fff0ed] transition-colors hover:bg-[#7d0102] sm:h-[47.37px] sm:text-lg lg:inline-flex lg:w-auto"
              >
                {ctaLabel}
              </CtaPopupButton>
            )}
          </div>

          <div className="relative h-[280px] w-full min-w-0 shrink-0 overflow-clip rounded-[20px] bg-[#9a0103] sm:h-[320px] lg:h-full lg:w-full">
            <div className="absolute left-1/2 top-[26px] origin-top -translate-x-1/2 scale-[0.78] sm:top-[30px] sm:scale-[0.88] lg:top-[34px] lg:scale-100 xl:left-[126px] xl:translate-x-0">
              <div className="relative h-[336px] w-[290px] sm:w-[300px] ">
                <div className="absolute inset-0 rounded-[16.427px] border-[1.315px] border-solid border-[#ededed] bg-white" />
                <div className="absolute left-[calc(50%-1.03px)] top-[68.21px] h-[238.848px] w-[267.601px] -translate-x-1/2 overflow-clip rounded-[10.101px]">
                  <div className="absolute left-[-201.81px] top-[-59.74px] flex h-[661.655px] w-[661.385px] items-center justify-center">
                    <div className="flex-none rotate-[-37.68deg]">
                      <div className="relative h-[472.354px] w-[470.856px]">
                        <Image
                          alt={dishPhotoAlt}
                          src={dishPhotoSrc}
                          width={1024}
                          height={1024}
                          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {(dishPrice || dishOriginalPrice) && (
                  <div className="absolute left-[4.07px] top-[66.05px] flex h-[17.483px] w-[130.149px] items-center justify-center gap-[9.713px] whitespace-nowrap text-center">
                    {dishPrice && (
                      <p className="relative shrink-0 text-[24.354px] leading-[0] text-black not-italic">
                        <span className="font-normal leading-[1.17]">{dishPrice}</span>
                      </p>
                    )}
                    {dishOriginalPrice && (
                      <p className="relative shrink-0 text-[19.926px] font-medium leading-[1.17] text-[#939191] line-through decoration-solid [text-decoration-skip-ink:none]">
                        {dishOriginalPrice}
                      </p>
                    )}
                  </div>
                )}
                {dishTitle && (
                  <p className="absolute left-[4.07px] top-[14px] whitespace-nowrap text-[40.711px] font-medium leading-[0.9] text-black">
                    {dishTitle}
                  </p>
                )}
                {savingsLabel && (
                  <div className="absolute left-[86.7px] top-[99.69px] flex h-[51px] w-[235px] md:w-[259px] flex-wrap content-center items-center justify-center gap-x-[10.307px] gap-y-[10.307px] rounded-[13879.89px] bg-[#e6ffa9] pl-[9.37px] pr-[18.897px] drop-shadow-[0px_3.103px_3.103px_rgba(0,0,0,0.16)]">
                    <div className="relative size-[37.481px] shrink-0">
                      <svg
                        className="absolute inset-0 block size-full"
                        viewBox="0 0 37.4829 37.4817"
                        fill="none"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <circle cx="18.7422" cy="18.741" r="18.7407" fill="#024930" />
                        <path d={svgPaths.p3e378b00} fill="#E6FFA9" />
                      </svg>
                    </div>
                    <div className="relative flex w-[150px] md:w-[165px] shrink-0 flex-col justify-center text-[16px] font-semibold leading-[0] text-[#024930] sm:text-[21.538px]">
                      <p className="leading-[1.4] text-xs sm:text-sm">{savingsLabel}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
