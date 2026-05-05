import { NextRequest, NextResponse } from "next/server";

/**
 * 🧠 TEMP DATABASE (Replace with SQL Server later)
 */
let ORDERS: any[] = [
  {
    id: 1,
    userEmail: "test@example.com",
    productName: "Shoes",
    image: "/shoe.png",
    status: "PENDING",
    deliveredBy: "",
  },
];

/**
 * 🔐 Get logged-in user (FIXED VERSION)
 * Instead of calling external API → uses internal fetch safely
 */
async function getUser(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie") || "";

    const res = await fetch("http://localhost:3000/api/auth/me", {
      headers: {
        cookie,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    return null;
  }
}

/**
 * 📦 GET → Fetch current user's orders
 */
export async function GET(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userOrders = ORDERS.filter(
    (order) => order.userEmail === user.email
  );

  return NextResponse.json({
    success: true,
    orders: userOrders,
  });
}

/**
 * 🛒 POST → Create new order
 */
export async function POST(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  if (!body.productName || !body.image) {
    return NextResponse.json(
      { message: "Missing product data" },
      { status: 400 }
    );
  }

  const newOrder = {
    id: Date.now(),
    userEmail: user.email,
    productName: body.productName,
    image: body.image,
    status: "PENDING",
    deliveredBy: "",
  };

  ORDERS.push(newOrder);

  return NextResponse.json({
    success: true,
    order: newOrder,
  });
}