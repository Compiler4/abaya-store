"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

import Dashboard from "./dashboard/page";
import Products from "./products/page";
import Orders from "./orders/page";
import Users from "./users/page";
import Cart from "./cart/page";
import Analytics from "./analytics/page";
import Settings from "./settings/page";
import Profile from "./profile/page";
import Payments from "./payments/page";

// FIXED IMPORT
import socket from "@/lib/socket";

import styles from "./dashboard.module.css";

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "users":
        return <Users />;
      case "cart":
        return <Cart />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      case "payments":
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <Sidebar setPage={setPage} />

      {/* MAIN AREA (CENTERED CONTENT) */}
      <div className={styles.main}>
        <div className={styles.content}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}