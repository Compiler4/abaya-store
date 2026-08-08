"use client";

import { AnimatePresence, motion } from "framer-motion";
<<<<<<< HEAD
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
=======
import {
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  PackageSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  UserCog,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

import Analytics from "./analytics/page";
import Cart from "./cart/page";
import Customers from "./customers/page";
import Dashboard from "./dashboard/page";
import Messages from "./messages/page";
import Orders from "./orders/page";
import Payments from "./payments/page";
import Products from "./products/page";
import Profile from "./profile/page";
import SettingsPage from "./settings/page";
import Users from "./users/page";

import styles from "./dashboard.module.css";

type PageKey =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "messages"
  | "users"
  | "cart"
  | "analytics"
  | "payments"
  | "settings"
  | "profile";

type IconComponent = ComponentType<{
  size?: number;
  strokeWidth?: number;
}>;

type NavigationItem = {
  key: PageKey;
  label: string;
  description: string;
  icon: IconComponent;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

type SessionUser = {
  name?: string;
  email?: string;
};

const navigation: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        description: "Business overview",
        icon: LayoutDashboard,
      },
      {
        key: "analytics",
        label: "Analytics",
        description: "Sales performance",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Store management",
    items: [
      {
        key: "products",
        label: "Products",
        description: "Catalog and stock",
        icon: PackageSearch,
      },
      {
        key: "orders",
        label: "Orders",
        description: "Track customer orders",
        icon: ShoppingBag,
      },
      {
        key: "cart",
        label: "Cart activity",
        description: "Customer selections",
        icon: ShoppingCart,
      },
      {
        key: "payments",
        label: "Payments",
        description: "Transactions and totals",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    label: "People and support",
    items: [
      {
        key: "customers",
        label: "Customers",
        description: "Customer directory",
        icon: UsersRound,
      },
      {
        key: "messages",
        label: "Messages",
        description: "Support conversations",
        icon: MessageSquareText,
      },
      {
        key: "users",
        label: "Users",
        description: "Accounts and roles",
        icon: UserCog,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        key: "settings",
        label: "Settings",
        description: "Store preferences",
        icon: Settings,
      },
      {
        key: "profile",
        label: "My profile",
        description: "Admin information",
        icon: UserRound,
      },
    ],
  },
];

const pageLabels: Record<PageKey, string> = Object.fromEntries(
  navigation.flatMap((group) =>
    group.items.map((item) => [item.key, item.label]),
  ),
) as Record<PageKey, string>;

export default function AdminPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser>({});

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("rify_admin_sidebar") === "collapsed");
    } catch {
      setCollapsed(false);
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const user = data?.user ?? data;
        if (user && typeof user === "object") {
          setSessionUser({ name: user.name, email: user.email });
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  const pages = useMemo<Record<PageKey, ReactNode>>(
    () => ({
      dashboard: <Dashboard />,
      products: <Products />,
      orders: <Orders />,
      customers: <Customers />,
      messages: <Messages />,
      users: <Users />,
      cart: <Cart />,
      analytics: <Analytics />,
      payments: <Payments />,
      settings: <SettingsPage />,
      profile: <Profile />,
    }),
    [],
  );

  const userName = sessionUser.name?.trim() || "Store Administrator";
  const userEmail = sessionUser.email?.trim() || "admin@rifyluxe.co.tz";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(
          "rify_admin_sidebar",
          next ? "collapsed" : "expanded",
        );
      } catch {
        // The menu still works when storage is unavailable.
      }
      return next;
    });
  };

  const selectPage = (nextPage: PageKey) => {
    setPage(nextPage);
    setMobileOpen(false);
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <main
      className={`${styles.adminShell} ${
        collapsed ? styles.shellCollapsed : ""
      }`}
    >
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            className={styles.mobileOverlay}
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside
        className={`${styles.sidebar} ${
          collapsed ? styles.sidebarCollapsed : ""
        } ${mobileOpen ? styles.sidebarMobileOpen : ""}`}
      >
        <div className={styles.sidebarGlow} />

        <div className={styles.brandRow}>
          <button
            type="button"
            className={styles.brand}
            onClick={() => selectPage("dashboard")}
            aria-label="Open dashboard"
          >
            <span className={styles.brandMark}>R</span>
            <span className={styles.brandCopy}>
              <strong>Rify Luxe</strong>
              <small>Admin workspace</small>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.iconButton} ${styles.desktopToggle}`}
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>

          <button
            type="button"
            className={`${styles.iconButton} ${styles.mobileClose}`}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className={styles.storeStatus}>
          <span className={styles.storeStatusIcon}>
            <Store size={17} />
          </span>
          <span className={styles.storeStatusCopy}>
            <strong>Store is online</strong>
            <small>
              <span className={styles.liveDot} /> Live operations
            </small>
          </span>
          <Sparkles className={styles.statusSparkle} size={16} />
        </div>

        <nav className={styles.navigation} aria-label="Admin navigation">
          {navigation.map((group) => (
            <div className={styles.navGroup} key={group.label}>
              <p className={styles.navGroupLabel}>{group.label}</p>

              <div className={styles.navItems}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = page === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={`${styles.navButton} ${
                        isActive ? styles.navButtonActive : ""
                      }`}
                      onClick={() => selectPage(item.key)}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      data-tooltip={item.label}
                    >
                      {isActive && (
                        <motion.span
                          className={styles.activeRail}
                          layoutId="admin-active-rail"
                        />
                      )}

                      <span className={styles.navIcon}>
                        <Icon size={20} strokeWidth={2.1} />
                      </span>

                      <span className={styles.navCopy}>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>

                      <ChevronRight className={styles.navArrow} size={17} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.profileCard}
            onClick={() => selectPage("profile")}
            title={collapsed ? userName : undefined}
            data-tooltip={userName}
          >
            <span className={styles.profileAvatar}>{userInitials || "A"}</span>
            <span className={styles.profileCopy}>
              <strong>{userName}</strong>
              <small>{userEmail}</small>
            </span>
            <ShieldCheck className={styles.profileShield} size={18} />
          </button>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={logout}
            disabled={loggingOut}
            title={collapsed ? "Sign out" : undefined}
            data-tooltip="Sign out"
          >
            <LogOut size={19} />
            <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>

          <div>
            <small>Rify Luxe Admin</small>
            <strong>{pageLabels[page]}</strong>
          </div>

          <button
            type="button"
            className={styles.mobileAvatar}
            onClick={() => selectPage("profile")}
            aria-label="Open profile"
          >
            {userInitials || "A"}
          </button>
        </header>

        <div className={styles.scrollArea}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              className={styles.pageView}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        </div>
>>>>>>> 2090a59 (new changes)
      </section>
    </main>
  );
}
