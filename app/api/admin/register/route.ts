import { NextRequest, NextResponse } from "next/server";
import {
  isEmailWhitelisted,
  hashPassword,
  createToken,
  createSessionResponse,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();

  if (!isEmailWhitelisted(normalized)) {
    return NextResponse.json(
      { error: "Email not authorized" },
      { status: 403 }
    );
  }

  const existing = await prisma.admin.findUnique({
    where: { email: normalized },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Account already exists" },
      { status: 409 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  const admin = await prisma.admin.create({
    data: { email: normalized, passwordHash },
  });

  const token = createToken(admin.id, admin.email);
  return createSessionResponse({ success: true, email: admin.email }, token);
}
