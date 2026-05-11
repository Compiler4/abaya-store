import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
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
      payment: true,
    },
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status.toLowerCase(),
      customer: order.customer,
      phone: order.phone,
      location: order.location,
      address: order.address,
      quantity: order.quantity,
      orderedAt: order.createdAt,
      createdAt: order.createdAt,
      completedAt: order.status === "COMPLETED" ? order.createdAt : null,
      payment: order.payment,
      items: order.items,
      user: {
        id: order.user.id,
        email: order.user.email,
        phone: order.user.profile?.phone,
      },
    })),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: {
      total: Number(body.total),
      status: body.status || "PENDING",
      address: body.address,
      customer: body.customer,
      phone: body.phone,
      location: body.location,
      userId: Number(body.userId),
      quantity: Number(body.quantity || 1),
      items: {
        create: body.items?.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity || 1),
          price: Number(item.price),
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
