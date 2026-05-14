import { Container } from "@/components/ui/Container";
import { pickLocale, type Locale } from "@/lib/i18n";
import type { Homepage } from "@/types/sanity";

import { FaqAccordion } from "@/components/sections/FaqAccordion";

type Props = {
  section: NonNullable<Homepage["faqSection"]>;
  locale: Locale;
};

export function FaqSection({ section, locale }: Props) {
  const heading = pickLocale(section.heading, locale);
  const hasItems = (section.items?.length ?? 0) > 0;

  if (!heading && !hasItems) return null;

  return (
    <section aria-labelledby="faq-heading" className="bg-white py-5 md:px-10 lg:px-20">
      <Container className="max-w-[1440px] px-6 py-5 md:px-10">
        <div className="flex flex-col gap-20 pb-5 pt-5 lg:pt-20 md:pb-10">
          {heading && (
            <h2
              id="faq-heading"
              className="reveal scroll-mt-28 mx-auto max-w-[1200px] text-center text-[40px] font-semibold leading-[60px] tracking-[-0.4px] text-[#1a211e] sm:scroll-mt-32 sm:text-[52px] lg:text-[60px]"
            >
              {heading}
            </h2>
          )}

          {hasItems && <FaqAccordion section={section} locale={locale} />}
        </div>
      </Container>
    </section>
  );
}
