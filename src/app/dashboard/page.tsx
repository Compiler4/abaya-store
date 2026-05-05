"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./dashboard.module.css";

import {
  Home,
  MessageCircle,
  ShoppingCart,
  Package,
  ClipboardList,
  User,
  LogOut,
  Send,
  X,
  Plus,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* TYPES */
type Tab = "home" | "cart" | "orders" | "products" | "profile";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type OrderStatus = "pending" | "delivered" | "completed";

type Order = {
  id: number;
  status: OrderStatus;
  items: Product[];
};

type ChatMessage = {
  id: number;
  text: string;
  time: number;
};

export default function Dashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatOpen, setChatOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 75;

  const [profile, setProfile] = useState({
    name: "Logged User",
    email: "user@example.com",
    photo: "",
  });

  /* ================= FETCH PRODUCTS FROM BOTH APIs ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsRes, galleryRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/gallery"),
        ]);

        const productsData = await productsRes.json();
        const galleryData = await galleryRes.json();

        const merged = [...(productsData || []), ...(galleryData || [])];

        // remove duplicates by product id
        const unique = Array.from(
          new Map(merged.map((item: Product) => [item.id, item])).values()
        );

        setProducts(unique);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

/* ================= FETCH PRODUCTS FROM BOTH APIs ================= */
  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/gallery").then((r) => r.json()),
    ])
      .then(([productsData, galleryData]) => {
        const merged = [...(productsData || []), ...(galleryData || [])];

        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((p) => p.id === item.id)
        );

        setProducts(unique);
      })
      .catch(console.error);
  }, []);


  /* ================= CART ================= */
  const addToCart = (p: Product) => {
    setCart((prev) => [...prev, p]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  /* ================= PRODUCT FILTER + PAGINATION ================= */
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  /* ================= WHATSAPP ORDER ================= */
  const sendWhatsAppOrder = () => {
    if (!cart.length) return;

    const items = cart.map((c) => `📦 ${c.name} - ${c.price} TZS`).join("\n");

    const message = `🛒 NEW ORDER

${items}

TOTAL: ${total} TZS

Customer: ${profile.name}`;

    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  /* ================= CHAT ================= */
  const sendMessage = () => {
    if (!msg.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: msg,
        time: Date.now(),
      },
    ]);

    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setMsg("");
  };

  const avatar = profile.name.charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.profile}>
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="User profile"
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatar}>{avatar}</div>
          )}

          <div onClick={() => setActiveTab("profile")}>
            <p>{profile.name}</p>
            <small>{profile.email}</small>
          </div>
        </div>

        <div className={styles.nav}>
          <Nav icon={<Home />} label="Home" onClick={() => setActiveTab("home")} />
          <Nav
            icon={<MessageCircle />}
            label="Chat"
            onClick={() => setChatOpen(true)}
          />
          <Nav
            icon={<ShoppingCart />}
            label={`Cart (${cart.length})`}
            onClick={() => setActiveTab("cart")}
          />
          <Nav
            icon={<ClipboardList />}
            label="Orders"
            onClick={() => setActiveTab("orders")}
          />
          <Nav
            icon={<Package />}
            label="Products"
            onClick={() => setActiveTab("products")}
          />
          <Nav
            icon={<User />}
            label="Profile"
            onClick={() => setActiveTab("profile")}
          />
        </div>

        <div className={styles.right}>
          <button
            className={styles.logout}
            onClick={() => router.push("/login")}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className={styles.content}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* HOME */}
          {activeTab === "home" && <h2>👋 Welcome Dashboard</h2>}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <>
              <h2>🛍 Products</h2>

              <input
                className={styles.input}
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              <div className={styles.grid}>
                {paginated.map((p) => (
                  <motion.div key={p.id} className={styles.product}>
                    <img src={p.image} alt={p.name} />
                    <h4>{p.name}</h4>
                    <p>{p.price} TZS</p>

                    <button
                      className={styles.primaryBtn}
                      onClick={() => addToCart(p)}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className={styles.pagination}>
                <button
  onClick={prevPage}
  aria-label="Previous page"
  title="Previous page"
>
  <ChevronLeft />
</button>

<button
  onClick={nextPage}
  aria-label="Next page"
  title="Next page"
>
  <ChevronRight />
</button>

                <span>
                  Page {page} of {totalPages}
                </span>

               <button
  onClick={prevPage}
  aria-label="Previous page"
  title="Previous page"
>
  <ChevronLeft />
</button>
              </div>
            </>
          )}

          {/* CART */}
          {activeTab === "cart" && (
            <>
              <h2>🛒 Cart</h2>

              {cart.map((c, i) => (
                <div key={`${c.id}-${i}`} className={styles.cartItem}>
                  <img src={c.image} alt={c.name} className={styles.cartImg} />

                  <div className={styles.flexGrow}>
                    <p>{c.name}</p>
                    <small>{c.price} TZS</small>
                  </div>
<button
  onClick={() => removeFromCart(c.id)}
  aria-label="Remove from cart"
  title="Remove from cart"
>
  <Trash size={16} />
</button>
                </div>
              ))}

              <h3>Total: {total} TZS</h3>

              <button
                className={styles.primaryBtn}
                onClick={sendWhatsAppOrder}
              >
                Send WhatsApp Order
              </button>
            </>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <>
              <h2>📦 Order History</h2>

              {orders.length === 0 && <p>No orders yet</p>}

              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <strong>Order #{order.id}</strong>
                    <span className={`${styles.status} ${styles[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.orderItem}>
                        <img src={item.image} alt={item.name} />
                        <div>
                          <p>{item.name}</p>
                          <small>{item.price} TZS</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <>
              <h2>👤 Profile</h2>

           <label htmlFor="name" className={styles.label}>Name</label>
<input
  id="name"
  className={styles.input}
  placeholder="Enter your name"
  value={profile.name}
  onChange={(e) =>
    setProfile({ ...profile, name: e.target.value })
  }
/>

<label htmlFor="email" className={styles.label}>Email</label>
<input
  id="email"
  className={styles.input}
  placeholder="Enter your email"
  value={profile.email}
  onChange={(e) =>
    setProfile({ ...profile, email: e.target.value })
  }
/>

              <button className={styles.primaryBtn}>Save Profile</button>
            </>
          )}
        </motion.div>
      </main>

      {/* CHAT */}
      {chatOpen && (
        <div className={styles.chatModal}>
          <div className={styles.chatHeader}>
            <h3>💬 Chat Admin</h3>

           <button
  onClick={() => setChatOpen(false)}
  aria-label="Close chat"
  title="Close chat"
>
  <X />
</button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((m) => (
              <div key={m.id} className={styles.msg}>
                <p>{m.text}</p>

                <div className={styles.msgFooter}>
                  <small>{new Date(m.time).toLocaleTimeString()}</small>

                 <button
  onClick={() =>
    setMessages((prev) =>
      prev.filter((x) => x.id !== m.id)
    )
  }
  aria-label="Delete message"
  title="Delete message"
>
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Write message..."
            />
<button
  onClick={sendMessage}
  aria-label="Send message"
  title="Send message"
>
  <Send />
</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* NAV BUTTON */
function Nav({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
  className={styles.iconBtn}
  onClick={onClick}
  aria-label={label}
  title={label}
>
      {icon}
      <small>{label}</small>
    </button>
  );
}