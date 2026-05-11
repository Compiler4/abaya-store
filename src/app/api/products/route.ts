import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const form = await req.formData();

  const name = String(form.get("name") || "");
  const price = Number(form.get("price") || 0);
  const description = String(form.get("description") || "");
  const category = String(form.get("category") || "");
  const stock = Number(form.get("stock") || 0);
  const sizes = String(form.get("sizes") || "[]");
  const colors = String(form.get("colors") || "[]");
  const imageFile = form.get("image") as File | null;

  if (!name || !price || !imageFile) {
    return NextResponse.json(
      { error: "Name, price and image are required" },
      { status: 400 }
    );
  }

  await mkdir(path.join(process.cwd(), "public", "uploads"), {
    recursive: true,
  });

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  await writeFile(filePath, buffer);

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      category,
      stock,
      image: `/uploads/${fileName}`,
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
