import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is the v16 caching primitive. It enables the `'use cache'`
  // directive, cacheLife(), cacheTag(), and on-demand revalidation via
  // revalidateTag(tag, 'max'). All Sanity fetches go through cached wrappers
  // so the page is statically prerendered and revalidated on webhook.
  cacheComponents: true,

  images: {
    // Sanity CDN — must match whatever `NEXT_PUBLIC_SANITY_PROJECT_ID` you use.
    // (A single hard-coded project id breaks `next/image` for all other Sanity projects.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    // Modern formats. next/image will negotiate AVIF first, fall back to WebP.
    formats: ["image/avif", "image/webp"],
  },

  // Tightly scoped reactStrictMode + typed routes catch errors at build time.
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;
