import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  // 👉 HERE YOU CONNECT TO SQL SERVER
  // Example logic (pseudo):
  /*
    await sql.query(`
      UPDATE Users 
      SET name=@name, email=@email, password=@password, image=@image
      WHERE id=@id
    `)
  */

  console.log("PROFILE UPDATE:", data);

  return NextResponse.json({ success: true });
}