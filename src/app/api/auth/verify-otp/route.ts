import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user || user.profile?.otp !== otp) {
    return NextResponse.json(
      { error: "Invalid OTP" },
      { status: 400 }
    );
  }

  await prisma.profile.update({
    where: { userId: user.id },
    data: { verified: true },
  });

  return NextResponse.json({ message: "Verified successfully" });
}