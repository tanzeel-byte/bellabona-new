import Image, { type ImageProps } from "next/image";

function isSanityCdnSrc(src: ImageProps["src"]): boolean {
  return typeof src === "string" && src.includes("cdn.sanity.io");
}

/**
 * Same as `next/image`, but skips the `/_next/image` optimizer for Sanity CDN
 * URLs. Sanity already serves resized, auto-formatted assets (`urlFor`), and
 * re-processing large PNGs through Sharp in dev often hits **TimeoutError**
 * → HTTP 500 on `/_next/image`.
 */
export function SanityImage(props: ImageProps) {
  const { src, unoptimized, ...rest } = props;
  const bypassOptimizer = isSanityCdnSrc(src) || unoptimized === true;
  return <Image src={src} {...rest} unoptimized={bypassOptimizer} />;
}
