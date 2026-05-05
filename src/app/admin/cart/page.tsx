"use client";

import styles from "./cart.module.css";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";

export default function Cart() {
  const cart = [
    { id: 1, product: "Nike Shoes", qty: 2, price: 120 },
    { id: 2, product: "Adidas Hoodie", qty: 1, price: 80 },
    { id: 3, product: "Puma Cap", qty: 3, price: 25 },
  ];

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* TITLE */}
        <h1 className={styles.title}>
          <FaShoppingCart /> Your Cart
        </h1>

        {/* CART ITEMS */}
        <div className={styles.cartGrid}>
          {cart.map((c) => (
            <div key={c.id} className={styles.card}>
              
              {/* HEADER */}
              <div className={styles.cardHeader}>
                <h2>{c.product}</h2>

                <button
                  className={styles.deleteBtn}
                  aria-label="Remove item"
                  title="Remove item"
                  type="button"
                >
                  <FaTrash />
                </button>
              </div>

              {/* BODY */}
              <div className={styles.cardBody}>
                <p className={styles.price}>${c.price}</p>

                <div className={styles.qtyControl}>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
                  >
                    <FaMinus />
                  </button>

                  <span>{c.qty}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    title="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* FOOTER */}
              <div className={styles.cardFooter}>
                <span>Total: ${c.price * c.qty}</span>
              </div>

            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <h2>Total: ${total}</h2>

          <button
            className={styles.checkoutBtn}
            type="button"
            aria-label="Proceed to checkout"
          >
            Checkout
          </button>
        </div>

      </div>
    </div>
  );
}