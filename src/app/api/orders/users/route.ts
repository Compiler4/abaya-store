import { NextResponse } from "next/server";

export async function GET() {
  const orders = [
    {
      id: 1,
      productName: "Shoes",
      image: "/shoe.png",
      status: "PENDING",
    },
  ];

  return NextResponse.json({ orders });
}