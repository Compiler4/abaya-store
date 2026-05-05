import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

const attempts = new Map<string, number>();

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

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { email, password, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ⚡ CHECK USER (FAST SINGLE QUERY)
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

    // ⚡ FASTER HASH (reduce cost from 10 → 8)
    const hashed = await bcrypt.hash(password, 8);

    // ⚡ SINGLE TRANSACTION (VERY IMPORTANT FOR SPEED)
    const user = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          email,
          password: hashed,
          role: "USER",
          profile: {
            create: {
              phone: phone || "",
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
    });

    // ⚡ DO NOT BLOCK RESPONSE WITH LOGIC
    // (run async side-effect outside critical path)
    setTimeout(() => {
      console.log(`OTP for ${email}: ${otp}`);
    }, 0);

    const token = signToken(user);

    return NextResponse.json({
      message: "OK",
      token,
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}