import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/types/sanity";

/** CDN URL for a Sanity image field, sized for `next/image`. */
export function sanityImageUrl(
  image: SanityImage | null | undefined,
  width: number,
): string | undefined {
  if (!image?.asset) return undefined;
  if (!image.asset._id && !image.asset.url) return undefined;
  try {
    return urlFor(image).width(width).quality(88).url();
  } catch {
    return image.asset.url;
  }
}
