import { ProductCard } from "@/components/sections/ProductCard";
import { Container } from "@/components/ui/Container";
import { CtaPopupButton } from "@/components/ui/CtaPopup";
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
        <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-14">
          {heading && (
            <h2
              id="products-heading"
              className="reveal max-w-[970px] text-center text-[40px] font-semibold leading-[1.2] text-[#024930] sm:text-[52px] lg:text-[60px]"
            >
              {heading}
            </h2>
          )}

          {items.length > 0 && (
            <div className="w-full max-lg:-mx-5 max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:overflow-y-clip max-lg:px-5 max-lg:pb-1 max-lg:[scrollbar-width:none] max-lg:[-ms-overflow-style:none] max-lg:[&::-webkit-scrollbar]:hidden md:max-lg:-mx-10 md:max-lg:px-10 lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0">
              <ul className="reveal grid w-max max-w-none grid-flow-col grid-rows-1 auto-cols-[min(85vw,350px)] items-stretch gap-5 pr-4 sm:auto-cols-[350px] sm:gap-6 sm:pr-6 lg:grid-flow-row lg:w-full lg:max-w-full lg:auto-cols-auto lg:grid-cols-3 lg:gap-8 lg:pr-0">
                {items.map((card, index) => (
                  <li
                    key={`${pickLocale(card.title, locale) ?? "meal"}-${index}`}
                    className="flex h-full min-h-0 w-full flex-col snap-start"
                  >
                    <ProductCard card={card} locale={locale} index={index} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ctaLabel && ctaHref && (
            <div className="reveal flex h-12 w-full items-center justify-center">
              <CtaPopupButton
                href={ctaHref}
                label={ctaLabel}
                className="inline-flex h-[47.37px] items-center justify-center rounded-[77.707px] bg-[#024930] px-6 text-lg font-medium tracking-[0.216px] text-white transition-colors hover:bg-[var(--color-brand-green)]"
              >
                {ctaLabel}
              </CtaPopupButton>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
