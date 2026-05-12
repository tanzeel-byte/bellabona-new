import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is the v16 caching primitive. It enables the `'use cache'`
  // directive, cacheLife(), cacheTag(), and on-demand revalidation via
  // revalidateTag(tag, 'max'). All Sanity fetches go through cached wrappers
  // so the page is statically prerendered and revalidated on webhook.
  cacheComponents: true,

  images: {
    // Sanity's image CDN. Specific to our project for least-privilege.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/8yc2ngkf/**",
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
