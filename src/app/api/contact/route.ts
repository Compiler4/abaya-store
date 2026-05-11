import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    contacts: contacts.map((c) => ({
      id: c.id,
      name: c.name,
      contact: c.contact,
      phone: c.contact,
      email: c.contact,
      location: c.location,
      message: c.message,
      createdAt: c.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const message = await prisma.contactMessage.create({
    data: {
      name: body.name,
      contact: body.contact || body.email || body.phone,
      location: body.location || "",
      message: body.message,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
