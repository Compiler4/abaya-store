"use client";

import { useEffect, useState } from "react";
import { readStoredJson } from "@/lib/safe-storage";
import styles from "./cart.module.css";

type Item = {
  id: number | string;
  productId?: number | string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image?: string;
  };
};

type StoredUser = {
  id?: number | string;
  address?: string;
  location?: string;
  email?: string;
  phone?: string;
};

function toId(value: unknown, fallback: string): number | string {
  return typeof value === "number" || typeof value === "string"
    ? value
    : fallback;
}

function normalizeCartItems(data: unknown): Item[] {
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  const list = Array.isArray(data)
    ? data
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.cart)
        ? record.cart
        : Array.isArray(record.data)
          ? record.data
          : [];

  return list.map((item, index) => {
    const row = item as Record<string, unknown>;
    const product =
      row.product && typeof row.product === "object"
        ? (row.product as Record<string, unknown>)
        : row;

    return {
      id: toId(row.id, `${toId(row.productId, "item")}-${index}`),
      productId: toId(row.productId ?? product.id, ""),
      quantity: Number(row.quantity || 1),
      product: {
        name: String(product.name || "Product"),
        price: Number(product.price || 0),
        image: String(product.image || "/placeholder.png"),
      },
    };
  });
}

export default function CartPage() {
  const [cart, setCart] = useState<Item[] | null>(null);

  useEffect(() => {
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setCart(normalizeCartItems(data)))
      .catch(() => setCart([]));
  }, []);

  const updateQty = (id: number | string, change: number) => {
    setCart((prev) =>
      (prev || []).map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const total =
    cart?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  const checkout = async () => {
    if (!cart?.length) return;

    const user = readStoredJson<StoredUser | null>("user", null, {
      clearInvalid: true,
    });

    if (!user?.id) {
      alert("Please login before checkout.");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total,
        status: "PENDING",
        address: user.address || user.location || "Not added",
        customer: user.email || "Customer",
        phone: user.phone || "Not added",
        location: user.location || user.address || "Not added",
        userId: user.id,
        quantity: cart.length,
        items: cart.map((item) => ({
          productId: Number(item.productId || item.id),
          quantity: item.quantity,
          price: item.product.price,
        })),
      }),
    });

    if (!res.ok) {
      alert("Checkout failed. Please try again.");
      return;
    }

    alert("Order placed successfully");
  };

  if (!cart) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Cart</h1>

      <div className={styles.container}>
        <div className={styles.items}>
          {cart.length === 0 && (
            <p className={styles.loading}>Your cart is empty.</p>
          )}

          {cart.map((item) => (
            <div key={item.id} className={styles.card}>
              <img
                src={item.product.image || "/placeholder.png"}
                alt={item.product.name}
                className={styles.image}
              />

              <div className={styles.info}>
                <h3>{item.product.name}</h3>
                <p className={styles.price}>{item.product.price} TZS</p>

                <div className={styles.qty}>
                  <button onClick={() => updateQty(item.id, -1)} type="button">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)} type="button">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <p>Total: {total.toLocaleString()} TZS</p>

          <button
            className={styles.checkout}
            onClick={checkout}
            disabled={cart.length === 0}
            type="button"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
