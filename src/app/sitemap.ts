import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Dynamic sitemap. Emits one entry per locale per page with hreflang
 * `alternates.languages` so search engines crawl every translation and
 * understand they are equivalents, not duplicates.
 *
 * As the site grows (blog, menu pages, etc.) we'll fetch the slug list from
 * Sanity here and expand the loop — the locale-times-page matrix is the part
 * that's easy to forget, so the structure is set up for it from day one.
 */
// Captured at build time. Sitemap is regenerated on every deploy, so the
// stamp ages by deploy cadence rather than per-request — fine for crawlers.
const LAST_MODIFIED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  ];

  return pages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${page.path === "/" ? "" : page.path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE_URL}/${l}${page.path === "/" ? "" : page.path}`,
            ]),
          ),
          "x-default": `${SITE_URL}/${DEFAULT_LOCALE}${page.path === "/" ? "" : page.path}`,
        },
      },
    })),
  );
}
