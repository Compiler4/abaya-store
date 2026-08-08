"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
<<<<<<< HEAD
  Bell,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
=======
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Mail,
  MessageCircle,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

>>>>>>> 2090a59 (new changes)
import styles from "./dashboard.module.css";

type Contact = {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  createdAt?: string;
};

type User = {
  id?: number | string;
  name?: string;
  email?: string;
  createdAt?: string;
};

type Order = {
  id?: number | string;
  customer?: string;
<<<<<<< HEAD
  total?: number;
  status?: string;
  createdAt?: string;
=======
  customerName?: string;
  total?: number | string;
  status?: string;
  createdAt?: string;
  orderedAt?: string;
>>>>>>> 2090a59 (new changes)
};

type Product = {
  id?: number | string;
  name?: string;
<<<<<<< HEAD
  price?: number;
  image?: string;
=======
  price?: number | string;
  image?: string;
  stock?: number | string;
>>>>>>> 2090a59 (new changes)
};

type NotificationItem = {
  id: string;
  type: "message" | "user" | "order";
  text: string;
<<<<<<< HEAD
  read: boolean;
};

const DELETED_NOTIFICATIONS_KEY = "admin_deleted_notifications";
const READ_NOTIFICATIONS_KEY = "admin_read_notifications";

function loadSavedIds(key: string) {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
=======
  detail: string;
  read: boolean;
};

type Tone = "emerald" | "gold" | "violet" | "rose";

const DELETED_NOTIFICATIONS_KEY = "admin_deleted_notifications";
const READ_NOTIFICATIONS_KEY = "admin_read_notifications";
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function loadSavedIds(key: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.map(String) : [];
>>>>>>> 2090a59 (new changes)
  } catch {
    return [];
  }
}

function saveIds(key: string, ids: string[]) {
<<<<<<< HEAD
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
}

function NotificationIcon({ type }: { type: NotificationItem["type"] }) {
  if (type === "message") return <MessageCircle size={16} />;
  if (type === "user") return <Users size={16} />;
  return <ShoppingBag size={16} />;
}

function StatIcon({ tone }: { tone: "blue" | "green" | "orange" | "red" }) {
  if (tone === "blue") return <CreditCard size={24} />;
  if (tone === "green") return <ShoppingBag size={24} />;
  if (tone === "orange") return <Users size={24} />;
  return <Package size={24} />;
=======
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // Notifications still work when storage is unavailable.
  }
}

function extractList<T>(data: unknown, keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;

  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }

  return [];
}

async function readResult<T>(
  result: PromiseSettledResult<Response>,
  keys: string[],
): Promise<T[]> {
  if (result.status !== "fulfilled" || !result.value.ok) return [];

  try {
    return extractList<T>(await result.value.json(), keys);
  } catch {
    return [];
  }
}

function money(value: number | string | undefined) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return "Recent";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function orderDate(order: Order) {
  return order.orderedAt || order.createdAt;
}

