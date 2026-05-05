"use client";

import { useEffect, useState } from "react";
import styles from "./orders.module.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className={styles.page}>
      <h1>Orders Dashboard</h1>

      <div className={styles.grid}>
        {orders.map((order) => (
          <div key={order.id} className={styles.card}>
            
            <h3>Order #{order.id}</h3>
            <p><b>Total:</b> ${order.total}</p>
            <p><b>Address:</b> {order.address}</p>

            <div className={styles.items}>
              {order.items?.map((item: any, i: number) => (
                <div key={i} className={styles.item}>
                  {item.name} - ${item.price}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}