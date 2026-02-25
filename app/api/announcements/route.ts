import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const showAll = request.nextUrl.searchParams.get("all") === "true";

  if (showAll) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(announcements);
  }

  const today = new Date().toISOString().split("T")[0];
  const announcements = await prisma.announcement.findMany({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, body: announcementBody, type, pinned, expiresAt } = body;

  if (!title || !announcementBody || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validTypes = ["info", "warning", "urgent"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid announcement type" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const activeCount = await prisma.announcement.count({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
    },
  });
  if (activeCount >= 4) {
    return NextResponse.json({ error: "Maximum of 4 active announcements allowed" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      body: announcementBody,
      type,
      pinned: pinned ?? false,
      active: true,
      expiresAt: expiresAt || null,
    },
  });
  return NextResponse.json(announcement, { status: 201 });
}
