import Link from "next/link";
import type { Route } from "next";

import { ProductCard } from "@/components/sections/ProductCard";
import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  products: NonNullable<Homepage["productsSection"]>;
  locale: Locale;
};

/**
 * Meal options / products section — Figma "Products" frame (1440×1606 export).
 *
 * Pixel anchors from the source SVG:
 *   - Section fill #E6FFA9
 *   - Heading centred in forest green
 *   - 3×2 card grid with 32px gutters and 64px row spacing
 *   - Forest pill CTA below the grid
 */
export function ProductsSection({ products, locale }: Props) {
  const headingLine1 = pickLocale(products.headingLine1, locale);
  const headingLine2 = pickLocale(products.headingLine2, locale);
  const items = products.items ?? [];
  const ctaLabel = pickLocale(products.cta?.label, locale);
  const ctaHref = products.cta?.href;

  if (!headingLine1 && !headingLine2 && items.length === 0) return null;

  return (
    <section
      aria-labelledby="products-heading"
      className="bg-[var(--color-brand-accent)] py-16 md:py-20"
    >
      <Container>
        {(headingLine1 || headingLine2) && (
          <div className="reveal mx-auto max-w-[920px] text-center">
            <h2
              id="products-heading"
              className="text-[40px] font-normal leading-[1.08] tracking-[-0.02em] text-[var(--color-brand-forest)] sm:text-[48px] lg:text-[56px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {headingLine1 && <span className="block">{headingLine1}</span>}
              {headingLine2 && <span className="block">{headingLine2}</span>}
            </h2>
          </div>
        )}

        {items.length > 0 && (
          <ul className="reveal mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {items.map((card, index) => (
              <li key={`${pickLocale(card.title, locale) ?? "meal"}-${index}`}>
                <ProductCard card={card} locale={locale} />
              </li>
            ))}
          </ul>
        )}

        {ctaLabel && ctaHref && (
          <div className="reveal mt-16 flex justify-center md:mt-20">
            <Link
              href={ctaHref as Route}
              className="inline-flex h-[47px] items-center justify-center rounded-full bg-[var(--color-brand-forest)] px-8 text-base font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
