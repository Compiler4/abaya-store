"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./register.module.css";
import { FaEnvelope, FaLock, FaPhone, FaTimes } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const register = async () => {
    if (loading) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      setMsg({ type: "success", text: "Account created successfully 🎉" });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch {
      setMsg({ type: "error", text: "Network error" });
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.background}></div>

      {msg && (
        <div className={`${styles.toast} ${msg.type === "success" ? styles.success : styles.error}`}>
          {msg.text}
        </div>
      )}

      <div className={styles.container}>
        {/* ANIMATED CARD */}
        <div className={styles.card}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join us and start now</p>

          {/* EMAIL */}
          <label className={styles.label}>Email</label>
          <div className={styles.inputBox}>
            <FaEnvelope className={styles.icon} />
            <input
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            {email && <FaTimes className={styles.clear} onClick={() => setEmail("")} />}
          </div>

          {/* PHONE */}
          <label className={styles.label}>Phone</label>
          <div className={styles.inputBox}>
            <FaPhone className={styles.icon} />
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone"
            />
            {phone && <FaTimes className={styles.clear} onClick={() => setPhone("")} />}
          </div>

          {/* PASSWORD */}
          <label className={styles.label}>Password</label>
          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
            />
            {password && <FaTimes className={styles.clear} onClick={() => setPassword("")} />}
          </div>

          {/* BUTTON */}
          <button className={styles.button} onClick={register} disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>

          <p className={styles.linkText}>
            Already have account?{" "}
            <span onClick={() => router.push("/login")} className={styles.link}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}