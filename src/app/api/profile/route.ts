import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId") || 1);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  return NextResponse.json({
    profile: user
      ? {
          id: user.id,
          email: user.email,
          address: user.address,
          role: user.role,
          image: user.image,
          phone: user.profile?.phone || "",
          verified: user.profile?.verified || false,
        }
      : null,
  });
}

export async function PUT(req: Request) {
  const form = await req.formData();

  const userId = Number(form.get("userId") || 1);
  const email = String(form.get("email") || "");
  const address = String(form.get("address") || "");
  const phone = String(form.get("phone") || "");
  const role = String(form.get("role") || "USER");
  const imageFile = form.get("photo") as File | null;

  let image: string | undefined;

  if (imageFile && imageFile.size > 0) {
    await mkdir(path.join(process.cwd(), "public", "uploads"), {
      recursive: true,
    });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;

    await writeFile(
      path.join(process.cwd(), "public", "uploads", fileName),
      buffer
    );

    image = `/uploads/${fileName}`;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      address,
      role,
      ...(image ? { image } : {}),
      profile: {
        upsert: {
          create: { phone },
          update: { phone },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return NextResponse.json({ profile: user });
}
