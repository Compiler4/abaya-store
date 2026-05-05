"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", text: "New order placed #1024", read: false },
    { id: 2, type: "user", text: "New user registered: John", read: false },
    { id: 3, type: "message", text: "New message from support", read: false },
  ]);

  const [openNotif, setOpenNotif] = useState(false);

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["order", "user", "message"];
      const type = types[Math.floor(Math.random() * types.length)];

      setNotifications((prev) => [
        {
          id: Date.now(),
          type,
          text:
            type === "order"
              ? "New order received"
              : type === "user"
              ? "New user joined"
              : "New message received",
          read: false,
        },
        ...prev,
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* TOP BAR */}
      <div className={styles.topbar}>
        <h2>📊 Admin Dashboard</h2>

        <div className={styles.notificationWrapper}>
          <button
            className={styles.notificationBtn}
            onClick={() => setOpenNotif(!openNotif)}
          >
            🔔
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </button>

          {openNotif && (
            <div className={styles.dropdown}>
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${
                      n.read ? styles.read : ""
                    }`}
                    onClick={() => markAsRead(n.id)}
                  >
                    {n.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className={styles.content}>
        {/* STATS */}
        <div className={styles.grid}>
          <StatCard title="Revenue" value="$12,450" color="blue" />
<StatCard title="Orders" value="320" color="green" />
<StatCard title="Users" value="1,240" color="orange" />
<StatCard title="Products" value="540" color="red" />
        </div>

        {/* CHART CENTER */}
        <div className={styles.chartBox}>
          <h3>📈 Sales Overview</h3>
          <div className={styles.fakeChart}>
           <div className={`${styles.bar} ${styles.h40}`} />
<div className={`${styles.bar} ${styles.h70}`} />
<div className={`${styles.bar} ${styles.h55}`} />
<div className={`${styles.bar} ${styles.h90}`} />
<div className={`${styles.bar} ${styles.h60}`} />
          </div>
        </div>
      </div>
    </div>
  );
}