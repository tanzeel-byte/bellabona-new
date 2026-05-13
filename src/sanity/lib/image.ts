import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

export function lqipFor(source: SanityImageSource | null | undefined): string | undefined {
  if (!source || typeof source !== "object") return undefined;
  const asset = (source as { asset?: { metadata?: { lqip?: string } } }).asset;
  return asset?.metadata?.lqip;
}
