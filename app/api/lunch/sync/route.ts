import { NextRequest, NextResponse } from "next/server";
import {
  formatLunchDate,
  getWeekSundayFromDate,
  isLunchDate,
  shiftLunchDate,
} from "@/lib/lunch";
import { FlikMenuError, syncLunchWeek } from "@/lib/lunch-server";
import { verifyAdmin } from "@/lib/auth";

type SyncResult = { week: string; status: string };

async function syncWeeks(weekStarts: string[]): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  for (const weekStart of weekStarts) {
    try {
      await syncLunchWeek(weekStart);
      results.push({ week: weekStart, status: "synced" });
    } catch (error) {
      console.error(`Lunch scheduled sync failed for ${weekStart}:`, error);
      const status =
        error instanceof FlikMenuError && error.status
          ? `error-${error.status}`
          : "error";
      results.push({ week: weekStart, status });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  // Allow Vercel Cron (via CRON_SECRET) or admin auth
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    // Authorized via cron secret
  } else {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const today = formatLunchDate(new Date());
  const currentWeek = getWeekSundayFromDate(today);
  const results = await syncWeeks([
    currentWeek,
    shiftLunchDate(currentWeek, 7),
  ]);
  const success = results[0]?.status === "synced";

  return NextResponse.json(
    {
      success,
      results,
      ...(!success && { error: "Failed to sync lunch menu" }),
    },
    { status: success ? 200 : 502 },
  );
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  // For POST, allow fetching a specific date
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const dateStr = body.date || formatLunchDate(new Date());
  if (typeof dateStr !== "string" || !isLunchDate(dateStr)) {
    return NextResponse.json(
      { error: "Date must use YYYY-MM-DD format" },
      { status: 400 },
    );
  }

  try {
    const weekStart = getWeekSundayFromDate(dateStr);
    await syncLunchWeek(weekStart);
    return NextResponse.json({ success: true, week: weekStart });
  } catch (error) {
    console.error("Lunch sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync lunch menu" },
      { status: 500 },
    );
  }
}
