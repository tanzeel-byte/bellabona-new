import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Robots policy. The Studio is the only thing we actively block; everything
 * else is open. Sitemap pointer goes in the response so crawlers find every
 * locale entry in one hop.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
