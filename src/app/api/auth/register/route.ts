import { prisma } from "@/lib/prisma";
import { AuthConfigurationError, signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const attempts = new Map<string, number>();

type RegisterBody = {
  email?: unknown;
  password?: unknown;
  phone?: unknown;
};

function isRateLimited(ip: string) {
  const now = Date.now();
  const last = attempts.get(ip);

  if (last && now - last < 60 * 1000) return true;

  attempts.set(ip, now);
  return false;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getServerError(error: unknown) {
  if (error instanceof AuthConfigurationError) {
    return {
      code: "AUTH_NOT_CONFIGURED",
      message:
        "Authentication is not configured. Add JWT_SECRET in your hosting environment.",
    };
  }

  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("DATABASE_URL") ||
    message.includes("Can't reach database server") ||
    message.includes("Environment variable not found")
  ) {
    return {
      code: "DATABASE_NOT_CONFIGURED",
      message:
        "Database is not configured or reachable. Check DATABASE_URL in your hosting environment.",
    };
  }

  return {
    code: "REGISTRATION_FAILED",
    message: "Server error. Please try again later.",
  };
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as RegisterBody | null;
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const hashed = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "USER",
        profile: {
          create: {
            phone,
            otp,
            verified: false,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log(`OTP for ${email}: ${otp}`);

    const token = signToken(user);
    const response = NextResponse.json({
      message: "OK",
      token,
      user,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    const serverError = getServerError(error);

    return NextResponse.json(
      { error: serverError.message, code: serverError.code },
      { status: 500 }
    );
  }
}
