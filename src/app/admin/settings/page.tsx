"use client";

import {
  CheckCircle2,
  LockKeyhole,
  RefreshCcw,
  Save,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import styles from "../sharedAdmin.module.css";

type SettingsKey =
  | "allowOrders"
  | "allowRegistration"
  | "maintenance"
  | "requireAdminApproval";

const defaultSettings: Record<SettingsKey, boolean> = {
  allowOrders: true,
  allowRegistration: true,
  maintenance: false,
  requireAdminApproval: true,
};

const settingLabels: Record<SettingsKey, string> = {
  allowOrders: "Allow orders",
  allowRegistration: "Allow user registration",
  maintenance: "Maintenance mode",
  requireAdminApproval: "Require admin approval",
};

const settingDescriptions: Record<SettingsKey, string> = {
  allowOrders: "Customers can place new orders when this is enabled.",
  allowRegistration: "New users can create accounts when this is enabled.",
  maintenance: "Temporarily restrict system access during maintenance.",
  requireAdminApproval: "New sensitive actions need admin approval.",
};

function SettingIcon({ type }: { type: SettingsKey }) {
  if (type === "allowOrders") return <ShoppingBag size={24} />;
  if (type === "allowRegistration") return <UserPlus size={24} />;
  if (type === "maintenance") return <Wrench size={24} />;
  return <LockKeyhole size={24} />;
}

export default function SettingsPage() {
  const baseId = useId();

  const [settings, setSettings] =
    useState<Record<SettingsKey, boolean>>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const loaded = data.settings || data.data || data;

        setSettings({
          allowOrders: loaded.allowOrders ?? defaultSettings.allowOrders,
          allowRegistration:
            loaded.allowRegistration ?? defaultSettings.allowRegistration,
          maintenance: loaded.maintenance ?? defaultSettings.maintenance,
          requireAdminApproval:
            loaded.requireAdminApproval ??
            defaultSettings.requireAdminApproval,
        });
      })
      .catch(() => {});
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);

    await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 2500);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setSaved(false);
  };

  const toggleSetting = (key: SettingsKey) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setSaved(false);
  };

  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>System</p>
          <h1>
            <Settings size={30} /> Settings & Restrictions
          </h1>
        </div>

        <span className={styles.status}>
          <ShieldCheck size={14} /> {enabledCount} Enabled
        </span>
      </div>

      <section className={styles.grid}>
        {(Object.entries(settings) as [SettingsKey, boolean][]).map(
          ([key, value]) => {
            const inputId = `${baseId}-${key}`;

            return (
              <div
                key={key}
                className={`${styles.card} ${
                  value ? styles.selectedCard : ""
                }`}
              >
                <div className={styles.rowBetween}>
                  <div className={styles.settingContent}>
                    <div className={styles.settingIcon}>
                      <SettingIcon type={key} />
                    </div>

                    <div>
                      <h2>{settingLabels[key]}</h2>
                      <p>{settingDescriptions[key]}</p>

                      <span
                        className={`${styles.status} ${
                          value ? styles.completed : styles.pending
                        }`}
                      >
                        {value ? (
                          <>
                            <CheckCircle2 size={13} /> Enabled
                          </>
                        ) : (
                          <>
                            <XCircle size={13} /> Disabled
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <label className={styles.switch} htmlFor={inputId}>
                    <span className={styles.srOnly}>
                      {settingLabels[key]}
                    </span>

                    <input
                      id={inputId}
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleSetting(key)}
                    />

                    <span aria-hidden="true" />
                  </label>
                </div>
              </div>
            );
          }
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.rowBetween}>
          <div>
            <h2>
              <ShieldAlert size={22} /> System Control
            </h2>
            <p>
              Save changes after adjusting restrictions. Reset restores the
              recommended default configuration.
            </p>

            {saved && (
              <span className={`${styles.status} ${styles.completed}`}>
                <CheckCircle2 size={13} /> Settings saved successfully
              </span>
            )}
          </div>

          <div className={styles.actionGroup}>
            <button
              className={styles.primaryBtn}
              onClick={saveSettings}
              disabled={saving}
              type="button"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              className={styles.iconAction}
              onClick={resetSettings}
              aria-label="Reset settings"
              title="Reset settings"
              type="button"
            >
              <RefreshCcw size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
