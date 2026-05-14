import { Container } from "@/components/ui/Container";
import { CtaPopupButton } from "@/components/ui/CtaPopup";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

type Props = {
  section: NonNullable<Homepage["finalCta"]>;
  locale: Locale;
};

export function FinalCtaSection({ section, locale }: Props) {
  const headline = pickLocale(section.headline, locale);
  const body = pickLocale(section.body, locale);
  const ctaLabel = pickLocale(section.primaryCta?.label, locale);
  const ctaHref = section.primaryCta?.href;

  if (!headline && !body && !(ctaLabel && ctaHref)) return null;

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="bg-[var(--color-brand-forest)] py-20 text-white"
    >
      <Container narrow className="reveal text-center">
        {headline && (
          <h2
            id="final-cta-heading"
            className="text-[40px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[52px] lg:text-[60px]"
          >
            {headline}
          </h2>
        )}
        {body && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-[1.6] text-white/85">
            {body}
          </p>
        )}
        {ctaLabel && ctaHref && (
          <div className="mt-10 flex justify-center">
            <CtaPopupButton
              href={ctaHref}
              label={ctaLabel}
              className="inline-flex h-12 items-center rounded-full bg-[var(--color-brand-accent)] px-8 text-lg font-medium text-[var(--color-brand-forest)] transition-colors hover:bg-[var(--color-brand-accent-hover)]"
            >
              {ctaLabel}
            </CtaPopupButton>
          </div>
        )}
      </Container>
    </section>
  );
}
