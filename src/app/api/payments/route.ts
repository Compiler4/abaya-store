import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: true,
    },
  });

  return NextResponse.json({
    payments: payments.map((p) => ({
      id: p.id,
      orderId: p.orderId,
      customer: p.order.customer,
      method: p.method,
      status: p.status,
      amount: p.order.total,
      createdAt: p.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const payment = await prisma.payment.create({
    data: {
      orderId: Number(body.orderId),
      method: body.method,
      status: body.status || "UNPAID",
    },
  });

  return NextResponse.json({ payment }, { status: 201 });
}
