import { cacheLife, cacheTag } from "next/cache";

import { serverClient } from "@/sanity/lib/client";
import { HOMEPAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Homepage, SiteSettings } from "@/types/sanity";

/**
 * All Sanity reads flow through these wrappers. Three reasons:
 *
 *   1. Caching is centralised. Every fetch uses Next.js Cache Components
 *      (`'use cache'`), so the homepage is statically prerendered and served
 *      from the edge cache with sub-100ms TTFB.
 *
 *   2. Each document has its own tag (`homepage`, `siteSettings`). A Sanity
 *      webhook hits /api/revalidate with the changed `_type` and we call
 *      `revalidateTag(tag, 'max')` — only the affected cache busts, not
 *      the whole page.
 *
 *   3. The `'hours'` cache profile is a sensible default for editorial CMS
 *      content: stale-while-revalidate behaviour means readers never wait,
 *      and on-demand invalidation makes the editor experience feel instant.
 */

export async function getHomepage(): Promise<Homepage | null> {
  "use cache";
  cacheTag("homepage");
  cacheLife("hours");

  return serverClient.fetch<Homepage | null>(HOMEPAGE_QUERY);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheTag("siteSettings");
  cacheLife("hours");

  return serverClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY);
}
