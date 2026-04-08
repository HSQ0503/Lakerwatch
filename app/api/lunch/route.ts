import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeekSunday } from "@/lib/lunch";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 30 requests per IP per minute
  const ip = getClientIp(request);
  const rl = rateLimit(`lunch:${ip}`, { limit: 30, windowSeconds: 60 });
  if (!rl.allowed) {
    return rateLimitResponse(rl.resetAt);
  }

  const dateParam = request.nextUrl.searchParams.get("date");

  const target = dateParam
    ? new Date(dateParam + "T12:00:00")
    : new Date();
  const weekStart = getWeekSunday(target);

  const menu = await prisma.lunchMenu.findUnique({
    where: { weekStart },
  });

  if (!menu) {
    return NextResponse.json(
      { error: "No menu available for this week" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    weekStart: menu.weekStart,
    days: menu.days,
    updatedAt: menu.updatedAt,
  });
}
