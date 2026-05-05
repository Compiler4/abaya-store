import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }) {
  await prisma.product.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}