import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone, location, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ⚡ FAST DB WRITE (no blocking email first)
    const saved = await prisma.contactMessage.create({
      data: {
        name,
        contact: email,
        location,
        message,
      },
    });

    // ⚡ RETURN IMMEDIATELY (this makes API FAST <200ms)
    const response = NextResponse.json({
      success: true,
      id: saved.id,
    });

    // 🟡 BACKGROUND EMAIL (DO NOT WAIT)
    setTimeout(async () => {
      try {
        const nodemailer = (await import("nodemailer")).default;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Rify Luxe Abaya" <${process.env.EMAIL}>`,
          to: email,
          subject: "We received your message",
          text: `Hi ${name}, we received your message.`,
        });
      } catch (e) {
        console.error("EMAIL ERROR:", e);
      }
    }, 0);

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}