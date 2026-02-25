import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createToken, createSessionResponse } from "@/lib/auth";
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
  const admin = await prisma.admin.findUnique({
    where: { email: normalized },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = createToken(admin.id, admin.email);
  return createSessionResponse({ success: true, email: admin.email }, token);
}
