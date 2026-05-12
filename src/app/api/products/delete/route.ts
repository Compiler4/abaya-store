import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    { error: "Use /api/products/delete/[id] instead" },
    { status: 400 }
  );
}
