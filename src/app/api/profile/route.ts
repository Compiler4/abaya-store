import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password, photo } = body;

  // TODO: save into DB (SQL Server / PostgreSQL)
  console.log("Updated profile:", body);

  return NextResponse.json({
    success: true,
    message: "Profile updated",
  });
}