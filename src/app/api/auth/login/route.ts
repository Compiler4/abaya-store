import { prisma } from "@/lib/prisma";
import { AuthConfigurationError, signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

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
    code: "LOGIN_FAILED",
    message: "Server error. Please try again later.",
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as LoginBody | null;
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = signToken(safeUser);
    const response = NextResponse.json({ user: safeUser });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    const serverError = getServerError(error);

    return NextResponse.json(
      { error: serverError.message, code: serverError.code },
      { status: 500 }
    );
  }
}
