import { prisma } from "@/lib/prisma";
import { AuthConfigurationError, signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

function normalizeRole(role: unknown): string {
  return String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function getDashboardPath(role: unknown): string {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "SUPER_ADMIN":
    case "SUPERADMIN":
      return "/super-admin/dashboard";

    case "COMPANY_ADMIN":
    case "ADMIN":
      return "/company-admin/dashboard";

    case "ACCOUNTANT":
      return "/accountant/dashboard";

    case "STAFF":
      return "/staff/dashboard";

    case "BROKER":
      return "/broker/dashboard";

    case "GPS_MANAGER":
    case "GPSMANAGER":
      return "/gps-manager/dashboard";

    case "DEVELOPER":
      return "/developer/dashboard";

    default:
      return "/";
  }
}

function getServerError(error: unknown) {
  if (error instanceof AuthConfigurationError) {
    return {
      code: "AUTH_NOT_CONFIGURED",
      message:
        "Authentication is not configured. Add JWT_SECRET in your environment.",
    };
  }

  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("DATABASE_URL") ||
    message.includes("Can't reach database server") ||
    message.includes("Environment variable not found") ||
    message.includes("P1001")
  ) {
    return {
      code: "DATABASE_NOT_CONFIGURED",
      message:
        "Database is not configured or reachable. Check DATABASE_URL in your environment.",
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
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "The email address or password is incorrect.",
        },
        {
          status: 401,
        }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          error: "This account does not have a password configured.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          error: "The email address or password is incorrect.",
        },
        {
          status: 401,
        }
      );
    }

    const role = normalizeRole(user.role);

    const dashboardPath = getDashboardPath(role);

    const safeUser = {
      id: user.id,
      email: user.email,
      role,
    };

    const token = signToken(safeUser);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: safeUser,
        dashboardPath,
      },
      {
        status: 200,
      }
    );

    response.cookies.set({
      name: "token",
      value: token,
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
      {
        success: false,
        error: serverError.message,
        code: serverError.code,
      },
      {
        status: 500,
      }
    );
  }
}