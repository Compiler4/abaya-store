import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = signToken(safeUser);

    // 🔥 IMPORTANT FIX: create response FIRST
    const response = NextResponse.json({
      user: safeUser,
    });

    // 🔐 then attach cookie properly
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false, // localhost safe
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}