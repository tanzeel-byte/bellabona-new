import type { Metadata } from "next";

import { DEFAULT_LOCALE, LOCALES, type Locale, pickLocale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";
import type { Homepage } from "@/types/sanity";

type BuildArgs = {
  locale: Locale;
  /** Absolute path to this page, leading slash, no locale prefix (e.g. "") */
  path: string;
  seo: Homepage["seo"];
  fallbackTitle?: string;
  fallbackDescription?: string;
};

/** Builds Next.js Metadata from Sanity SEO fields. Emits canonical + hreflang for all locales. */
export function buildMetadata({
  locale,
  path,
  seo,
  fallbackTitle = SITE_NAME,
  fallbackDescription,
}: BuildArgs): Metadata {
  const title = pickLocale(seo?.title, locale) ?? fallbackTitle;
  const description = pickLocale(seo?.description, locale) ?? fallbackDescription;

  const canonical =
    seo?.canonicalUrl ?? `${SITE_URL}/${locale}${path === "/" ? "" : path}`;

  // hreflang map: every locale (+ x-default → the default locale).
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}${path === "/" ? "" : path}`]),
  );
  languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path === "/" ? "" : path}`;

  const ogImageUrl = seo?.ogImage?.asset
    ? urlFor(seo.ogImage).width(1200).height(630).url()
    : undefined;
  const ogImageAlt = pickLocale(seo?.ogImage?.alt, locale) ?? title;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale,
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: ogImageAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}
