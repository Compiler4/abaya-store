import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();

  // ✅ must be logged in AND must be normal user
  if (!user?.id || user.role !== "user") {
    return NextResponse.json({ items: [] }, { status: 401 });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(req: Request) {
  const user = await getUser();

  // ✅ same protection
  if (!user?.id || user.role !== "user") {
    return NextResponse.json(
      { error: "Only users can access cart" },
      { status: 401 }
    );
  }

  const { productId, quantity } = await req.json();

  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  return NextResponse.json(item);
}