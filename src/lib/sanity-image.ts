import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/types/sanity";

/** GROQ returns `asset` expanded with `_id` + `url`; `@sanity/image-url` expects an `image` + `asset._ref`. */
function toImageSource(image: SanityImage): SanityImageSource {
  const asset = image.asset;
  if (!asset) return { _type: "image", asset: { _ref: "" } };

  const ref =
    "_ref" in asset && typeof (asset as { _ref?: unknown })._ref === "string"
      ? (asset as { _ref: string })._ref
      : asset._id;

  if (!ref) {
    return image as SanityImageSource;
  }

  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
  } as SanityImageSource;
}

/** CDN URL for a Sanity image field, sized for `next/image`. */
export function sanityImageUrl(
  image: SanityImage | null | undefined,
  width: number,
): string | undefined {
  if (!image?.asset) return undefined;
  if (!image.asset._id && !image.asset.url) return undefined;
  try {
    return urlFor(toImageSource(image)).width(width).quality(88).url();
  } catch {
    return image.asset.url;
  }
}
