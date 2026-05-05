import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { message, user } = body;

  // 1. Save to admin DB (simulate)
  console.log("ADMIN MESSAGE:", message);

  // 2. WhatsApp format link (simple redirect approach)
  const phone = "255713758200"; // Tanzania format
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  return NextResponse.json({
    success: true,
    whatsapp: waLink,
  });
}