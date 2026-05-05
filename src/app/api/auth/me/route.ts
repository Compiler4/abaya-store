import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = verifyToken(token);

    return NextResponse.json({ user });

  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}