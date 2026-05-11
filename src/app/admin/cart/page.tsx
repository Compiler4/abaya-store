"use client";

import {
  Boxes,
  Calculator,
  Layers,
  Search,
  ShoppingCart,
  Trash2,
  Wallet,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  customer?: string;
  phone?: string;
};

export default function CartPage() {
  const searchId = useId();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  const fetchCart = async () => {
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = await res.json();

    setCart(Array.isArray(data) ? data : data.cart || data.data || []);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const filteredCart = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return cart;

    return cart.filter((item) => {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.customer?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term) ||
        String(item.price || "").includes(term) ||
        String(item.quantity || "").includes(term)
      );
    });
  }, [cart, search]);

  const total = filteredCart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const totalItems = filteredCart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  const deleteCartItem = async (id: string | number) => {
    const confirmed = confirm("Remove this item from cart?");

    if (!confirmed) return;

    await fetch(`/api/cart/${id}`, {
      method: "DELETE",
    });

    await fetchCart();
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Cart</p>
          <h1>
            <ShoppingCart size={30} /> Customer Cart Items
          </h1>
        </div>

        <span className={styles.status}>
          <Wallet size={14} /> {total.toLocaleString()} TZS
        </span>
      </div>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>
            <Boxes size={22} /> Cart Products
          </h2>
          <p>{filteredCart.length} product rows</p>
        </div>

        <div className={styles.card}>
          <h2>
            <Layers size={22} /> Total Quantity
          </h2>
          <p>{totalItems} items</p>
        </div>

        <div className={styles.card}>
          <h2>
            <Calculator size={22} /> Total Value
          </h2>
          <p>{total.toLocaleString()} TZS</p>
        </div>
      </section>

      <section className={styles.card}>
        <label className={styles.fieldLabel} htmlFor={searchId}>
          <Search size={14} /> Search cart
        </label>

        <input
          id={searchId}
          className={styles.input}
          placeholder="Search by product, customer, phone, price, or quantity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.productGrid}>
          {filteredCart.map((item, index) => (
            <div key={item.id} className={styles.productCard}>
              <div className={styles.rowBetween}>
                <span className={styles.status}>#{index + 1}</span>

                <button
                  className={`${styles.iconAction} ${styles.dangerAction}`}
                  onClick={() => deleteCartItem(item.id)}
                  aria-label={`Delete ${item.name}`}
                  title="Delete item"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <img src={item.image || "/placeholder.png"} alt={item.name} />

              <h3>{item.name}</h3>

              <p>
                <Layers size={14} /> Quantity: {item.quantity || 1}
              </p>

              <p>
                <Wallet size={14} /> Price:{" "}
                {Number(item.price || 0).toLocaleString()} TZS
              </p>

              {item.customer && <p>Customer: {item.customer}</p>}
              {item.phone && <p>Phone: {item.phone}</p>}

              <strong>
                {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}{" "}
                TZS
              </strong>
            </div>
          ))}

          {filteredCart.length === 0 && (
            <div className={styles.card}>
              <h2>
                <ShoppingCart size={22} /> Empty cart
              </h2>
              <p>No cart items match your search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
