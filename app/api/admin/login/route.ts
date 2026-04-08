import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createPendingToken, createPendingResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOtp, sendOtpEmail } from "@/lib/email";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 5 login attempts per IP per 15 minutes
  const ip = getClientIp(request);
  const rl = rateLimit(`login:${ip}`, { limit: 5, windowSeconds: 900 });
  if (!rl.allowed) {
    return rateLimitResponse(rl.resetAt);
  }

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

  const otp = generateOtp();
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      otpCode: otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      otpAttempts: 0,
    },
  });

  await sendOtpEmail(admin.email, otp);

  const pendingToken = createPendingToken(admin.id, admin.email);
  return createPendingResponse(
    { success: true, requiresOtp: true },
    pendingToken
  );
}
