import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function toUserResponse(user: any) {
  return {
    id: user.id,
    name: user.email?.split("@")[0] || "User",
    email: user.email,
    phone: user.profile?.phone || "",
    role: user.role,
    address: user.address || "",
    image: user.image || "",
    verified: user.profile?.verified || false,
    createdAt: user.createdAt,
    ordersCount: user.orders?.length || 0,
  };
}

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      orders: true,
    },
  });

  return NextResponse.json({
    users: users.map(toUserResponse),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "");
    const role = String(body.role || "USER");
    const address = String(body.address || "");
    const password = String(body.password || "12345678");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        address,
        profile: {
          create: {
            phone,
            verified: false,
          },
        },
      },
      include: {
        profile: true,
        orders: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created",
        user: toUserResponse(user),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
