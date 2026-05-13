import { cacheLife, cacheTag } from "next/cache";

import { serverClient } from "@/sanity/lib/client";
import { HOMEPAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Homepage, SiteSettings } from "@/types/sanity";

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
