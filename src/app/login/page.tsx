"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./login.module.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.user) {
        toast.error(data.error || "Login failed", { id: toastId });
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful 🎉", { id: toastId });

      if (data.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      toast.error("Server error", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login to continue</p>

          {/* EMAIL */}
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
              placeholder="Enter your email"
              aria-label="Email"
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>

          {/* BUTTON */}
          <button
            className={styles.button}
            onClick={login}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* LINK */}
          <p className={styles.linkText}>
            Don’t have an account?{" "}
            <span
              className={styles.link}
              onClick={() => router.push("/register")}
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}