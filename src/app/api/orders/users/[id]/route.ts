import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: any) {
  const id = params.id;

  // delete from DB
  return NextResponse.json({ success: true, id });
}