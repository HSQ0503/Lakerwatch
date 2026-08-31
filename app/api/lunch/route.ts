import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatLunchDate,
  getWeekSundayFromDate,
  isLunchDate,
} from "@/lib/lunch";
import {
  canSyncLunchWeekOnDemand,
  FlikMenuError,
  shouldRefreshLunchMenu,
  syncLunchWeekOnDemand,
} from "@/lib/lunch-server";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 30 requests per IP per minute
  const ip = getClientIp(request);
  const rl = rateLimit(`lunch:${ip}`, { limit: 30, windowSeconds: 60 });
  if (!rl.allowed) {
    return rateLimitResponse(rl.resetAt);
  }

  const dateParam = request.nextUrl.searchParams.get("date");
  const today = formatLunchDate(new Date());
  const targetDate = dateParam ?? today;
  if (!isLunchDate(targetDate)) {
    return NextResponse.json(
      { error: "Date must use YYYY-MM-DD format" },
      { status: 400 },
    );
  }

  const weekStart = getWeekSundayFromDate(targetDate);
  const currentWeek = getWeekSundayFromDate(today);
  const canSyncOnDemand = canSyncLunchWeekOnDemand(weekStart, currentWeek);
  let menu = await prisma.lunchMenu.findUnique({
    where: { weekStart },
  });

  if (!menu && !canSyncOnDemand) {
    return NextResponse.json(
      { error: "No menu available for this week" },
      { status: 404 },
    );
  }

  if (canSyncOnDemand && (!menu || shouldRefreshLunchMenu(menu))) {
    try {
      menu = await syncLunchWeekOnDemand(weekStart);
    } catch (error) {
      console.error(`Lunch on-demand sync failed for ${weekStart}:`, error);

      // Keep serving a cached menu if FLIK is temporarily unavailable.
      if (!menu) {
        if (error instanceof FlikMenuError && error.status === 404) {
          return NextResponse.json({
            weekStart,
            days: [],
            updatedAt: null,
          });
        }

        return NextResponse.json(
          { error: "Lunch menu is temporarily unavailable" },
          { status: 503 },
        );
      }
    }
  }

  return NextResponse.json({
    weekStart: menu.weekStart,
    days: menu.days,
    updatedAt: menu.updatedAt,
  });
}
