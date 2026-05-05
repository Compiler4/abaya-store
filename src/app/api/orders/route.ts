import { NextResponse } from "next/server";

let orders: any[] = [];

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();

  const order = {
    id: Date.now(),
    user: body.user,
    items: body.items,
    status: "Pending",
    payment: "unpaid"
  };

  orders.unshift(order);

  return NextResponse.json(order);
}