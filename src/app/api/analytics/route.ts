import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    daily: [120, 200, 150, 300],
    monthly: [4000, 6000, 8000, 7500],
    yearly: [50000, 72000, 90000]
  });
}