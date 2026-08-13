"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readStoredJson } from "@/lib/safe-storage";
import styles from "./dashboard.module.css";

import {
  AtSign,
  Bell,
  Bot,
  Boxes,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Eraser,
  Home,
  ImageIcon,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessagesSquare,
  Package,
  PackageCheck,
  Phone,
  Plus,
  ReceiptText,
  Save,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash,
  Truck,
  User,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

type Tab = "home" | "cart" | "orders" | "products" | "profile";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

type OrderStatus = "pending" | "delivered" | "completed";

type Order = {
  id: number;
  status: OrderStatus;
  items: Product[];
  total: number;
  customer: string;
  phone: string;
  location: string;
  createdAt: string;
};

type ChatMessage = {
  id: number;
  text: string;
  time: number;
  sender: "user" | "bot";
};

type MessageReply = {
  id: number;
  customerName: string;
  customerContact: string;
  message: string;
  channel: string;
  read: boolean;
  createdAt: string;
};

type ReplyNotification = {
  id: string;
  replyId: number;
  text: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type Category = {
  name: string;
  keywords: string[];
};

type StoredUser = {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  photo?: string;
  address?: string;
  location?: string;
};

const ADMIN_PHONE = "255713758200";
const DELETED_REPLIES_KEY = "customer_deleted_reply_notifications";
const READ_REPLIES_KEY = "customer_read_reply_notifications";

const categories: Category[] = [
  { name: "All", keywords: [] },
  { name: "Abaya", keywords: ["abaya", "jilbab", "kaftan", "modest"] },
  { name: "Hijab", keywords: ["hijab", "scarf", "shawl", "khimar"] },
  { name: "Dresses", keywords: ["dress", "gown", "maxi", "robe"] },
  { name: "Shoes", keywords: ["shoe", "shoes", "heel", "sandal", "sneaker"] },
  { name: "Bags", keywords: ["bag", "handbag", "purse", "clutch"] },
  { name: "Accessories", keywords: ["accessory", "belt", "pin", "brooch"] },
  { name: "Beauty", keywords: ["beauty", "makeup", "lipstick", "cosmetic"] },
  { name: "Perfume", keywords: ["perfume", "fragrance", "oud", "attar"] },
];

function loadSavedIds(key: string) {
  if (typeof window === "undefined") return [];

  try {
    const ids = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch {
    return [];
  }
}

function saveIds(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
}

function normalizeList(data: unknown): Product[] {
  if (Array.isArray(data)) return data as Product[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  const list = record.products || record.gallery || record.data;

  return Array.isArray(list) ? (list as Product[]) : [];
}

function inferCategory(product: Product) {
  const realCategory = product.category?.trim();

  if (realCategory) {
    const matched = categories.find(
      (category) =>
        category.name.toLowerCase() === realCategory.toLowerCase() ||
        category.keywords.some((keyword) =>
          realCategory.toLowerCase().includes(keyword)
        )
    );

    return matched?.name || realCategory;
  }

  const text = `${product.name || ""} ${
    product.description || ""
  }`.toLowerCase();

  return (
    categories.find(
      (category) =>
        category.name !== "All" &&
        category.keywords.some((keyword) => text.includes(keyword))
    )?.name || "Other"
  );
}

function getBotReply(message: string, adminPhone: string) {
  const text = message.toLowerCase();

  if (/(hello|hi|hey|mambo|habari|salam)/.test(text)) {
    return "Hello, welcome to Rify Luxe Abaya. I can help with products, orders, delivery, payment, sizes, location, and contacting admin.";
  }

  if (/(price|bei|cost|gharama)/.test(text)) {
    return "Product prices depend on the item selected. Open Products, choose the item you like, add it to cart, then admin will confirm price and availability.";
  }

  if (/(delivery|deliver|shipping|usafirishaji|location|mkoa|address)/.test(text)) {
    return "Delivery is available by location. Please send your name, phone number, and location, or use Cart > Order Now to send delivery details.";
  }

  if (/(order|buy|purchase|nunua|cart)/.test(text)) {
    return "To order: open Products, add items to cart, open Cart, click Order Now, fill name, phone, location, and address, then send order to admin.";
  }

  if (/(payment|pay|malipo|mpesa|tigo|airtel|cash)/.test(text)) {
    return "Payment details are confirmed by admin after your order is reviewed. Send your order first, then admin will guide you on payment.";
  }

  if (/(admin|phone|whatsapp|call|number|contact)/.test(text)) {
    return `You can contact admin directly using +${adminPhone}. Your message has also been sent to the admin dashboard.`;
  }

  if (/(size|sizes|rangi|color|colour|available|stock)/.test(text)) {
    return "For size, color, and stock availability, send the product name or add it to cart and submit an order. Admin will confirm availability.";
  }

  if (/(abaya|hijab|dress|shoes|bag|accessories|beauty|perfume)/.test(text)) {
    return "You can browse by category in Products. We have Abaya, Hijab, Dresses, Shoes, Bags, Accessories, Beauty, and Perfume.";
  }

  if (/(thanks|thank you|asante|shukran)/.test(text)) {
    return "You are welcome. Rify Luxe admin will assist you as soon as possible.";
  }

  return `Thank you. I sent your message to admin dashboard. Please include product name, phone number, and location if this is about an order. Urgent help: +${adminPhone}.`;
}

export default function Dashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [msg, setMsg] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      text: `Hello. I am Rify Luxe support bot. Ask me about products, orders, delivery, payment, sizes, or admin contact. For urgent help call or WhatsApp +${ADMIN_PHONE}.`,
      time: 0,
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 75;

  const [profile, setProfile] = useState({
    id: 0,
    name: "Logged User",
    email: "user@example.com",
    phone: "",
    photo: "",
    location: "",
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    location: "",
    address: "",
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const [replyNotifications, setReplyNotifications] = useState<
    ReplyNotification[]
  >([]);
  const [deletedReplyIds, setDeletedReplyIds] = useState<string[]>([]);
  const [readReplyIds, setReadReplyIds] = useState<string[]>([]);
  const [openNotifications, setOpenNotifications] = useState(false);

  useEffect(() => {
    const loadStoredDashboardState = () => {
      const user = readStoredJson<StoredUser | null>("user", null, {
        clearInvalid: true,
      });

      if (user && typeof user === "object") {
        const email = String(user.email || "user@example.com");
        const loadedProfile = {
          id: Number(user.id || 0),
          name: String(user.name || email.split("@")[0] || "Logged User"),
          email,
          phone: String(user.phone || ""),
          photo: String(user.image || user.photo || ""),
          location: String(user.address || user.location || ""),
        };

        setProfile(loadedProfile);
        setOrderForm({
          name: loadedProfile.name,
          phone: loadedProfile.phone,
          location: loadedProfile.location,
          address: loadedProfile.location,
        });
      }

      setDeletedReplyIds(loadSavedIds(DELETED_REPLIES_KEY));
      setReadReplyIds(loadSavedIds(READ_REPLIES_KEY));
    };

    const timeout = window.setTimeout(loadStoredDashboardState, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsRes, galleryRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/gallery", { cache: "no-store" }),
        ]);

        const productsList = normalizeList(await productsRes.json());
        const galleryList = normalizeList(await galleryRes.json());
        const merged = [...productsList, ...galleryList];

        const unique = Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );

        setProducts(unique);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReplies = async () => {
      const contacts = [profile.email, profile.phone].filter(Boolean);

      if (contacts.length === 0) return;

      try {
        const responses = await Promise.all(
          contacts.map((contact) =>
            fetch(
              `/api/messages/replies?contact=${encodeURIComponent(contact)}`,
              {
                cache: "no-store",
              }
            )
          )
        );

        const data = await Promise.all(responses.map((res) => res.json()));
        const replies: MessageReply[] = data.flatMap((item) => {
          const list = item?.replies || item?.data;
          return Array.isArray(list) ? list : [];
        });

        const deletedSet = new Set(deletedReplyIds);
        const readSet = new Set(readReplyIds);

        setReplyNotifications(
          replies
            .map((reply) => ({
              id: `reply-${reply.id}`,
              replyId: reply.id,
              text: "Admin replied to your message",
              message: reply.message,
              read: readSet.has(`reply-${reply.id}`),
              createdAt: reply.createdAt,
            }))
            .filter((item) => !deletedSet.has(item.id))
        );
      } catch (error) {
        console.error("Failed to fetch admin replies:", error);
      }
    };

    fetchReplies();
    const interval = setInterval(fetchReplies, 10000);

    return () => clearInterval(interval);
  }, [profile.email, profile.phone, deletedReplyIds, readReplyIds]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const category = inferCategory(product);
      counts.set(category, (counts.get(category) || 0) + 1);
    });

    counts.set("All", products.length);
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return products.filter((product) => {
      const category = inferCategory(product);
      const text = `${product.name || ""} ${
        product.description || ""
      } ${category}`.toLowerCase();

      const matchesCategory =
        selectedCategory === "All" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesCategory && (!term || text.includes(term));
    });
  }, [products, search, selectedCategory]);

  const unreadReplyCount = replyNotifications.filter((n) => !n.read).length;
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const avatar = profile.name.charAt(0).toUpperCase();
  const featuredProducts = products.slice(0, 4);
  const cartPreview = cart.slice(0, 3);
  const latestOrder = orders[0];
  const profileCompleteness =
    [profile.name, profile.email, profile.phone, profile.location].filter(
      Boolean
    ).length * 25;
  const popularCategories = Array.from(categoryCounts.entries())
    .filter(([name, count]) => name !== "All" && count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const openTab = (tab: Tab) => {
    setActiveTab(tab);
    setChatOpen(false);
    setMobileNavOpen(false);
  };

  const openChat = () => {
    setChatOpen(true);
    setMobileNavOpen(false);
  };

  const markReplyAsRead = (id: string) => {
    setReadReplyIds((prev) => {
      const next = Array.from(new Set([...prev, id]));
      saveIds(READ_REPLIES_KEY, next);
      return next;
    });

    setReplyNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteReplyNotification = (id: string) => {
    setDeletedReplyIds((prev) => {
      const next = Array.from(new Set([...prev, id]));
      saveIds(DELETED_REPLIES_KEY, next);
      return next;
    });

    setReplyNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearReplyNotifications = () => {
    const ids = replyNotifications.map((n) => n.id);

    setDeletedReplyIds((prev) => {
      const next = Array.from(new Set([...prev, ...ids]));
      saveIds(DELETED_REPLIES_KEY, next);
      return next;
    });

    setReplyNotifications([]);
  };

  const deleteChatMessage = (id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const clearChatMessages = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: `Chat cleared. I am still here to help. Ask about products, orders, delivery, payment, or contact admin on +${ADMIN_PHONE}.`,
        time: Date.now(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!msg.trim()) return;

    const text = msg.trim();

    const customerMessage: ChatMessage = {
      id: Date.now(),
      text,
      time: Date.now(),
      sender: "user",
    };

    setMessages((prev) => [...prev, customerMessage]);
    setMsg("");
    setBotTyping(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          name: profile.name,
          contact: profile.phone || profile.email,
          location: profile.location || orderForm.location || "Not added",
          message: text,
        }),
      });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: getBotReply(text, ADMIN_PHONE),
            time: Date.now(),
          },
        ]);
        setBotTyping(false);
      }, 700);
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            sender: "bot",
            text: `Sorry, I could not send your message to admin dashboard. Try again or contact admin directly on +${ADMIN_PHONE}.`,
            time: Date.now(),
          },
        ]);
        setBotTyping(false);
      }, 500);
    }
  };

  const placeOrder = async () => {
    if (!cart.length || placingOrder) return;

    setPlacingOrder(true);

    const payload = {
      total,
      status: "PENDING",
      address: orderForm.address || orderForm.location || "Not added",
      customer: orderForm.name || profile.name,
      phone: orderForm.phone || profile.phone || "Not added",
      location: orderForm.location || profile.location || "Not added",
      userId: profile.id,
      quantity: cart.length,
      items: cart.map((item) => ({
        productId: Number(item.id),
        quantity: 1,
        price: Number(item.price || 0),
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setOrders((prev) => [
        {
          id: data?.order?.id || Date.now(),
          status: "pending",
          items: cart,
          total,
          customer: payload.customer,
          phone: payload.phone,
          location: payload.location,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setCart([]);
      setCheckoutOpen(false);
      openTab("orders");
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const saveProfile = async () => {
    if (profileSaving) return;

    setProfileSaving(true);

    const body = new FormData();
    body.append("name", profile.name);
    body.append("email", profile.email);
    body.append("phone", profile.phone);
    body.append("address", profile.location);
    if (profilePhotoFile) body.append("photo", profilePhotoFile);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        body,
      });

      const data = await res.json();
      const updatedPhoto =
        data?.profile?.photo || data?.profile?.image || profile.photo;

      const updatedProfile = {
        ...profile,
        photo: updatedPhoto,
      };

      setProfile(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      setProfilePhotoFile(null);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.profile}
          onClick={() => openTab("profile")}
          type="button"
          aria-label="Open profile"
          title="Open profile"
        >
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="User profile"
              className={styles.avatarImg}
            />
          ) : (
            <span className={styles.avatar}>
              <UserRound size={19} />
              {avatar}
            </span>
          )}

          <span className={styles.profileText}>
            <strong>
              <ShieldCheck size={15} />
              {profile.name}
            </strong>
            <small>
              <AtSign size={13} />
              {profile.email}
            </small>
          </span>
        </button>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileNavOpen((prev) => !prev)}
          type="button"
          aria-label="Open navigation menu"
          title="Open navigation menu"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {mobileNavOpen && (
          <button
            className={styles.navBackdrop}
            onClick={() => setMobileNavOpen(false)}
            type="button"
            aria-label="Close navigation menu"
            title="Close navigation menu"
          />
        )}

        <nav
          className={`${styles.nav} ${mobileNavOpen ? styles.navOpen : ""}`}
        >
          <Nav
            icon={<Home />}
            label="Home"
            active={activeTab === "home"}
            onClick={() => openTab("home")}
          />

          <Nav
            icon={<MessageCircle />}
            label="Chat"
            active={chatOpen}
            onClick={openChat}
          />

          <Nav
            icon={<ShoppingCart />}
            label={`Cart (${cart.length})`}
            active={activeTab === "cart"}
            onClick={() => openTab("cart")}
          />

          <Nav
            icon={<ClipboardList />}
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => openTab("orders")}
          />

          <Nav
            icon={<Package />}
            label="Products"
            active={activeTab === "products"}
            onClick={() => openTab("products")}
          />

          <Nav
            icon={<User />}
            label="Profile"
            active={activeTab === "profile"}
            onClick={() => openTab("profile")}
          />
        </nav>

        <div className={styles.rightActions}>
          <div className={styles.notificationWrapper}>
            <button
              className={styles.notificationBtn}
              onClick={() => setOpenNotifications((prev) => !prev)}
              aria-label="Open notifications"
              title="Admin replies"
              type="button"
            >
              <Bell size={19} />
              {unreadReplyCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadReplyCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {openNotifications && (
                <motion.div
                  className={styles.notificationDropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                >
                  <div className={styles.notificationHeader}>
                    <div>
                      <strong>
                        <MessagesSquare size={16} />
                        Admin Replies
                      </strong>
                      <small>
                        <Mail size={13} />
                        {unreadReplyCount} unread
                      </small>
                    </div>

                    {replyNotifications.length > 0 && (
                      <button
                        className={styles.clearNotifications}
                        onClick={clearReplyNotifications}
                        type="button"
                      >
                        <Trash size={14} />
                        Clear
                      </button>
                    )}
                  </div>

                  {replyNotifications.length === 0 ? (
                    <p className={styles.notificationEmpty}>
                      <CheckCircle2 size={16} />
                      No replies yet.
                    </p>
                  ) : (
                    <div className={styles.notificationList}>
                      {replyNotifications.map((n) => (
                        <motion.div
                          key={n.id}
                          className={`${styles.replyNotification} ${
                            n.read ? styles.replyRead : styles.replyUnread
                          }`}
                        >
                          <button
                            className={styles.replyNotificationText}
                            onClick={() => markReplyAsRead(n.id)}
                            type="button"
                          >
                            <span>
                              {n.read ? (
                                <CheckCircle2 size={15} />
                              ) : (
                                <Mail size={15} />
                              )}
                              {n.text}
                            </span>
                            <p>{n.message}</p>
                            <small>
                              <Clock3 size={13} />
                              {new Date(n.createdAt).toLocaleString()}
                            </small>
                          </button>

                          <button
                            className={styles.deleteNotification}
                            onClick={() => deleteReplyNotification(n.id)}
                            aria-label="Delete notification"
                            title="Delete notification"
                            type="button"
                          >
                            <X size={15} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className={styles.logout}
            onClick={() => router.push("/login")}
            type="button"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={styles.card}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "home" && (
              <div className={styles.customerDashboard}>
                <section className={styles.dashboardHero}>
                  <div className={styles.heroCopy}>
                    <p className={styles.kicker}>
                      <Sparkles size={14} />
                      Customer dashboard
                    </p>
                    <h2>
                      <Home size={28} />
                      Welcome back, {profile.name}
                    </h2>
                    <p className={styles.muted}>
                      Browse new arrivals, follow your cart, chat with admin,
                      and keep your profile ready for quick checkout.
                    </p>

                    <div className={styles.heroActions}>
                      <button
                        className={styles.primaryBtn}
                        onClick={() => openTab("products")}
                        type="button"
                      >
                        <Package size={16} />
                        Shop products
                      </button>
                      <button
                        className={styles.secondaryBtn}
                        onClick={openChat}
                        type="button"
                      >
                        <MessageCircle size={16} />
                        Chat admin
                      </button>
                    </div>
                  </div>

                  <div className={styles.heroPreview}>
                    <span>
                      <ShieldCheck size={15} />
                      Secure customer area
                    </span>
                    <strong>{profileCompleteness}%</strong>
                    <small>Profile readiness</small>
                    <div className={styles.progressBar}>
                      <i style={{ width: `${profileCompleteness}%` }} />
                    </div>
                  </div>
                </section>

                <div className={styles.statsGrid}>
                  <Stat icon={<Boxes />} label="Products" value={products.length} />
                  <Stat icon={<ShoppingCart />} label="Cart Items" value={cart.length} />
                  <Stat icon={<ReceiptText />} label="Orders" value={orders.length} />
                  <Stat icon={<MessagesSquare />} label="Admin Replies" value={unreadReplyCount} />
                </div>

                <div className={styles.dashboardPanels}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <p className={styles.kicker}>
                          <PackageCheck size={14} />
                          Featured
                        </p>
                        <h3>Latest pieces</h3>
                      </div>
                      <button
                        className={styles.smallAction}
                        onClick={() => openTab("products")}
                        type="button"
                      >
                        View all <ChevronRight size={15} />
                      </button>
                    </div>

                    <div className={styles.previewGrid}>
                      {featuredProducts.map((product, index) => (
                        <motion.button
                          key={product.id}
                          className={styles.previewProduct}
                          onClick={() => setSelectedImage(product.image)}
                          type="button"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <img src={product.image} alt={product.name} />
                          <span>{inferCategory(product)}</span>
                          <strong>{product.name}</strong>
                        </motion.button>
                      ))}

                      {featuredProducts.length === 0 && (
                        <p className={styles.empty}>
                          <Package size={18} />
                          Products will appear here after they load.
                        </p>
                      )}
                    </div>
                  </section>

                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <p className={styles.kicker}>
                          <ShoppingCart size={14} />
                          Cart
                        </p>
                        <h3>Ready checkout</h3>
                      </div>
                      <span className={styles.badge}>{cart.length} items</span>
                    </div>

                    <div className={styles.cartSummary}>
                      {cartPreview.map((item, index) => (
                        <div key={`${item.id}-preview-${index}`}>
                          <img src={item.image} alt={item.name} />
                          <span>
                            <strong>{item.name}</strong>
                            <small>{Number(item.price || 0).toLocaleString()} TZS</small>
                          </span>
                        </div>
                      ))}

                      {cart.length === 0 && (
                        <p className={styles.empty}>
                          <ShoppingCart size={18} />
                          Your cart is waiting for your first item.
                        </p>
                      )}
                    </div>

                    <button
                      className={styles.primaryBtn}
                      onClick={() => openTab(cart.length ? "cart" : "products")}
                      type="button"
                    >
                      <Truck size={16} />
                      {cart.length ? "Review cart" : "Start shopping"}
                    </button>
                  </section>
                </div>

                <div className={styles.dashboardPanels}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <p className={styles.kicker}>
                          <ReceiptText size={14} />
                          Orders
                        </p>
                        <h3>Latest order</h3>
                      </div>
                      <button
                        className={styles.smallAction}
                        onClick={() => openTab("orders")}
                        type="button"
                      >
                        History <ChevronRight size={15} />
                      </button>
                    </div>

                    {latestOrder ? (
                      <div className={styles.latestOrder}>
                        <span className={`${styles.status} ${styles[latestOrder.status]}`}>
                          {latestOrder.status}
                        </span>
                        <strong>Order #{latestOrder.id}</strong>
                        <small>{(latestOrder.items || []).length} items - {latestOrder.total.toLocaleString()} TZS</small>
                      </div>
                    ) : (
                      <p className={styles.empty}>
                        <ReceiptText size={18} />
                        No order has been placed yet.
                      </p>
                    )}
                  </section>

                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <p className={styles.kicker}>
                          <Boxes size={14} />
                          Categories
                        </p>
                        <h3>Popular sections</h3>
                      </div>
                    </div>

                    <div className={styles.categoryPulseGrid}>
                      {popularCategories.map(([name, count]) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(name);
                            setPage(1);
                            openTab("products");
                          }}
                        >
                          <Package size={15} />
                          <span>{name}</span>
                          <strong>{count}</strong>
                        </button>
                      ))}

                      {popularCategories.length === 0 && (
                        <p className={styles.empty}>
                          <Boxes size={18} />
                          Categories will appear when products load.
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <p className={styles.kicker}>
                      <Sparkles size={14} />
                      Shop
                    </p>
                    <h2>
                      <Package size={28} />
                      Products
                    </h2>
                  </div>
                  <span className={styles.badge}>
                    <Boxes size={15} />
                    {filtered.length} items
                  </span>
                </div>

                <div className={styles.categoryBar}>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className={`${styles.categoryBtn} ${
                        selectedCategory === category.name
                          ? styles.activeCategory
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setPage(1);
                      }}
                      type="button"
                    >
                      <Package size={15} />
                      {category.name}
                      <span>{categoryCounts.get(category.name) || 0}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.searchBox}>
                  <Search size={18} />
                  <input
                    className={styles.input}
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className={styles.grid}>
                  {paginated.map((p, index) => (
                    <motion.div
                      key={p.id}
                      className={styles.product}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.015, 0.25) }}
                      whileHover={{ y: -6 }}
                    >
                      <button
                        className={styles.imageButton}
                        onClick={() => setSelectedImage(p.image)}
                        type="button"
                        aria-label={`Preview ${p.name}`}
                        title={`Preview ${p.name}`}
                      >
                        <img src={p.image} alt={p.name} />
                        <span className={styles.imageHint}>
                          <ImageIcon size={15} />
                          Preview
                        </span>
                      </button>

                      <h4>
                        <PackageCheck size={16} />
                        {p.name}
                      </h4>

                      <p>{inferCategory(p)}</p>

                      <button
                        className={styles.primaryBtn}
                        onClick={() => setCart((prev) => [...prev, p])}
                        type="button"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </motion.div>
                  ))}
                </div>

                {paginated.length === 0 && (
                  <p className={styles.empty}>
                    <Package size={18} />
                    No products found.
                  </p>
                )}

                <div className={styles.pagination}>
                  <button
                    onClick={() => page > 1 && setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    type="button"
                    aria-label="Previous page"
                    title="Previous page"
                  >
                    <ChevronLeft />
                  </button>

                  <span>
                    <ClipboardList size={15} />
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      page < totalPages && setPage((prev) => prev + 1)
                    }
                    disabled={page === totalPages}
                    type="button"
                    aria-label="Next page"
                    title="Next page"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </>
            )}

            {activeTab === "cart" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <p className={styles.kicker}>
                      <ShoppingCart size={14} />
                      Checkout
                    </p>
                    <h2>
                      <ShoppingCart size={28} />
                      Cart
                    </h2>
                  </div>
                  <span className={styles.badge}>{cart.length} items</span>
                </div>

                {cart.length === 0 && (
                  <p className={styles.empty}>
                    <ShoppingCart size={18} />
                    Your cart is empty.
                  </p>
                )}

                {cart.map((c, i) => (
                  <motion.div key={`${c.id}-${i}`} className={styles.cartItem}>
                    <img
                      src={c.image}
                      alt={c.name}
                      className={styles.cartImg}
                    />

                    <div className={styles.flexGrow}>
                      <p>
                        <PackageCheck size={15} />
                        {c.name}
                      </p>
                      <small>
                        <Wallet size={13} />
                        {c.price} TZS
                      </small>
                    </div>

                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.filter((item) => item.id !== c.id)
                        )
                      }
                      type="button"
                      aria-label={`Remove ${c.name} from cart`}
                      title={`Remove ${c.name} from cart`}
                    >
                      <Trash size={16} />
                    </button>
                  </motion.div>
                ))}

                <h3 className={styles.totalLine}>
                  <Wallet size={20} />
                  Total: {total.toLocaleString()} TZS
                </h3>

                <button
                  className={styles.primaryBtn}
                  disabled={!cart.length}
                  onClick={() => setCheckoutOpen((prev) => !prev)}
                  type="button"
                >
                  <Truck size={16} />
                  {checkoutOpen ? "Hide Order Form" : "Order Now"}
                </button>

                {checkoutOpen && (
                  <div className={styles.orderForm}>
                    <label className={styles.label} htmlFor="order-name">
                      <UserRound size={15} />
                      Name
                    </label>
                    <input
                      id="order-name"
                      className={styles.input}
                      value={orderForm.name}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, name: e.target.value })
                      }
                    />

                    <label className={styles.label} htmlFor="order-phone">
                      <Phone size={15} />
                      Phone
                    </label>
                    <input
                      id="order-phone"
                      className={styles.input}
                      value={orderForm.phone}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, phone: e.target.value })
                      }
                    />

                    <label className={styles.label} htmlFor="order-location">
                      <MapPin size={15} />
                      Location
                    </label>
                    <input
                      id="order-location"
                      className={styles.input}
                      value={orderForm.location}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          location: e.target.value,
                        })
                      }
                    />

                    <label className={styles.label} htmlFor="order-address">
                      <MapPin size={15} />
                      Address
                    </label>
                    <input
                      id="order-address"
                      className={styles.input}
                      value={orderForm.address}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          address: e.target.value,
                        })
                      }
                    />

                    <button
                      className={styles.primaryBtn}
                      onClick={placeOrder}
                      disabled={placingOrder || !cart.length}
                      type="button"
                    >
                      <Send size={16} />
                      {placingOrder
                        ? "Sending Order..."
                        : "Send Order To Admin"}
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === "orders" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <p className={styles.kicker}>
                      <ReceiptText size={14} />
                      History
                    </p>
                    <h2>
                      <ClipboardList size={28} />
                      Order History
                    </h2>
                  </div>
                </div>

                {orders.length === 0 && (
                  <p className={styles.empty}>No orders yet.</p>
                )}

                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <strong>Order #{order.id}</strong>
                      <span
                        className={`${styles.status} ${
                          styles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p>
                      <strong>Customer:</strong> {order.customer}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.phone}
                    </p>
                    <p>
                      <strong>Location:</strong> {order.location}
                    </p>
                    <p>
                      <strong>Total:</strong> {order.total.toLocaleString()} TZS
                    </p>

                    <div className={styles.orderItems}>
                      {(order.items || []).map((item, i) => (
                        <div
                          key={`${item.id}-${i}`}
                          className={styles.orderItem}
                        >
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

            {activeTab === "profile" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <p className={styles.kicker}>
                      <UserRound size={14} />
                      Account
                    </p>
                    <h2>
                      <User size={28} />
                      Profile
                    </h2>
                  </div>
                </div>

                <label className={styles.profilePhotoBox}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setProfilePhotoFile(file);
                      if (file) {
                        setProfile({
                          ...profile,
                          photo: URL.createObjectURL(file),
                        });
                      }
                    }}
                  />

                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile preview" />
                  ) : (
                    <span>{avatar}</span>
                  )}

                  <b>
                    <Camera size={16} />
                    Change Photo
                  </b>
                </label>

                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  id="name"
                  className={styles.input}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />

                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  className={styles.input}
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />

                <label htmlFor="phone" className={styles.label}>
                  Phone
                </label>
                <input
                  id="phone"
                  className={styles.input}
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />

                <label htmlFor="location" className={styles.label}>
                  Location
                </label>
                <input
                  id="location"
                  className={styles.input}
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                />

                <button
                  className={styles.primaryBtn}
                  onClick={saveProfile}
                  disabled={profileSaving}
                  type="button"
                >
                  <Save size={16} />
                  {profileSaving ? "Saving..." : "Save Profile"}
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className={styles.chatModal}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
          >
            <div className={styles.chatHeader}>
              <h3>
                <MessageCircle size={19} />
                Chat Admin
              </h3>

              <div className={styles.chatActions}>
                <button
                  onClick={clearChatMessages}
                  aria-label="Clear chat"
                  title="Clear chat"
                  type="button"
                >
                  <Eraser size={17} />
                </button>

                <button
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                  title="Close chat"
                  type="button"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className={styles.chatBody}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`${styles.msg} ${
                    m.sender === "bot" ? styles.botMsg : styles.userMsg
                  }`}
                >
                  <p>
                    {m.sender === "bot" ? (
                      <Bot size={15} />
                    ) : (
                      <MessageCircle size={15} />
                    )}
                    {m.text}
                  </p>

                  <div className={styles.msgFooter}>
                    <small>
                      <Clock3 size={13} />
                      {m.time ? new Date(m.time).toLocaleTimeString() : "Now"}
                    </small>

                    <button
                      onClick={() => deleteChatMessage(m.id)}
                      aria-label="Delete message"
                      title="Delete message"
                      type="button"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {botTyping && (
                <div
                  className={`${styles.msg} ${styles.botMsg} ${styles.typingMsg}`}
                >
                  <p>
                    <Bot size={15} />
                    Rify bot is typing...
                  </p>
                </div>
              )}
            </div>

            <div className={styles.chatInput}>
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask about orders, delivery, payment..."
              />

              <button
                onClick={sendMessage}
                aria-label="Send message"
                title="Send message"
                type="button"
              >
                <Send />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles.imageModal}
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage}
              alt="Product preview"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Nav({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.iconBtn} ${active ? styles.activeNav : ""}`}
      onClick={onClick}
      type="button"
      aria-label={label}
      title={label}
    >
      {icon}
      <small>{label}</small>
    </button>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <motion.div className={styles.statCard} whileHover={{ y: -4, scale: 1.02 }}>
      <span className={styles.statIcon}>{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </motion.div>
  );
}
