"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Eye,
  Grid2X2,
  ImageIcon,
  ListFilter,
  MapPin,
  PackageCheck,
  ReceiptText,
  Search,
  ShoppingBag,
  Table2,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./orders.module.css";

type OrderStatus = "all" | "pending" | "delivered" | "completed";

type ProductLike = {
  id?: number | string;
  name?: string;
  price?: number;
  image?: string;
};

type OrderItem = {
  id?: number | string;
  quantity?: number;
  price?: number;
  product?: ProductLike;
  name?: string;
  image?: string;
};

type Order = {
  id: number | string;
  total?: number;
  status?: string;
  address?: string;
  customer?: string;
  phone?: string;
  location?: string;
  quantity?: number;
  createdAt?: string;
  completedAt?: string;
  userId?: number | string;
  user?: {
    id?: number | string;
    email?: string;
  };
  items?: OrderItem[];
};

const statusTabs: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <ListFilter size={16} /> },
  { key: "pending", label: "Pending", icon: <Clock3 size={16} /> },
  { key: "delivered", label: "Delivered", icon: <Truck size={16} /> },
  { key: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
];

function normalizeOrders(data: any): Order[] {
  if (Array.isArray(data)) return data;
  return data?.orders || data?.data || [];
}

function normalizeStatus(status?: string): OrderStatus {
  const value = String(status || "pending").toLowerCase();

  if (value === "completed") return "completed";
  if (value === "delivered") return "delivered";
  if (value === "pending") return "pending";

  return "pending";
}

function getItemName(item: OrderItem) {
  return item.product?.name || item.name || "Product item";
}

function getItemImage(item: OrderItem) {
  return item.product?.image || item.image || "/placeholder.png";
}

