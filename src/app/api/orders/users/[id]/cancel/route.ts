import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: any) {
  const id = params.id;

  return NextResponse.json({
    message: `Order ${id} cancelled`,
  });
}