"use client";

import { useEffect, useState } from "react";
import styles from "./cart.module.css";

type Item = {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image?: string;
  };
};

export default function CartPage() {
  const [cart, setCart] = useState<{ items: Item[] } | null>(null);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then(setCart);
  }, []);

  const updateQty = (id: number, change: number) => {
    setCart((prev: any) => ({
      ...prev,
      items: prev.items.map((item: Item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      ),
    }));
  };

  const total =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  if (!cart) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🛒 My Cart</h1>

      <div className={styles.container}>
        {/* ITEMS */}
        <div className={styles.items}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.card}>
              <img
                src={item.product.image || "/placeholder.png"}
                alt={item.product.name}
                className={styles.image}
              />

              <div className={styles.info}>
                <h3>{item.product.name}</h3>
                <p className={styles.price}>
                  ${item.product.price}
                </p>

                <div className={styles.qty}>
                  <button onClick={() => updateQty(item.id, -1)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <p>Total: ${total.toFixed(2)}</p>

          <button
            className={styles.checkout}
            onClick={async () => {
              await fetch("/api/orders", { method: "POST" });
              alert("Order placed successfully 🎉");
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}