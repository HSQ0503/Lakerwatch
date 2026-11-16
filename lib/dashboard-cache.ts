import type { NextRequest } from "next/server";

// Only public dashboard reads share an edge cache. Admin reads must see edits immediately.
export function dashboardCacheOptions(request: NextRequest) {
  if (request.nextUrl.searchParams.get("view") !== "dashboard") return;
  return { headers: { "Vercel-CDN-Cache-Control": "public, s-maxage=15" } };
}
