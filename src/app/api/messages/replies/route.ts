<<<<<<< HEAD
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
=======
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const replies = await prisma.messageReply.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("GET REPLIES ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
>>>>>>> 2090a59 (new changes)
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

<<<<<<< HEAD
    if (!body.customerContact || !body.message) {
      return NextResponse.json(
        { error: "Customer contact and message are required" },
=======
    const contactMessageId =
      body.contactMessageId === null || body.contactMessageId === undefined
        ? null
        : Number(body.contactMessageId);

    const customerName = String(body.customerName || "").trim();
    const customerContact = String(body.customerContact || "").trim();
    const message = String(body.message || "").trim();
    const channel = String(body.channel || "DASHBOARD").trim();

    if (!customerName || !customerContact || !message) {
      return NextResponse.json(
        { error: "Customer name, contact and message are required" },
>>>>>>> 2090a59 (new changes)
        { status: 400 }
      );
    }

    const reply = await prisma.messageReply.create({
      data: {
<<<<<<< HEAD
        contactMessageId: body.contactMessageId
          ? Number(body.contactMessageId)
          : null,
        customerName: body.customerName || "Customer",
        customerContact: body.customerContact,
        message: body.message,
        channel: body.channel || "DASHBOARD",
=======
        contactMessageId:
          contactMessageId !== null && !Number.isNaN(contactMessageId)
            ? contactMessageId
            : null,
        customerName,
        customerContact,
        message,
        channel,
        read: false,
>>>>>>> 2090a59 (new changes)
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
<<<<<<< HEAD
    console.error("Create message reply error:", error);

    return NextResponse.json(
      { error: "Failed to send reply" },
=======
    console.error("CREATE REPLY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create reply" },
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
        { error: "Invalid reply id" },
        { status: 400 }
      );
    }

    const deleted = await prisma.messageReply.deleteMany({
      where: {
        id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE REPLY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete reply" },
>>>>>>> 2090a59 (new changes)
      { status: 500 }
    );
  }
}
