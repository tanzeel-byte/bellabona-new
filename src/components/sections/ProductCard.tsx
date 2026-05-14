import { SanityImage as Image } from "@/components/ui/SanityImage";

import { FIGMA_IMAGES } from "@/lib/figma/assets";
import { sanityImageUrl } from "@/lib/sanity-image";
import svgPaths from "@/lib/figma/svg-paths";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { ProductCard as ProductCardType } from "@/types/sanity";

type Props = {
  card: ProductCardType;
  locale: Locale;
  index?: number;
};

export function ProductCard({ card, locale, index = 0 }: Props) {
  const tag = pickLocale(card.tag, locale);
  const title = pickLocale(card.title, locale);
  const mealSrc =
    sanityImageUrl(card.image, 1200) ??
    FIGMA_IMAGES.meals[index % FIGMA_IMAGES.meals.length];
  const imageAlt = pickLocale(card.image?.alt, locale) ?? title ?? "";
  const reviewsLabel = locale === "de" ? "Bewertungen" : "reviews";
  const splitRatingStyle = index >= 3;

  if (!title && !mealSrc) return null;

  return (
    <article className="flex w-[350px] sm:w-[405px] max-w-full shrink-0 flex-col gap-[32px] rounded-[20px] bg-white px-4 pb-8 pt-4">
      <div className="relative h-[373px] w-full shrink-0 overflow-clip rounded-[16px] bg-[#f9feec]">
        <div className="pointer-events-none absolute left-[calc(50%-0.11px)] top-[calc(50%+114.1px)] z-0 flex h-[597.367px] w-[601.733px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="rotate-[58.67deg]">
            <div className="relative h-[442.84px] w-[429.78px]">
              <Image
                src={FIGMA_IMAGES.dishPlate}
                alt=""
                fill
                sizes="430px"
                className="pointer-events-none object-cover"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-[-51.97px] top-[51.3px] z-[1] flex size-[476.602px] items-center justify-center">
          <div className="rotate-[1.9deg]">
            <div className="relative size-[461.564px]">
              <Image
                src={mealSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 405px, 100vw"
                className="pointer-events-none object-cover"
              />
            </div>
          </div>
        </div>

        {tag && <CategoryBadge label={tag} />}
      </div>

      <div className="flex w-full min-h-[108px] flex-col gap-2.5">
        {title && (
          <h3 className="w-full text-[24px] font-semibold leading-[1.4] tracking-[0.288px] text-black">
            {title}
          </h3>
        )}

        {(card.ratingPercent || card.reviewCount) && (
          <div className="flex w-full items-center gap-2.5">
            <ThumbsUpIcon className="size-[26.5px] shrink-0" />
            {splitRatingStyle ? (
              <p className="whitespace-nowrap text-[0px] font-normal leading-none tracking-[0.288px] text-[#1a211e]">
                {card.ratingPercent && (
                  <span className="text-[24px] leading-[1.4]">{card.ratingPercent}</span>
                )}
                {card.reviewCount && (
                  <>
                    <span className="text-[20px] leading-[1.5]"> </span>
                    <span className="text-[20px] leading-[1.5] text-[#a9a9a9]">
                      ({card.reviewCount} {reviewsLabel})
                    </span>
                  </>
                )}
              </p>
            ) : (
              <p className="whitespace-nowrap text-[24px] font-normal leading-[1.4] tracking-[0.288px] text-[#1a211e]">
                {card.ratingPercent}
                {card.reviewCount && ` (${card.reviewCount} ${reviewsLabel})`}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <div className="absolute left-[12.5px] top-[12.69px] z-10 rounded-[573.256px] bg-white">
      <div className="relative flex size-full items-center gap-[18.344px] overflow-clip rounded-[inherit] py-2 pl-[22.93px] pr-[9.172px]">
        <p className="whitespace-nowrap text-[16.051px] font-medium leading-[27.516px] tracking-[0.2293px] text-[#272e35]">
          {label}
        </p>
        <div className="flex h-[36.688px] shrink-0 items-center justify-center overflow-clip rounded-md p-[6.879px]">
          <div className="relative size-[22.93px] overflow-clip">
            <div className="absolute inset-1/4">
              <TagDismissIcon className="size-full text-[#4A545E]" />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1.147px] rounded-[574.403px] border-[1.147px] border-solid border-[rgba(16,40,72,0.09)] shadow-[0px_2.293px_2.293px_-1.147px_rgba(27,36,44,0.04),0px_2.293px_9.172px_-1.147px_rgba(27,36,44,0.08)]"
      />
    </div>
  );
}

function TagDismissIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 11.4651 11.4651" aria-hidden="true" className={className} fill="currentColor">
      <path clipRule="evenodd" d={svgPaths.p1b8b0f00} fillRule="evenodd" />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26.5 26.5" aria-hidden="true" className={className} fill="none">
      <g clipPath="url(#product-card-thumb-clip)">
        <path d={svgPaths.p11f80} fill="black" />
      </g>
      <defs>
        <clipPath id="product-card-thumb-clip">
          <rect fill="white" height="26.5" width="26.5" />
        </clipPath>
      </defs>
    </svg>
  );
}
