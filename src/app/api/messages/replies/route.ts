import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contact = searchParams.get("contact");

  const replies = await prisma.messageReply.findMany({
    where: contact
      ? {
          customerContact: contact,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ replies });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerContact || !body.message) {
      return NextResponse.json(
        { error: "Customer contact and message are required" },
        { status: 400 }
      );
    }

    const reply = await prisma.messageReply.create({
      data: {
        contactMessageId: body.contactMessageId
          ? Number(body.contactMessageId)
          : null,
        customerName: body.customerName || "Customer",
        customerContact: body.customerContact,
        message: body.message,
        channel: body.channel || "DASHBOARD",
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Create message reply error:", error);

    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
