import { NextResponse } from "next/server";

let settings = {
  allowOrders: true,
  allowRegistration: true,
  maintenance: false,
  requireAdminApproval: true,
};

export async function GET() {
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  settings = await req.json();
  return NextResponse.json({ settings });
}
