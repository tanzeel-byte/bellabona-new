import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, readToken } from "@/sanity/env";

/**
 * Public client — safe to call from the browser (Studio uses this).
 * No token attached.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Edge-cached, eventually consistent. Perfect for ISR-shaped content.
  perspective: "published",
  stega: false,
});

/**
 * Server-only client. Carries the read token so we can fetch from private
 * datasets and bypass the CDN when we need fresh content (previews, on-demand
 * revalidation paths).
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  useCdn: false,
  perspective: "published",
  stega: false,
});