function getItemPrice(item: OrderItem) {
  return Number(item.price || item.product?.price || 0);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus>("all");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [openOrderId, setOpenOrderId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const user = savedUser ? JSON.parse(savedUser) : null;

        const res = await fetch("/api/orders", {
          cache: "no-store",
          credentials: "include",
        });

        const data = await res.json();
        const allOrders = normalizeOrders(data);

        const userOrders = user?.id
          ? allOrders.filter((order) => String(order.userId) === String(user.id))
          : allOrders;

        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim();

    return orders.filter((order) => {
      const orderStatus = normalizeStatus(order.status);
      const matchesStatus = status === "all" || orderStatus === status;

      const searchable = [
        order.id,
        order.customer,
        order.phone,
        order.address,
        order.location,
        order.status,
        ...(order.items || []).map((item) => getItemName(item)),
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!term || searchable.includes(term));
    });
  }, [orders, status, search]);

  const pendingCount = orders.filter((o) => normalizeStatus(o.status) === "pending").length;
  const deliveredCount = orders.filter((o) => normalizeStatus(o.status) === "delivered").length;
  const completedCount = orders.filter((o) => normalizeStatus(o.status) === "completed").length;
  const totalAmount = filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const toggleOrder = (id: string | number) => {
    setOpenOrderId((current) => (current === id ? null : id));
  };

  return (
    <main className={styles.page}>
      <motion.header
        className={styles.hero}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className={styles.kicker}>
            <ShoppingBag size={15} />
            My Orders
          </p>

          <h1>
            <ReceiptText size={34} />
            Orders Dashboard
          </h1>

          <p className={styles.subtitle}>
            Track your pending, delivered, and completed orders with product
            images, totals, and delivery details.
          </p>
        </div>

        <div className={styles.heroBadge}>
          <Wallet size={22} />
          <span>Total shown</span>
          <strong>{totalAmount.toLocaleString()} TZS</strong>
        </div>
      </motion.header>

      <section className={styles.summaryGrid}>
        <SummaryCard icon={<ReceiptText />} label="All Orders" value={orders.length} tone="blue" />
        <SummaryCard icon={<Clock3 />} label="Pending" value={pendingCount} tone="orange" />
        <SummaryCard icon={<Truck />} label="Delivered" value={deliveredCount} tone="green" />
        <SummaryCard icon={<CheckCircle2 />} label="Completed" value={completedCount} tone="purple" />
      </section>

      <section className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, products, location..."
            aria-label="Search orders"
          />
        </div>

        <div className={styles.statusTabs}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              className={status === tab.key ? styles.activeTab : ""}
              onClick={() => setStatus(tab.key)}
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <button
          className={styles.viewToggle}
          onClick={() => setView((current) => (current === "cards" ? "table" : "cards"))}
          type="button"
        >
          {view === "cards" ? <Table2 size={18} /> : <Grid2X2 size={18} />}
          {view === "cards" ? "Table View" : "Card View"}
        </button>
      </section>

      {loading && (
        <div className={styles.emptyState}>
          <Clock3 size={28} />
          <h2>Loading your orders...</h2>
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className={styles.emptyState}>
          <ReceiptText size={30} />
          <h2>No orders found</h2>
          <p>No orders match your selected filter or search.</p>
        </div>
      )}

      {!loading && view === "cards" && (
        <section className={styles.grid}>
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const currentStatus = normalizeStatus(order.status);
              const isOpen = openOrderId === order.id;

              return (
                <motion.article
                  key={order.id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: Math.min(index * 0.04, 0.25) }}
                  whileHover={{ y: -6 }}
                >
                  <div className={styles.cardTop}>
                    <div>
                      <h2>
                        <ReceiptText size={21} />
                        Order #{order.id}
                      </h2>

                      <small>
                        <CalendarDays size={14} />
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "Recent order"}
                      </small>
                    </div>

                    <span className={`${styles.status} ${styles[currentStatus]}`}>
                      {currentStatus === "pending" && <Clock3 size={14} />}
                      {currentStatus === "delivered" && <Truck size={14} />}
                      {currentStatus === "completed" && <CheckCircle2 size={14} />}
                      {currentStatus}
                    </span>
                  </div>

                  <div className={styles.infoGrid}>
                    <p>
                      <UserRound size={16} />
                      <strong>Customer:</strong> {order.customer || "Logged user"}
                    </p>
                    <p>
                      <MapPin size={16} />
                      <strong>Address:</strong> {order.address || order.location || "Not added"}
                    </p>
                    <p>
                      <Wallet size={16} />
                      <strong>Total:</strong> {Number(order.total || 0).toLocaleString()} TZS
                    </p>
                    <p>
                      <PackageCheck size={16} />
                      <strong>Items:</strong> {order.items?.length || order.quantity || 0}
                    </p>
                  </div>

                  <button
                    className={styles.expandBtn}
                    onClick={() => toggleOrder(order.id)}
                    type="button"
                  >
                    <Eye size={17} />
                    {isOpen ? "Hide products" : "View products"}
                    {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className={styles.items}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {(order.items || []).map((item, itemIndex) => (
                          <div key={item.id || itemIndex} className={styles.item}>
                            <img src={getItemImage(item)} alt={getItemName(item)} />

                            <div>
                              <strong>{getItemName(item)}</strong>
                              <small>
                                Qty: {item.quantity || 1} •{" "}
                                {getItemPrice(item).toLocaleString()} TZS
                              </small>
                            </div>
                          </div>
                        ))}

                        {(!order.items || order.items.length === 0) && (
                          <p className={styles.noItems}>
                            <ImageIcon size={16} />
                            No product details available.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </section>
      )}

      {!loading && view === "table" && filteredOrders.length > 0 && (
        <section className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Products</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, index) => {
                const currentStatus = normalizeStatus(order.status);
                const firstItem = order.items?.[0];

                return (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className={styles.tableIcon}>
                        <ReceiptText size={16} />
                        #{order.id}
                      </span>
                    </td>
                    <td>{order.customer || "Logged user"}</td>
                    <td>
                      <span className={`${styles.status} ${styles[currentStatus]}`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td>
                      <div className={styles.productCell}>
                        <img
                          src={firstItem ? getItemImage(firstItem) : "/placeholder.png"}
                          alt={firstItem ? getItemName(firstItem) : "Product"}
                        />
                        <div>
                          <strong>
                            {firstItem ? getItemName(firstItem) : "No item"}
                          </strong>
                          <small>{order.items?.length || 0} product(s)</small>
                        </div>
                      </div>
                    </td>
                    <td>{Number(order.total || 0).toLocaleString()} TZS</td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Recent"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "blue" | "orange" | "green" | "purple";
}) {
  return (
    <motion.div
      className={`${styles.summaryCard} ${styles[tone]}`}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </motion.div>
  );
}
