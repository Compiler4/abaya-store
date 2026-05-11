"use client";

import {
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  PackageCheck,
  PackageOpen,
  Phone,
  ReceiptText,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type Order = {
  id: string | number;
  customer: string;
  phone?: string;
  location?: string;
  total: number;
  status: "pending" | "delivered" | "completed";
  orderedAt?: string;
  completedAt?: string;
};

function StatusIcon({ status }: { status: Order["status"] }) {
  if (status === "completed") return <CheckCircle2 size={14} />;
  if (status === "delivered") return <Truck size={14} />;
  return <Clock3 size={14} />;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setOrders(Array.isArray(data) ? data : data.orders || data.data || [])
      );
  }, []);

  const filtered = useMemo(() => {
    return filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Orders</p>
          <h1>
            <ReceiptText size={30} /> Customer Orders
          </h1>
        </div>

        <div className={styles.filterBox}>
          <label className={styles.fieldLabel} htmlFor="order-status-filter">
            <Filter size={14} /> Filter orders by status
          </label>

          <select
            id="order-status-filter"
            className={styles.inputSmall}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <section className={styles.grid}>
        {filtered.map((o) => (
          <div key={o.id} className={styles.card}>
            <div className={styles.rowBetween}>
              <h2>
                <PackageOpen size={21} /> Order #{o.id}
              </h2>

              <span className={`${styles.status} ${styles[o.status]}`}>
                <StatusIcon status={o.status} />
                {o.status}
              </span>
            </div>

            <p>
              <User size={15} />
              <strong>Customer:</strong> {o.customer}
            </p>

            <p>
              <Phone size={15} />
              <strong>Phone:</strong> {o.phone || "Not added"}
            </p>

            <p>
              <MapPin size={15} />
              <strong>Location:</strong> {o.location || "Not added"}
            </p>

            <p>
              <Wallet size={15} />
              <strong>Total:</strong>{" "}
              {Number(o.total || 0).toLocaleString()} TZS
            </p>

            <small className={styles.metaLine}>
              <Clock3 size={14} />
              Ordered:{" "}
              {o.orderedAt
                ? new Date(o.orderedAt).toLocaleString()
                : "Recent"}
            </small>

            <small className={styles.metaLine}>
              <PackageCheck size={14} />
              Completed:{" "}
              {o.completedAt
                ? new Date(o.completedAt).toLocaleString()
                : "Not completed"}
            </small>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.card}>
            <h2>
              <PackageOpen size={22} /> No orders found
            </h2>
            <p>No orders match the selected status.</p>
          </div>
        )}
      </section>
    </main>
  );
}
