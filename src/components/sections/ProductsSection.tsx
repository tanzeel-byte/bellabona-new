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

export function ProductsSection({ products, locale }: Props) {
  const headingLine1 = pickLocale(products.headingLine1, locale);
  const headingLine2 = pickLocale(products.headingLine2, locale);
  const items = products.items ?? [];
  const ctaLabel = pickLocale(products.cta?.label, locale);
  const ctaHref = products.cta?.href;
  const heading =
    headingLine1 && headingLine2
      ? `${headingLine1} ${headingLine2}`
      : headingLine1 ?? headingLine2;

  if (!heading && items.length === 0) return null;

  return (
    <section
      aria-labelledby="products-heading"
      className="bg-[#e6ffa9] py-20"
    >
      <Container className="max-w-[1440px] px-5 md:px-10 ">
        <div className="flex flex-col items-center gap-16">
          {heading && (
            <h2
              id="products-heading"
              className="reveal max-w-[970px] text-center text-[40px] font-semibold leading-[1.2] text-[#024930] sm:text-[52px] lg:text-[60px]"
            >
              {heading}
            </h2>
          )}

          {items.length > 0 && (
            <ul className="reveal grid w-full grid-cols-1 justify-items-center gap-[32px] lg:grid-cols-3">
              {items.map((card, index) => (
                <li key={`${pickLocale(card.title, locale) ?? "meal"}-${index}`}>
                  <ProductCard card={card} locale={locale} index={index} />
                </li>
              ))}
            </ul>
          )}

          {ctaLabel && ctaHref && (
            <div className="reveal flex h-12 w-full items-center justify-center">
              <Link
                href={ctaHref as Route}
                className="inline-flex h-[47.37px] items-center justify-center rounded-[77.707px] bg-[#024930] px-6 text-lg font-medium tracking-[0.216px] text-white transition-colors hover:bg-[var(--color-brand-green)]"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
