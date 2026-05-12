import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Hero } from "@/components/sections/Hero";
import { LogoBar } from "@/components/sections/LogoBar";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { getHomepage } from "@/sanity/lib/fetch";

/**
 * Homepage. Rendering contract:
 *
 *   - This is a Server Component. All Sanity data is fetched server-side via
 *     `getHomepage()`, which is wrapped in `'use cache'` + cacheLife('hours').
 *     The page is statically prerendered for every locale at build time and
 *     served from the edge cache thereafter — sub-100ms TTFB.
 *
 *   - On-demand revalidation: a Sanity webhook posts to /api/revalidate, which
 *     calls revalidateTag('homepage', 'max'). Stale-while-revalidate means
 *     readers never wait for the regeneration. Editor publishes → site updates
 *     in seconds, with zero blocking work on the request path.
 *
 *   - generateMetadata pulls the same cached data (memoised within a render
 *     pass by `'use cache'`), so this `await getHomepage()` is free.
 */

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
    </>
  );
}
