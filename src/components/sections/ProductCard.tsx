import Image from "next/image";

import { pickLocale, type Locale } from "@/lib/i18n";
import { lqipFor, urlFor } from "@/sanity/lib/image";
import type { ProductCard as ProductCardType } from "@/types/sanity";

type Props = {
  card: ProductCardType;
  locale: Locale;
};

/**
 * Single meal card from the Products frame.
 *
 * Pixel anchors from the source SVG:
 *   - Card: 405×531, 20px radius, white surface
 *   - Image well: 373×373, 16px radius, fill #F9FEEC
 *   - Tag pill: white fill, 1.15px border at #102848 / 9% opacity
 */
export function ProductCard({ card, locale }: Props) {
  const tag = pickLocale(card.tag, locale);
  const title = pickLocale(card.title, locale);
  const imageSrc = card.image?.asset ? urlFor(card.image).width(800).height(800).url() : null;
  const imageAlt = pickLocale(card.image?.alt, locale) ?? title ?? "";
  const lqip = lqipFor(card.image);
  const imgWidth = card.image?.asset?.metadata?.dimensions?.width ?? 800;
  const imgHeight = card.image?.asset?.metadata?.dimensions?.height ?? 800;
  const reviewsLabel = locale === "de" ? "Bewertungen" : "reviews";

  if (!title && !imageSrc) return null;

  return (
    <article className="flex h-full min-h-[531px] flex-col rounded-[20px] bg-white p-4">
      {tag && (
        <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#102848]/[0.09] bg-white px-4 py-3 text-sm leading-none text-[#1A211E]">
          <span className="truncate">{tag}</span>
          <TagDismissIcon className="h-4 w-4 shrink-0 text-[#4A545E]" />
        </div>
      )}

      {imageSrc && (
        <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-[16px] bg-[#F9FEEC]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imgWidth}
            height={imgHeight}
            sizes="(min-width: 1024px) 405px, (min-width: 768px) 33vw, 100vw"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex flex-1 flex-col justify-end">
        {title && (
          <h3 className="text-[20px] font-semibold leading-[1.3] tracking-[-0.01em] text-black">
            {title}
          </h3>
        )}

        {(card.ratingPercent || card.reviewCount) && (
          <p className="mt-3 flex items-center gap-2 text-sm leading-none text-[#1A211E]">
            <ThumbsUpIcon className="h-4 w-4 shrink-0" />
            {card.ratingPercent && <span className="font-medium">{card.ratingPercent}</span>}
            {card.reviewCount && (
              <span className="text-[#1A211E]/80">
                ({card.reviewCount} {reviewsLabel})
              </span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

function TagDismissIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.138 4.55a.5.5 0 0 1 .707 0L12.3 8.005l3.455 3.455a.5.5 0 1 1-.707.707L11.593 8.712l-3.455 3.455a.5.5 0 0 1-.707-.707L10.886 8.005 7.431 4.55a.5.5 0 0 1 .707 0Z"
      />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path
        d="M4.75 6.5V13.25H2.75C2.336 13.25 2 12.914 2 12.5V7.25C2 6.836 2.336 6.5 2.75 6.5H4.75ZM5.75 6.5L7.55 2.86C7.82 2.32 8.37 2 8.95 2C9.78 2 10.45 2.67 10.45 3.5V6H12.75C13.72 6 14.5 6.78 14.5 7.75C14.5 7.92 14.48 8.09 14.44 8.25L13.19 12.25C12.97 13.02 12.26 13.55 11.46 13.55H6.25C5.836 13.55 5.5 13.214 5.5 12.8V6.5H5.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
