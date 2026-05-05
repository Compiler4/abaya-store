"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const cart = useCart((s) => s.cart);
  const clearCart = useCart((s) => s.clearCart);

  const [address, setAddress] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
    await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items: cart,
        total,
        address,
        userId: 1,
      }),
    });

    clearCart();
    alert("Order placed!");
  };

  return (
    <div className={styles.page}>
      <h1>Checkout</h1>

      {/* ORDER SUMMARY */}
      <div className={styles.box}>
        {cart.map((item) => (
          <div key={item.id}>
            {item.name} - ${item.price}
          </div>
        ))}

        <h3>Total: ${total}</h3>
      </div>

      {/* ADDRESS */}
      <div className={styles.box}>
        <input
          placeholder="Delivery address"
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button onClick={placeOrder} className={styles.button}>
        Place Order
      </button>
    </div>
  );
}