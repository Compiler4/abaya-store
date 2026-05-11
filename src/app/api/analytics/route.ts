import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [orders, users, products, messages, payments] = await Promise.all([
    prisma.order.findMany(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.contactMessage.count(),
    prisma.payment.findMany({
      include: {
        order: true,
      },
    }),
  ]);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  const completed = orders.filter((o) => o.status === "COMPLETED").length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  return NextResponse.json({
    data: {
      revenue,
      users,
      products,
      messages,
      orders: orders.length,
      completed,
      pending,
      delivered,
      payments: payments.length,
      conversion: users ? Math.round((orders.length / users) * 100) : 0,
      visits: users + messages + orders.length,
      sales: [40, 70, 55, 90, 60],
    },
  });
}
