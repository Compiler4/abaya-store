import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const carts = await prisma.cart.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const cart = carts.flatMap((c) =>
    c.items.map((item) => ({
      id: item.id,
      cartId: c.id,
      userId: c.userId,
      customer: c.user.email,
      phone: c.user.profile?.phone,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
    }))
  );

  return NextResponse.json({ cart });
}

export async function POST(req: Request) {
  const body = await req.json();

  let cart = await prisma.cart.findFirst({
    where: { userId: Number(body.userId) },
  });

  cart ??= await prisma.cart.create({
    data: {
      userId: Number(body.userId),
    },
  });

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: Number(body.productId),
      quantity: Number(body.quantity || 1),
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
