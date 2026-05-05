import { NextResponse } from "next/server";

let products = [
  {
    id: 1,
    name: "Nike Shoes",
    stock: 10,
    price: 50,
    description: "Comfortable running shoes",
    image: "https://via.placeholder.com/80"
  }
];

// GET ALL
export async function GET() {
  return NextResponse.json(products);
}

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

  const newProduct = {
    id: Date.now(),
    ...body
  };

  products.push(newProduct);
  return NextResponse.json(newProduct);
}

// UPDATE
export async function PUT(req: Request) {
  const body = await req.json();

  products = products.map((p) =>
    p.id === body.id ? { ...p, ...body } : p
  );

  return NextResponse.json({ success: true });
}

// DELETE
export async function DELETE(req: Request) {
  const body = await req.json();

  products = products.filter((p) => p.id !== body.id);

  return NextResponse.json({ success: true });
}