function orderTime(order: Order) {
  const date = new Date(orderDate(order) || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function orderCustomer(order: Order) {
  return order.customerName || order.customer || "Walk-in customer";
}

function normalizedStatus(status?: string) {
  return (status || "pending").trim().toLowerCase();
}

function notificationIcon(type: NotificationItem["type"]) {
  if (type === "message") return <MessageCircle size={17} />;
  if (type === "user") return <UserPlus size={17} />;
  return <ShoppingBag size={17} />;
>>>>>>> 2090a59 (new changes)
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
<<<<<<< HEAD

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [deletedNotificationIds, setDeletedNotificationIds] = useState<string[]>(
    []
  );
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  const [openNotif, setOpenNotif] = useState(false);
  const [loading, setLoading] = useState(true);
=======
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [deletedNotificationIds, setDeletedNotificationIds] = useState<
    string[]
  >([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [openNotifications, setOpenNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
>>>>>>> 2090a59 (new changes)

  useEffect(() => {
    setDeletedNotificationIds(loadSavedIds(DELETED_NOTIFICATIONS_KEY));
    setReadNotificationIds(loadSavedIds(READ_NOTIFICATIONS_KEY));
  }, []);

<<<<<<< HEAD
  const fetchDashboardData = async () => {
    try {
      const [contactsRes, usersRes, ordersRes, productsRes] =
=======
  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    setLoadError("");

    try {
      const [contactsResult, usersResult, ordersResult, productsResult] =
>>>>>>> 2090a59 (new changes)
        await Promise.allSettled([
          fetch("/api/contact", { cache: "no-store" }),
          fetch("/api/users", { cache: "no-store" }),
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/products", { cache: "no-store" }),
        ]);

<<<<<<< HEAD
      const getJson = async (result: PromiseSettledResult<Response>) => {
        if (result.status !== "fulfilled" || !result.value.ok) return [];

        const data = await result.value.json();

        return Array.isArray(data)
          ? data
          : data.data ||
              data.contacts ||
              data.users ||
              data.orders ||
              data.products ||
              [];
      };

      const contactsData = await getJson(contactsRes);
      const usersData = await getJson(usersRes);
      const ordersData = await getJson(ordersRes);
      const productsData = await getJson(productsRes);

      setContacts(contactsData);
      setUsers(usersData);
      setOrders(ordersData);
      setProducts(productsData);

      const liveNotifications: NotificationItem[] = [
        ...contactsData.slice(0, 5).map((c: Contact, i: number) => ({
          id: `message-${c.id || i}`,
          type: "message" as const,
          text: `New message from ${c.name || "customer"}`,
          read: false,
        })),
        ...usersData.slice(0, 5).map((u: User, i: number) => ({
          id: `user-${u.id || i}`,
          type: "user" as const,
          text: `New registered user: ${u.name || u.email || "User"}`,
          read: false,
        })),
        ...ordersData.slice(0, 5).map((o: Order, i: number) => ({
          id: `order-${o.id || i}`,
          type: "order" as const,
          text: `New order received #${o.id || i + 1}`,
=======
      const [contactData, userData, orderData, productData] = await Promise.all(
        [
          readResult<Contact>(contactsResult, ["data", "contacts", "messages"]),
          readResult<User>(usersResult, ["data", "users"]),
          readResult<Order>(ordersResult, ["data", "orders"]),
          readResult<Product>(productsResult, ["data", "products", "gallery"]),
        ],
      );

      setContacts(contactData);
      setUsers(userData);
      setOrders(orderData);
      setProducts(productData);

      const liveNotifications: NotificationItem[] = [
        ...contactData.slice(0, 5).map((contact, index) => ({
          id: `message-${String(contact.id ?? index)}`,
          type: "message" as const,
          text: `Message from ${contact.name || "a customer"}`,
          detail: contact.message || "A customer sent a new enquiry.",
          read: false,
        })),
        ...userData.slice(0, 4).map((user, index) => ({
          id: `user-${String(user.id ?? index)}`,
          type: "user" as const,
          text: `${user.name || user.email || "A user"} joined`,
          detail: "A new customer account was registered.",
          read: false,
        })),
        ...orderData.slice(0, 5).map((order, index) => ({
          id: `order-${String(order.id ?? index)}`,
          type: "order" as const,
          text: `New order #${String(order.id ?? index + 1)}`,
          detail: `${orderCustomer(order)} · ${money(order.total)} TZS`,
>>>>>>> 2090a59 (new changes)
          read: false,
        })),
      ];

<<<<<<< HEAD
      setNotifications((prev) => {
        const runtimeReadIds = prev.filter((n) => n.read).map((n) => n.id);
        const allReadIds = new Set([
          ...readNotificationIds,
          ...runtimeReadIds,
        ]);
        const deletedSet = new Set(deletedNotificationIds);

        return liveNotifications
          .filter((n) => !deletedSet.has(n.id))
          .map((n) => ({
            ...n,
            read: allReadIds.has(n.id),
          }));
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 10000);

    return () => clearInterval(interval);
  }, [deletedNotificationIds, readNotificationIds]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  }, [orders]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setReadNotificationIds((prev) => {
      const next = Array.from(new Set([...prev, id]));
=======
      setNotifications((current) => {
        const runtimeReadIds = current
          .filter((notification) => notification.read)
          .map((notification) => notification.id);
        const allReadIds = new Set([...readNotificationIds, ...runtimeReadIds]);
        const deletedIds = new Set(deletedNotificationIds);

        return liveNotifications
          .filter((notification) => !deletedIds.has(notification.id))
          .map((notification) => ({
            ...notification,
            read: allReadIds.has(notification.id),
          }));
      });
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
      setLoadError(
        "Some live information could not be loaded. Try refreshing.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [deletedNotificationIds, readNotificationIds]);

  useEffect(() => {
    void fetchDashboardData();
    const interval = window.setInterval(() => void fetchDashboardData(), 20000);
    return () => window.clearInterval(interval);
  }, [fetchDashboardData]);

  const totalRevenue = useMemo(
    () => orders.reduce((total, order) => total + Number(order.total || 0), 0),
    [orders],
  );

  const completedOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["completed", "delivered", "paid"].includes(
          normalizedStatus(order.status),
        ),
      ).length,
    [orders],
  );

  const pendingOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["pending", "processing", "confirmed"].includes(
          normalizedStatus(order.status),
        ),
      ).length,
    [orders],
  );

  const cancelledOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["cancelled", "canceled", "failed"].includes(
          normalizedStatus(order.status),
        ),
      ).length,
    [orders],
  );

  const averageOrder = orders.length ? totalRevenue / orders.length : 0;
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const lowStockCount = products.filter((product) => {
    const stock = Number(product.stock);
    return Number.isFinite(stock) && stock >= 0 && stock <= 5;
  }).length;

  const weekdayRevenue = useMemo(() => {
    const totals = Array.from({ length: 7 }, () => 0);

    orders.forEach((order) => {
      const date = new Date(orderDate(order) || "");
      if (Number.isNaN(date.getTime())) return;
      const mondayFirstIndex = (date.getUTCDay() + 6) % 7;
      totals[mondayFirstIndex] += Number(order.total || 0);
    });

    return totals;
  }, [orders]);

  const chartMaximum = Math.max(...weekdayRevenue, 1);
  const completedPercent = orders.length
    ? Math.round((completedOrders / orders.length) * 100)
    : 0;
  const pendingPercent = orders.length
    ? Math.round((pendingOrders / orders.length) * 100)
    : 0;
  const cancelledPercent = orders.length
    ? Math.round((cancelledOrders / orders.length) * 100)
    : 0;
  const otherOrders = Math.max(
    orders.length - completedOrders - pendingOrders - cancelledOrders,
    0,
  );
  const otherPercent = orders.length
    ? Math.max(100 - completedPercent - pendingPercent - cancelledPercent, 0)
    : 0;

  const visibleOrders = useMemo(() => {
    const search = query.trim().toLowerCase();

    return [...orders]
      .sort((a, b) => orderTime(b) - orderTime(a))
      .filter((order) => {
        if (!search) return true;
        return `${String(order.id || "")} ${orderCustomer(order)} ${
          order.status || "pending"
        }`
          .toLowerCase()
          .includes(search);
      })
      .slice(0, 6);
  }, [orders, query]);

  const recentContacts = contacts.slice(0, 3);
  const recentUsers = users.slice(0, 2);

  const markAsRead = (id: string) => {
    setReadNotificationIds((current) => {
      const next = Array.from(new Set([...current, id]));
>>>>>>> 2090a59 (new changes)
      saveIds(READ_NOTIFICATIONS_KEY, next);
      return next;
    });

<<<<<<< HEAD
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
=======
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    const ids = notifications.map((notification) => notification.id);
    setReadNotificationIds((current) => {
      const next = Array.from(new Set([...current, ...ids]));
      saveIds(READ_NOTIFICATIONS_KEY, next);
      return next;
    });
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
>>>>>>> 2090a59 (new changes)
    );
  };

  const deleteNotification = (id: string) => {
<<<<<<< HEAD
    setDeletedNotificationIds((prev) => {
      const next = Array.from(new Set([...prev, id]));
      saveIds(DELETED_NOTIFICATIONS_KEY, next);
      return next;
    });

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    const idsToDelete = notifications.map((n) => n.id);

    setDeletedNotificationIds((prev) => {
      const next = Array.from(new Set([...prev, ...idsToDelete]));
      saveIds(DELETED_NOTIFICATIONS_KEY, next);
      return next;
    });

    setNotifications([]);
  };

  const recentContacts = contacts.slice(0, 5);
  const recentUsers = users.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <main className={styles.dashboardPage}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.kicker}>Live Dashboard</p>
          <h1>Admin Overview</h1>
        </div>

        <div className={styles.notificationWrapper}>
          <button
            className={styles.notificationBtn}
            onClick={() => setOpenNotif((prev) => !prev)}
            aria-label="Open notifications"
            title="Open notifications"
            type="button"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </button>

          <AnimatePresence>
            {openNotif && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
              >
                <div className={styles.dropdownHeader}>
                  <div>
                    <h4>Notifications</h4>
                    <small>{unreadCount} unread</small>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      className={styles.clearBtn}
                      onClick={clearNotifications}
                      type="button"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className={styles.emptyText}>No notifications</p>
                ) : (
                  <div className={styles.notifList}>
                    {notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        className={`${styles.notifItem} ${
                          n.read ? styles.read : styles.unread
                        }`}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                      >
                        <button
                          className={styles.notifText}
                          onClick={() => markAsRead(n.id)}
                          type="button"
                        >
                          <span className={styles.notifRow}>
                            <NotificationIcon type={n.type} />
                            <span>{n.text}</span>
                          </span>

                          <small>
                            {n.read ? (
                              <>
                                <CheckCircle2 size={13} /> Read
                              </>
                            ) : (
                              <>
                                <Bell size={13} /> Unread {n.type}
                              </>
                            )}
                          </small>
                        </button>

                        <button
                          className={styles.deleteNotifBtn}
                          onClick={() => deleteNotification(n.id)}
                          aria-label={`Delete notification: ${n.text}`}
                          title="Delete notification"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {loading && <div className={styles.loading}>Loading live data...</div>}

      <section className={styles.statGrid}>
        <StatCard
          title="Revenue"
          value={`${totalRevenue.toLocaleString()} TZS`}
          tone="blue"
        />
        <StatCard title="Orders" value={orders.length} tone="green" />
        <StatCard title="Users" value={users.length} tone="orange" />
        <StatCard title="Products" value={products.length} tone="red" />
      </section>

      <section className={styles.mainGrid}>
        <motion.div className={styles.chartBox} whileHover={{ y: -4 }}>
          <div className={styles.sectionHeader}>
            <h3>
              <TrendingUp size={18} /> Sales Overview
            </h3>
            <span>Live</span>
          </div>

          <div className={styles.fakeChart}>
            <div className={`${styles.bar} ${styles.h40}`} />
            <div className={`${styles.bar} ${styles.h70}`} />
            <div className={`${styles.bar} ${styles.h55}`} />
            <div className={`${styles.bar} ${styles.h90}`} />
            <div className={`${styles.bar} ${styles.h60}`} />
          </div>
        </motion.div>

        <Panel
          icon={<MessageCircle size={18} />}
          title="Recent Customer Details"
          count={recentContacts.length}
        >
          {recentContacts.length === 0 && (
            <p className={styles.emptyText}>No customer messages yet.</p>
          )}

          {recentContacts.map((c, index) => (
            <div key={c.id || index} className={styles.listItem}>
              <div className={styles.avatar}>
                {(c.name || "C").charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{c.name || "Unknown Customer"}</strong>
                <p>{c.message || "No message"}</p>
                <small>
                  {c.email || "No email"} • {c.phone || "No phone"}
                </small>
                <small>{c.location || "No location"}</small>
              </div>
            </div>
          ))}
        </Panel>
      </section>

      <section className={styles.dataGrid}>
        <Panel icon={<MessageCircle size={18} />} title="Messages Sent" count={contacts.length}>
          {contacts.length === 0 && (
            <p className={styles.emptyText}>No messages found.</p>
          )}

          {contacts.slice(0, 6).map((c, index) => (
            <div key={c.id || index} className={styles.messageItem}>
              <strong>{c.name || "Customer"}</strong>
              <p>{c.message || "No message content"}</p>
            </div>
          ))}
        </Panel>

        <Panel icon={<Users size={18} />} title="Recent Registered Users" count={recentUsers.length}>
          {recentUsers.length === 0 && (
            <p className={styles.emptyText}>No registered users found.</p>
          )}

          {recentUsers.map((u, index) => (
            <div key={u.id || index} className={styles.listItem}>
              <div className={styles.avatar}>
                {(u.name || u.email || "U").charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{u.name || "Unnamed User"}</strong>
                <p>{u.email || "No email"}</p>
                <small>{formatDate(u.createdAt)}</small>
              </div>
            </div>
          ))}
        </Panel>

        <Panel icon={<ShoppingBag size={18} />} title="Recent Orders" count={recentOrders.length}>
          {recentOrders.length === 0 && (
            <p className={styles.emptyText}>No recent orders found.</p>
          )}

          {recentOrders.map((o, index) => (
            <div key={o.id || index} className={styles.orderItem}>
              <div>
                <strong>Order #{o.id || index + 1}</strong>
                <p>{o.customer || "Unknown customer"}</p>
              </div>

              <div>
                <span>{Number(o.total || 0).toLocaleString()} TZS</span>
                <small>{o.status || "pending"}</small>
              </div>
            </div>
          ))}
        </Panel>
=======
    setDeletedNotificationIds((current) => {
      const next = Array.from(new Set([...current, id]));
      saveIds(DELETED_NOTIFICATIONS_KEY, next);
      return next;
    });
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  return (
    <main className={styles.dashboardPage}>
      <header className={styles.heroHeader}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            <Sparkles size={14} /> Live commerce control centre
          </p>
          <h1>Welcome back, Admin</h1>
          <p className={styles.heroDescription}>
            Monitor sales, orders, customers and store activity from one clear
            workspace.
          </p>
        </div>

        <div className={styles.heroActions}>
          <label className={styles.searchBox}>
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders..."
              aria-label="Search recent orders"
            />
          </label>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={() => void fetchDashboardData()}
            disabled={refreshing}
            aria-label="Refresh dashboard data"
            title="Refresh dashboard"
          >
            <RefreshCw
              size={19}
              className={refreshing ? styles.spinning : ""}
            />
          </button>

          <div className={styles.notificationWrapper}>
            <button
              type="button"
              className={styles.notificationButton}
              onClick={() => setOpenNotifications((current) => !current)}
              aria-label="Open notifications"
              aria-expanded={openNotifications}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </button>

            <AnimatePresence>
              {openNotifications && (
                <>
                  <motion.button
                    key="notification-backdrop"
                    type="button"
                    className={styles.notificationBackdrop}
                    aria-label="Close notifications"
                    onClick={() => setOpenNotifications(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />

                  <motion.div
                    key="notification-panel"
                    className={styles.notificationPanel}
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.notificationHeader}>
                      <div>
                        <span className={styles.notificationHeaderIcon}>
                          <Bell size={18} />
                        </span>
                        <div>
                          <strong>Notifications</strong>
                          <small>{unreadCount} unread updates</small>
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <button type="button" onClick={markAllAsRead}>
                          <Check size={15} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className={styles.notificationList}>
                      {notifications.length === 0 ? (
                        <div className={styles.emptyNotifications}>
                          <CheckCircle2 size={28} />
                          <strong>You are all caught up</strong>
                          <small>New store activity will appear here.</small>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <article
                            key={notification.id}
                            className={`${styles.notificationItem} ${
                              notification.read
                                ? styles.notificationRead
                                : styles.notificationUnread
                            }`}
                          >
                            <button
                              type="button"
                              className={styles.notificationContent}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <span className={styles.notificationTypeIcon}>
                                {notificationIcon(notification.type)}
                              </span>
                              <span>
                                <strong>{notification.text}</strong>
                                <small>{notification.detail}</small>
                              </span>
                            </button>

                            <button
                              type="button"
                              className={styles.deleteNotification}
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              aria-label={`Delete notification: ${notification.text}`}
                            >
                              <X size={16} />
                            </button>
                          </article>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {loadError && (
        <div className={styles.errorBanner} role="status">
          <span>{loadError}</span>
          <button type="button" onClick={() => void fetchDashboardData()}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingBar}>
          <span /> Loading live store information...
        </div>
      ) : (
        <div className={styles.liveBar}>
          <span className={styles.livePulse} />
          Live data connected
          <small>Automatically refreshes every 20 seconds</small>
        </div>
      )}

      <section className={styles.statGrid} aria-label="Store summary">
        <StatCard
          title="Total revenue"
          value={`${money(totalRevenue)} TZS`}
          detail={`${money(averageOrder)} TZS average order`}
          badge="Live total"
          tone="emerald"
          icon={<CircleDollarSign size={23} />}
          delay={0}
        />
        <StatCard
          title="Total orders"
          value={orders.length}
          detail={`${pendingOrders} waiting for action`}
          badge={`${completedPercent}% completed`}
          tone="gold"
          icon={<ShoppingBag size={23} />}
          delay={0.05}
        />
        <StatCard
          title="Registered users"
          value={users.length}
          detail={`${contacts.length} customer enquiries`}
          badge="Growing audience"
          tone="violet"
          icon={<Users size={23} />}
          delay={0.1}
        />
        <StatCard
          title="Products"
          value={products.length}
          detail={
            lowStockCount > 0
              ? `${lowStockCount} items have low stock`
              : "Inventory looks healthy"
          }
          badge="Catalog status"
          tone="rose"
          icon={<Package size={23} />}
          delay={0.15}
        />
      </section>

      <section className={styles.insightStrip}>
        <div>
          <span className={styles.insightIcon}>
            <TrendingUp size={20} />
          </span>
          <span>
            <small>Average order value</small>
            <strong>{money(averageOrder)} TZS</strong>
          </span>
        </div>
        <div>
          <span className={`${styles.insightIcon} ${styles.insightGold}`}>
            <Clock3 size={20} />
          </span>
          <span>
            <small>Orders requiring attention</small>
            <strong>{pendingOrders}</strong>
          </span>
        </div>
        <div>
          <span className={`${styles.insightIcon} ${styles.insightViolet}`}>
            <Mail size={20} />
          </span>
          <span>
            <small>Customer messages</small>
            <strong>{contacts.length}</strong>
          </span>
        </div>
      </section>

      <section className={styles.analyticsGrid}>
        <motion.article
          className={styles.panel}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <PanelHeader
            eyebrow="Sales intelligence"
            title="Revenue by weekday"
            icon={<TrendingUp size={19} />}
            action={`${money(totalRevenue)} TZS total`}
          />

          <div className={styles.chartArea}>
            <div className={styles.chartScale} aria-hidden="true">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0</span>
            </div>

            <div className={styles.barChart}>
              {weekdayRevenue.map((value, index) => {
                const height = value
                  ? Math.max((value / chartMaximum) * 100, 12)
                  : 5;

                return (
                  <div className={styles.barColumn} key={WEEKDAYS[index]}>
                    <div className={styles.barTrack}>
                      <motion.div
                        className={styles.revenueBar}
                        title={`${WEEKDAYS[index]}: ${money(value)} TZS`}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{
                          duration: 0.7,
                          delay: 0.08 * index,
                          ease: "easeOut",
                        }}
                      >
                        {value > 0 && <span>{money(value)}</span>}
                      </motion.div>
                    </div>
                    <small>{WEEKDAYS[index]}</small>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.article>

        <motion.article
          className={styles.panel}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <PanelHeader
            eyebrow="Order health"
            title="Fulfilment overview"
            icon={<WalletCards size={19} />}
            action={`${orders.length} orders`}
          />

          <div className={styles.donutSection}>
            <div
              className={styles.donutChart}
              style={{
                background:
                  orders.length === 0
                    ? "#e8eeec"
                    : `conic-gradient(#167a63 0 ${completedPercent}%, #d6a84f ${completedPercent}% ${
                        completedPercent + pendingPercent
                      }%, #df6371 ${completedPercent + pendingPercent}% ${
                        completedPercent + pendingPercent + cancelledPercent
                      }%, #8b78d1 ${
                        completedPercent + pendingPercent + cancelledPercent
                      }% 100%)`,
              }}
            >
              <div className={styles.donutCenter}>
                <strong>{completedPercent}%</strong>
                <small>completed</small>
              </div>
            </div>

            <div className={styles.donutLegend}>
              <LegendRow
                label="Completed"
                value={completedOrders}
                percent={completedPercent}
                color="emerald"
              />
              <LegendRow
                label="Pending"
                value={pendingOrders}
                percent={pendingPercent}
                color="gold"
              />
              <LegendRow
                label="Cancelled"
                value={cancelledOrders}
                percent={cancelledPercent}
                color="rose"
              />
              <LegendRow
                label="Other"
                value={otherOrders}
                percent={otherPercent}
                color="violet"
              />
            </div>
          </div>
        </motion.article>
      </section>

      <section className={styles.activityGrid}>
        <article className={styles.panel}>
          <PanelHeader
            eyebrow="Order management"
            title="Recent orders"
            icon={<ShoppingBag size={19} />}
            action={
              query ? `${visibleOrders.length} results` : "Latest activity"
            }
          />

          <div className={styles.tableWrap}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order, index) => {
                  const status = normalizedStatus(order.status);

                  return (
                    <tr key={String(order.id ?? index)}>
                      <td>
                        <span className={styles.orderNumber}>
                          #{String(order.id ?? index + 1)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.customerCell}>
                          <span>
                            {orderCustomer(order).charAt(0).toUpperCase()}
                          </span>
                          <strong>{orderCustomer(order)}</strong>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            ["completed", "delivered", "paid"].includes(status)
                              ? styles.statusCompleted
                              : ["cancelled", "canceled", "failed"].includes(
                                    status,
                                  )
                                ? styles.statusCancelled
                                : styles.statusPending
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <strong className={styles.amountCell}>
                          {money(order.total)} TZS
                        </strong>
                      </td>
                      <td>{formatDate(orderDate(order))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {visibleOrders.length === 0 && (
              <div className={styles.emptyTable}>
                <ShoppingBag size={28} />
                <strong>
                  {query ? "No matching orders" : "No orders yet"}
                </strong>
                <small>
                  {query
                    ? "Try a different order number, customer or status."
                    : "New orders will appear here automatically."}
                </small>
              </div>
            )}
          </div>
        </article>

        <article className={styles.panel}>
          <PanelHeader
            eyebrow="Live feed"
            title="Recent activity"
            icon={<Bell size={19} />}
            action={`${recentContacts.length + recentUsers.length} updates`}
          />

          <div className={styles.activityList}>
            {recentContacts.map((contact, index) => (
              <div
                className={styles.activityItem}
                key={String(contact.id ?? index)}
              >
                <span className={styles.activityMessageIcon}>
                  <MessageCircle size={18} />
                </span>
                <div>
                  <strong>{contact.name || "Customer enquiry"}</strong>
                  <p>{contact.message || "Sent a new store message."}</p>
                  <small>{formatDate(contact.createdAt)}</small>
                </div>
                <ArrowUpRight size={16} />
              </div>
            ))}

            {recentUsers.map((user, index) => (
              <div
                className={styles.activityItem}
                key={String(user.id ?? `user-${index}`)}
              >
                <span className={styles.activityUserIcon}>
                  <UserPlus size={18} />
                </span>
                <div>
                  <strong>{user.name || "New customer"}</strong>
                  <p>{user.email || "Created a store account."}</p>
                  <small>{formatDate(user.createdAt)}</small>
                </div>
                <ArrowUpRight size={16} />
              </div>
            ))}

            {recentContacts.length + recentUsers.length === 0 && (
              <div className={styles.emptyActivity}>
                <Bell size={27} />
                <strong>No recent activity</strong>
                <small>Customer and account updates will appear here.</small>
              </div>
            )}
          </div>
        </article>
>>>>>>> 2090a59 (new changes)
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
<<<<<<< HEAD
  tone,
}: {
  title: string;
  value: string | number;
  tone: "blue" | "green" | "orange" | "red";
}) {
  return (
    <motion.div
      className={`${styles.statCard} ${styles[tone]}`}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.statIcon}>
        <StatIcon tone={tone} />
      </div>

      <p>{title}</p>
      <h2>{value}</h2>
    </motion.div>
  );
}

function Panel({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div className={styles.panelCard} whileHover={{ y: -4 }}>
      <div className={styles.sectionHeader}>
        <h3>
          {icon}
          {title}
        </h3>
        <span>{count}</span>
      </div>

      <div className={styles.list}>{children}</div>
    </motion.div>
  );
}

function formatDate(date?: string) {
  if (!date) return "Recent";
  return new Date(date).toLocaleDateString();
=======
  detail,
  badge,
  tone,
  icon,
  delay,
}: {
  title: string;
  value: string | number;
  detail: string;
  badge: string;
  tone: Tone;
  icon: ReactNode;
  delay: number;
}) {
  return (
    <motion.article
      className={`${styles.statCard} ${styles[`tone${tone}`]}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.36 }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.statTopRow}>
        <span className={styles.statIcon}>{icon}</span>
        <span className={styles.statBadge}>{badge}</span>
      </div>
      <p>{title}</p>
      <h2>{value}</h2>
      <small>{detail}</small>
      <span className={styles.statGlow} />
    </motion.article>
  );
}

function PanelHeader({
  eyebrow,
  title,
  icon,
  action,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  action: string;
}) {
  return (
    <div className={styles.panelHeader}>
      <div>
        <span className={styles.panelIcon}>{icon}</span>
        <span>
          <small>{eyebrow}</small>
          <h3>{title}</h3>
        </span>
      </div>
      <span className={styles.panelAction}>{action}</span>
    </div>
  );
}

function LegendRow({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: number;
  percent: number;
  color: Tone;
}) {
  return (
    <div className={styles.legendRow}>
      <span className={`${styles.legendDot} ${styles[`legend${color}`]}`} />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      <b>{percent}%</b>
    </div>
  );
>>>>>>> 2090a59 (new changes)
}
