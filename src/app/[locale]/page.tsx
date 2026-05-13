import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ContactSection } from "@/components/sections/ContactSection";
import { CultureSection } from "@/components/sections/CultureSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { LogoBar } from "@/components/sections/LogoBar";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { StepsSection } from "@/components/sections/StepsSection";
import { SupportSection } from "@/components/sections/SupportSection";
import { TaxCtaSection } from "@/components/sections/TaxCtaSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { getHomepage } from "@/sanity/lib/fetch";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const homepage = await getHomepage();
  return buildMetadata({
    locale,
    path: "/",
    seo: homepage?.seo,
    fallbackTitle: "Bella&Bona — Lunch programs for modern teams",
    fallbackDescription:
      "Build culture and cut costs with fresh lunch options delivered every day, across every diet.",
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const homepage = await getHomepage();

  if (!homepage?.hero) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Homepage content not found</h1>
        <p className="mt-4 text-[var(--color-ink-muted)]">
          Open the embedded Studio at{" "}
          <a
            href="/studio"
            className="underline underline-offset-4 hover:text-[var(--color-brand-green)]"
          >
            /studio
          </a>{" "}
          and publish a Homepage document to populate this page.
        </p>
      </section>
    );
  }

  return (
    <>
      <Hero hero={homepage.hero} locale={locale} />
      {homepage.logoBar && (
        <LogoBar logoBar={homepage.logoBar} locale={locale} />
      )}
      {homepage.hero.stats && homepage.hero.stats.length > 0 && (
        <StatsSection stats={homepage.hero.stats} locale={locale} />
      )}
      {homepage.productsSection && (
        <ProductsSection products={homepage.productsSection} locale={locale} />
      )}
      {homepage.cultureSection && (
        <CultureSection section={homepage.cultureSection} locale={locale} />
      )}
      {homepage.taxCtaSection && (
        <TaxCtaSection section={homepage.taxCtaSection} locale={locale} />
      )}
      {homepage.stepsSection && (
        <StepsSection section={homepage.stepsSection} locale={locale} />
      )}
      {homepage.pricingSection && (
        <PricingSection section={homepage.pricingSection} locale={locale} />
      )}
      {homepage.testimonialsSection && (
        <TestimonialsSection section={homepage.testimonialsSection} locale={locale} />
      )}
      {homepage.contactSection && (
        <ContactSection section={homepage.contactSection} locale={locale} />
      )}
      {homepage.supportSection && (
        <SupportSection section={homepage.supportSection} locale={locale} />
      )}
      {homepage.faqSection && (
        <FaqSection section={homepage.faqSection} locale={locale} />
      )}
    </>
  );
}
