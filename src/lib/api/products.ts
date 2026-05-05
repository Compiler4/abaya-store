export async function getProducts() {
  const res = await fetch("/api/products");
  return res.json();
}

export async function createProduct(product: {
  name: string;
  price: number;
  image: string;
}) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return res.json();
}