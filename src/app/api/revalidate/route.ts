import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { revalidateSecret } from "@/sanity/env";

/**
 * Webhook endpoint hit by Sanity when a document is published.
 *
 * In Sanity → Manage → API → Webhooks, create a webhook with:
 *   URL:     {SITE_URL}/api/revalidate
 *   Trigger: Create / Update / Delete
 *   Filter:  _type in ["homepage", "siteSettings"]
 *   HTTP:    POST, JSON body
 *   Secret:  matches SANITY_REVALIDATE_SECRET (sent in `Sanity-Webhook-Secret` header)
 *
 * The handler maps the changed document `_type` to its cache tag and calls
 * `revalidateTag(tag, "max")` so the cache is marked stale and refreshed in
 * the background on the next request — stale-while-revalidate semantics, no
 * blocking work for readers.
 *
 * Why not revalidatePath? Tags scale better: when we add more pages that
 * consume the homepage document, the same tag flushes all of them.
 */
export async function POST(request: NextRequest) {
  if (!revalidateSecret) {
    return NextResponse.json(
      { error: "Server misconfigured: SANITY_REVALIDATE_SECRET is unset." },
      { status: 500 },
    );
  }

  // Sanity sends the shared secret in this header. Comparing strings directly
  // is fine because both sides are short, constant-time-safe values here.
  const provided = request.headers.get("sanity-webhook-secret");
  if (provided !== revalidateSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Sanity webhook bodies vary by projection. We expect a `_type` field
  // either at the root or under `result._type` depending on how the webhook
  // is configured. Handle both.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const docType = extractType(body);
  if (!docType) {
    return NextResponse.json(
      { error: "Missing _type in webhook payload" },
      { status: 400 },
    );
  }

  // Map document types → cache tags. Add new types here as the schema grows.
  const tagMap: Record<string, string> = {
    homepage: "homepage",
    siteSettings: "siteSettings",
  };
  const tag = tagMap[docType];
  if (!tag) {
    return NextResponse.json({
      revalidated: false,
      reason: `No tag mapped for _type "${docType}"`,
    });
  }

  // 'max' profile = stale-while-revalidate. Readers keep getting cached HTML
  // until the regenerated copy is ready — no waterfall, no waiting.
  revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tag, at: Date.now() });
}

function extractType(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (typeof obj._type === "string") return obj._type;
  const result = obj.result;
  if (result && typeof result === "object" && "_type" in result) {
    const t = (result as { _type?: unknown })._type;
    if (typeof t === "string") return t;
  }
  return null;
}
