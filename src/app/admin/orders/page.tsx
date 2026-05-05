"use client";

import { useMemo, useState } from "react";
import styles from "./orders.module.css";

type Order = {
  id: number;
  userId: number;
  customer: string;
  status: "Pending" | "Delivered" | "Completed" | "Not Complete";
  total: number;
  date: string;
};

type User = {
  id: number;
  name: string;
  role: "admin" | "user";
};

export default function Orders() {
  // 👤 Mock logged-in user (replace with auth later)
  const currentUser: User = {
    id: 1,
    name: "John Doe",
    role: "user", // change to "admin" to see all orders
  };

  // 📦 Mock orders (replace with API later)
  const [orders] = useState<Order[]>([
    { id: 1, userId: 1, customer: "John Doe", status: "Pending", total: 120, date: "2026-05-01" },
    { id: 2, userId: 2, customer: "Mary Jane", status: "Delivered", total: 340, date: "2026-05-02" },
    { id: 3, userId: 1, customer: "John Doe", status: "Completed", total: 80, date: "2026-05-03" },
    { id: 4, userId: 3, customer: "Alex Kim", status: "Not Complete", total: 210, date: "2026-05-04" },
  ]);

  const [filter, setFilter] = useState("All");

  // 🔐 Role-based filtering
  const visibleOrders = useMemo(() => {
    let data =
      currentUser.role === "admin"
        ? orders
        : orders.filter((o) => o.userId === currentUser.id);

    switch (filter) {
      case "Pending":
        return data.filter((o) => o.status === "Pending");
      case "Delivered":
        return data.filter((o) => o.status === "Delivered");
      case "Completed":
        return data.filter((o) => o.status === "Completed");
      case "Not Complete":
        return data.filter((o) => o.status === "Not Complete");
      default:
        return data;
    }
  }, [filter, orders, currentUser]);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>📦 Orders Dashboard</h1>
        <p>Welcome, {currentUser.name}</p>
      </div>

      {/* FILTER BUTTONS */}
      <div className={styles.filters}>
        {["All", "Pending", "Delivered", "Completed", "Not Complete"].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ORDERS GRID */}
      <div className={styles.grid}>
        {visibleOrders.map((order) => (
          <div key={order.id} className={styles.card}>
            <div className={styles.top}>
              <h3>Order #{order.id}</h3>
              <span className={`${styles.badge} ${styles[order.status.replace(" ", "")]}`}>
                {order.status}
              </span>
            </div>

            <div className={styles.body}>
              <p><b>Customer:</b> {order.customer}</p>
              <p><b>Date:</b> {order.date}</p>
              <p><b>Total:</b> ${order.total}</p>
            </div>

            <div className={styles.footer}>
              <button className={styles.viewBtn}>View</button>
              <button className={styles.actionBtn}>Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}