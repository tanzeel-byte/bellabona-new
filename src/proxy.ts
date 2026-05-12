import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

/**
 * Single responsibility: redirect "/" to "/{defaultLocale}".
 *
 * Why not a Next config redirect? Because we want this to be content-aware
 * later — once we add an Accept-Language sniff or a saved cookie, the logic
 * lives in one place. Until then the redirect is permanent so search engines
 * collapse "/" and "/en" into a single canonical.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and asset routes — proxy shouldn't run for them.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.includes(".") // static files (favicon, og images, etc.)
  ) {
    return NextResponse.next();
  }

  // If the path already begins with a supported locale, pass through.
  const firstSegment = pathname.split("/")[1];
  if ((LOCALES as readonly string[]).includes(firstSegment)) {
    return NextResponse.next();
  }

  // Otherwise redirect to the default locale, preserving the deeper path.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Run on every path except those we explicitly skip above. The matcher
  // exclusions are belt-and-braces — combined with the early returns above
  // they ensure Studio, API routes, and asset URLs never touch this code.
  matcher: ["/((?!api|_next/static|_next/image|studio|favicon.ico|.*\\..*).*)"],
};
