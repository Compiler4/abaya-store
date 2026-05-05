import { NextResponse } from "next/server";

// 🔥 SIMPLE MOCK PAYMENT (replace with Stripe later)
export async function POST(req: Request) {
  const { amount } = await req.json();

  return NextResponse.json({
    success: true,
    message: "Payment simulated",
    amount,
  });
}