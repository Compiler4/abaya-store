"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

import Dashboard from "./dashboard/page";
import Products from "./products/page";
import Orders from "./orders/page";
import Users from "./users/page";
import Customers from "./customers/page";
import Messages from "./messages/page";
import Cart from "./cart/page";
import Analytics from "./analytics/page";
import Settings from "./settings/page";
import Profile from "./profile/page";
import Payments from "./payments/page";

import styles from "./dashboard.module.css";

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    products: <Products />,
    orders: <Orders />,
    users: <Users />,
    customers: <Customers />,
    messages: <Messages />,
    cart: <Cart />,
    analytics: <Analytics />,
    payments: <Payments />,
    settings: <Settings />,
    profile: <Profile />,
  };

  return (
    <main className={styles.adminShell}>
      <div className={styles.leftPane}>
        <Sidebar setPage={setPage} activePage={page} />
      </div>

      <section className={styles.rightPane}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            className={styles.pageView}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.985 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {pages[page] || <Dashboard />}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
