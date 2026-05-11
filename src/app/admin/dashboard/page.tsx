"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
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
  total?: number;
  status?: string;
  createdAt?: string;
};

type Product = {
  id?: number | string;
  name?: string;
  price?: number;
  image?: string;
};

type NotificationItem = {
  id: string;
  type: "message" | "user" | "order";
  text: string;
  read: boolean;
};

const DELETED_NOTIFICATIONS_KEY = "admin_deleted_notifications";
const READ_NOTIFICATIONS_KEY = "admin_read_notifications";

function loadSavedIds(key: string) {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveIds(key: string, ids: string[]) {
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
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [deletedNotificationIds, setDeletedNotificationIds] = useState<string[]>(
    []
  );
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  const [openNotif, setOpenNotif] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDeletedNotificationIds(loadSavedIds(DELETED_NOTIFICATIONS_KEY));
    setReadNotificationIds(loadSavedIds(READ_NOTIFICATIONS_KEY));
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contactsRes, usersRes, ordersRes, productsRes] =
        await Promise.allSettled([
          fetch("/api/contact", { cache: "no-store" }),
          fetch("/api/users", { cache: "no-store" }),
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/products", { cache: "no-store" }),
        ]);

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
          read: false,
        })),
      ];

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
      saveIds(READ_NOTIFICATIONS_KEY, next);
      return next;
    });

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
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
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
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
}
