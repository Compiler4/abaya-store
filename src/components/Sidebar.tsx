"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";

type SidebarProps = {
  setPage: Dispatch<SetStateAction<string>>;
  open?: boolean; // ✅ NEW
};

export default function Sidebar({ setPage, open }: SidebarProps) {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const router = useRouter();

  // 🎯 FINAL STATE CONTROL
  const finalOpen = open ?? !collapsed;

  // 📸 HANDLE IMAGE UPLOAD
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // 🔘 MENU BUTTON
  const MenuBtn = ({
    name,
    label,
    icon,
  }: {
    name: string;
    label: string;
    icon: string;
  }) => (
    <button
      className={active === name ? styles.active : ""}
      onClick={() => {
        setActive(name);
        setPage(name);
      }}
    >
      <span className={styles.icon}>{icon}</span>
      {finalOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div
      className={`${styles.sidebar} ${
        !finalOpen ? styles.sidebarClosed : ""
      }`}
    >
      {/* TOP */}
      <div className={styles.top}>
        {/* PROFILE */}
        <label className={styles.profile}>
          <input type="file" onChange={handleImageUpload} hidden />
          <img src={image || "/default-avatar.png"} alt="profile" />
        </label>

        {finalOpen && <h2 className={styles.title}>🛒 Admin</h2>}

        {/* TOGGLE (only if open is not controlled externally) */}
        {open === undefined && (
          <button
            className={styles.toggle}
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        )}
      </div>

      {/* MENU */}
      <div className={styles.menu}>
        <MenuBtn name="dashboard" label="Dashboard" icon="📊" />
        <MenuBtn name="products" label="Products" icon="🛍️" />
        <MenuBtn name="orders" label="Orders" icon="📦" />
        <MenuBtn name="users" label="Users" icon="👥" />
        <MenuBtn name="cart" label="Cart" icon="🛒" />
        <MenuBtn name="analytics" label="Analytics" icon="📊" />
        <MenuBtn name="payments" label="Payments" icon="💳" />
        <MenuBtn name="settings" label="Settings" icon="⚙️" />
        <MenuBtn name="profile" label="Profile" icon="👤" />
      </div>

      {/* LOGOUT */}
      <button className={styles.logout} onClick={handleLogout}>
        <span>🚪</span>
        {finalOpen && <span>Logout</span>}
      </button>
    </div>
  );
}