"use client";

import { useState } from "react";
import styles from "./cart.module.css";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CART BUTTON */}
      <button
        className={styles.cartBtn}
        onClick={() => setOpen(true)}
      >
        🛒 Cart
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`${styles.drawer} ${
          open ? styles.open : ""
        }`}
      >
        <h3>Your Cart</h3>

        <p>No items yet</p>

        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
    </>
  );
}