"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";

type SidebarProps = {
  setPage: Dispatch<SetStateAction<string>>;
  activePage: string;
};

const PROFILE_PHOTO_KEY = "admin_profile_photo";

const menuItems = [
  { name: "dashboard", label: "Dashboard", icon: "📊" },
  { name: "products", label: "Products", icon: "🛍️" },
  { name: "orders", label: "Orders", icon: "📦" },
  { name: "users", label: "Users", icon: "👥" },
  { name: "customers", label: "Customers", icon: "📍" },
  { name: "messages", label: "Messages", icon: "💬" },
  { name: "cart", label: "Cart", icon: "🛒" },
  { name: "analytics", label: "Analytics", icon: "📈" },
  { name: "payments", label: "Payments", icon: "💳" },
  { name: "settings", label: "Settings", icon: "⚙️" },
  { name: "profile", label: "Profile", icon: "👤" },
];

export default function Sidebar({ setPage, activePage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);

    if (savedPhoto) {
      setImage(savedPhoto);
    }

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ photo: string }>;

      if (customEvent.detail?.photo) {
        setImage(customEvent.detail.photo);
        localStorage.setItem(PROFILE_PHOTO_KEY, customEvent.detail.photo);
      }
    };

    window.addEventListener("admin-profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("admin-profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
    localStorage.setItem(PROFILE_PHOTO_KEY, url);
  };

  const handleLogout = () => {
    const savedProfilePhoto = localStorage.getItem(PROFILE_PHOTO_KEY);

    localStorage.clear();

    if (savedProfilePhoto) {
      localStorage.setItem(PROFILE_PHOTO_KEY, savedProfilePhoto);
    }

    router.push("/login");
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.top}>
        <label className={styles.profile}>
          <input type="file" onChange={handleImageUpload} hidden />
          <img src={image || "/default-avatar.png"} alt="Admin profile" />
        </label>

        {!collapsed && (
          <div className={styles.titleBox}>
            <h2>Rify Admin</h2>
            <p>E-commerce Control</p>
          </div>
        )}

        <button
          className={styles.toggle}
          onClick={() => setCollapsed((v) => !v)}
          type="button"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={activePage === item.name ? styles.active : ""}
            onClick={() => setPage(item.name)}
            type="button"
            aria-label={item.label}
            title={item.label}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <button className={styles.logout} onClick={handleLogout} type="button">
        <span>🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
