import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Returns a Sanity image URL builder. Always set `.width()` (and ideally a
 * `.format("webp"|"auto")`) before `.url()` so the CDN returns an optimized
 * derivative — bare `.url()` serves the original asset which kills LCP.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/**
 * For a Sanity image asset, return the LQIP base64 placeholder if present
 * so `next/image`'s blur effect can render without an extra round-trip.
 * Falls back to undefined if the projection didn't include it.
 */
export function lqipFor(source: SanityImageSource | null | undefined): string | undefined {
  if (!source || typeof source !== "object") return undefined;
  const asset = (source as { asset?: { metadata?: { lqip?: string } } }).asset;
  return asset?.metadata?.lqip;
}
