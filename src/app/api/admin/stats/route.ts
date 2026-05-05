import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany();
  const users = await prisma.user.count();

  const sales = orders.reduce((sum, o) => sum + o.total, 0);

  return NextResponse.json({
    sales,
    orders: orders.length,
    users,
  });
}