"use client";

import { useEffect, useState } from "react";
import styles from "./settings.module.css";

type SettingsState = {
  storeName: string;
  currency: string;
  tax: number;
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    storeName: "My Store",
    currency: "USD",
    tax: 10,
    theme: "light",
    language: "English",
    notifications: true,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("app-settings");
    if (data) setSettings(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings));
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(t);
  }, [settings]);

  const update = (key: keyof SettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>⚙️ Settings</h1>

        {saved && <div className={styles.saved}>✔ Saved</div>}

        {/* Store Name */}
        <div className={styles.card}>
          <label htmlFor="storeName">Store Name</label>
          <input
            id="storeName"
            value={settings.storeName}
            onChange={(e) => update("storeName", e.target.value)}
          />
        </div>

        {/* Currency */}
        <div className={styles.card}>
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={settings.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            <option>USD</option>
            <option>EUR</option>
            <option>TZS</option>
            <option>GBP</option>
          </select>
        </div>

        {/* Tax */}
        <div className={styles.card}>
          <label htmlFor="tax">Tax (%)</label>
          <input
            id="tax"
            type="number"
            value={settings.tax}
            onChange={(e) => update("tax", Number(e.target.value))}
          />
        </div>

        {/* Theme */}
        <div className={styles.cardRow}>
          <span>Dark Mode</span>
          <button
            onClick={() =>
              update("theme", settings.theme === "light" ? "dark" : "light")
            }
          >
            {settings.theme === "light" ? "Enable" : "Disable"}
          </button>
        </div>

        {/* Language */}
        <div className={styles.card}>
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => update("language", e.target.value)}
          >
            <option>English</option>
            <option>Swahili</option>
            <option>French</option>
          </select>
        </div>

        {/* Notifications */}
        <div className={styles.cardRow}>
          <span>Notifications</span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => update("notifications", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}