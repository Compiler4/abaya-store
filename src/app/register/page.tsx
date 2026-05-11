"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./register.module.css";
import {
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaShieldAlt,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const register = async () => {
    if (loading) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", text: data.error || "Registration failed" });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setMsg({ type: "success", text: "Account created successfully" });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1600);
    } catch {
      setMsg({ type: "error", text: "Network error" });
    }

    setLoading(false);
  };

  return (
    <main className={styles.page}>
      <Navbar />

      <div className={styles.background} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      {msg && (
        <div
          className={`${styles.toast} ${
            msg.type === "success" ? styles.success : styles.error
          }`}
        >
          {msg.type === "success" ? <FaCheckCircle /> : <FaTimes />}
          {msg.text}
        </div>
      )}

      <section className={styles.container}>
        <div className={styles.visualPanel}>
          <span className={styles.badge}>
            <FaShieldAlt />
            Secure Registration
          </span>

          <h1>Join Rify Luxe Abaya</h1>

          <p>
            Create your account to shop premium modest fashion, track orders,
            and receive personalized support.
          </p>

          <div className={styles.featureGrid}>
            <div>
              <FaCheckCircle />
              Fast checkout
            </div>

            <div>
              <FaCheckCircle />
              Order tracking
            </div>

            <div>
              <FaCheckCircle />
              Premium support
            </div>
          </div>
        </div>

        <form
          className={styles.card}
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <FaUserPlus />
            </div>

            <div>
              <h2 className={styles.title}>Create Account</h2>
              <p className={styles.subtitle}>Start your elegant journey</p>
            </div>
          </div>

          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <div className={styles.inputBox}>
            <FaEnvelope className={styles.icon} />
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
            {email && (
              <button
                className={styles.clearBtn}
                type="button"
                onClick={() => setEmail("")}
                aria-label="Clear email"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <label className={styles.label} htmlFor="phone">
            Phone
          </label>
          <div className={styles.inputBox}>
            <FaPhone className={styles.icon} />
            <input
              id="phone"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone"
            />
            {phone && (
              <button
                className={styles.clearBtn}
                type="button"
                onClick={() => setPhone("")}
                aria-label="Clear phone"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              id="password"
              className={styles.input}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              required
            />

            <button
              className={styles.clearBtn}
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            {password && (
              <button
                className={styles.clearBtn}
                type="button"
                onClick={() => setPassword("")}
                aria-label="Clear password"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            <FaUserPlus />
            {loading ? "Creating..." : "Register"}
          </button>

          <p className={styles.linkText}>
            Already have account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={styles.link}
            >
              Login
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
