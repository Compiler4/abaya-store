import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(_req: NextRequest, context: Params) {
  const { id: routeId } = await context.params;
  const id = Number(routeId);

  if (!id) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      orders: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: toUserResponse(user) });
}

export async function PUT(req: NextRequest, context: Params) {
  try {
    const { id: routeId } = await context.params;
    const id = Number(routeId);

    if (!id) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const body = await req.json();

    const email = body.email
      ? String(body.email).trim().toLowerCase()
      : undefined;

    const phone = body.phone !== undefined ? String(body.phone) : undefined;
    const role = body.role !== undefined ? String(body.role) : undefined;
    const address =
      body.address !== undefined ? String(body.address) : undefined;
    const image = body.image !== undefined ? String(body.image) : undefined;
    const password =
      body.password && String(body.password).trim()
        ? String(body.password)
        : undefined;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (email) {
      const emailOwner = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (emailOwner && emailOwner.id !== id) {
        return NextResponse.json(
          { error: "Email already used by another user" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 8)
      : undefined;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(email ? { email } : {}),
        ...(role ? { role } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(hashedPassword ? { password: hashedPassword } : {}),
        ...(phone !== undefined
          ? {
              profile: {
                upsert: {
                  create: {
                    phone,
                    verified: false,
                  },
                  update: {
                    phone,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        profile: true,
        orders: true,
      },
    });

    return NextResponse.json({
      message: "User updated",
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: Params) {
  try {
    const { id: routeId } = await context.params;
    const id = Number(routeId);

    if (!id) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        carts: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.orders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete user with existing orders" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const carts = await tx.cart.findMany({
        where: { userId: id },
        select: { id: true },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: {
            in: carts.map((cart) => cart.id),
          },
        },
      });

      await tx.cart.deleteMany({
        where: { userId: id },
      });

      await tx.profile.deleteMany({
        where: { userId: id },
      });

      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      message: "User deleted",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
