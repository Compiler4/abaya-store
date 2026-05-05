import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const folder = path.resolve("./public");

    const files = fs.readdirSync(folder);

    const images = files
      .filter((file) =>
        /\.(jpg|jpeg|png|webp)$/i.test(file) &&
        file.toLowerCase().includes("abaya") // ✅ ONLY ABAYA IMAGES
      )
      .map((file, index) => ({
        id: index + 1,
        name: `Luxury Abaya ${index + 1}`,
        price: 120,
        image: `/${file}`,
      }));

    return NextResponse.json(images);
  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}