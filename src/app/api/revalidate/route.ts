import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { revalidateSecret } from "@/sanity/env";

// On-demand revalidation via Sanity webhook. Maps _type → cache tag.
export async function POST(request: NextRequest) {
  if (!revalidateSecret) {
    return NextResponse.json(
      { error: "Server misconfigured: SANITY_REVALIDATE_SECRET is unset." },
      { status: 500 },
    );
  }

  const provided = request.headers.get("sanity-webhook-secret");
  if (provided !== revalidateSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
