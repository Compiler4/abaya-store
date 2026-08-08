<<<<<<< HEAD
import { NextResponse } from "next/server";

let messages: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  messages.push({
    id: Date.now(),
    text: body.message,
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ messages });
=======
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const contact = String(body.contact || body.phone || body.email || "").trim();
    const location = String(body.location || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: "Name, contact and message are required" },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        contact,
        location,
        message,
      },
    });

    return NextResponse.json({ contact: contactMessage }, { status: 201 });
  } catch (error) {
    console.error("CREATE MESSAGE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid message id" },
        { status: 400 }
      );
    }

    await prisma.messageReply.deleteMany({
      where: {
        contactMessageId: id,
      },
    });

    const deleted = await prisma.contactMessage.deleteMany({
      where: {
        id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE MESSAGE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
>>>>>>> 2090a59 (new changes)
}
