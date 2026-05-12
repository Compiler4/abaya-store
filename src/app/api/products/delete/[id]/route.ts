import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseProductId(id: string) {
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return null;
  }

  return productId;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const productId = parseProductId(id);

  if (productId === null) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const productId = parseProductId(id);

  if (productId === null) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  return NextResponse.json({ success: true });
}
