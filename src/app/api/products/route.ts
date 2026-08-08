import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

<<<<<<< HEAD
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
=======
function parseJsonArray(value: FormDataEntryValue | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = String(form.get("name") || "").trim();
    const price = Number(form.get("price") || 0);
    const description = String(form.get("description") || "").trim();
    const category = String(form.get("category") || "").trim();
    const stock = Number(form.get("stock") || 0);
    const sizes = parseJsonArray(form.get("sizes"));
    const colors = parseJsonArray(form.get("colors"));
    const imageUrl = String(form.get("imageUrl") || "").trim();
    const imageFile = form.get("image") as File | null;

    if (!name || !price || !description || (!imageFile && !imageUrl)) {
      return NextResponse.json(
        { error: "Name, price, description and image are required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid number" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a valid number" },
        { status: 400 }
      );
    }

    let image = imageUrl;

    if (imageFile && imageFile.size > 0) {
      await mkdir(path.join(process.cwd(), "public", "uploads"), {
        recursive: true,
      });

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-");
      const fileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      await writeFile(filePath, buffer);

      image = `/uploads/${fileName}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        category,
        stock,
        image,
        sizes,
        colors,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
>>>>>>> 2090a59 (new changes)
}
