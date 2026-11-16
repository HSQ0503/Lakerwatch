import { dashboardCacheOptions } from "@/lib/dashboard-cache";
import { NextRequest, NextResponse } from "next/server";
import { applyHomecomingCalendarUpdates } from "@/lib/homecoming2026";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const events = await prisma.schoolEvent.findMany({
    orderBy: { date: "asc" },
    select: {
      id: true,
      sourceKey: true,
      date: true,
      name: true,
      description: true,
      type: true,
      endDate: true,
    },
  });
  const publicEvents = applyHomecomingCalendarUpdates(events).map(({ sourceKey, ...event }) => {
    void sourceKey;
    return event;
  });
  return NextResponse.json(publicEvents, dashboardCacheOptions(request));
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorizedResponse();

  const body = await request.json();
  const { date, name, description, type, endDate } = body;

  if (!date || !name || !description || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validTypes = ["no-school", "early-dismissal", "event", "exam", "deadline"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const event = await prisma.schoolEvent.create({
    data: {
      date,
      name,
      description,
      type,
      endDate: endDate || null,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
