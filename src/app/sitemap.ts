import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

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
