"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserPlus,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import styles from "./login.module.css";

async function readJsonResponse(res: Response) {
  const text = await res.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: res.ok ? "Unexpected server response" : "Server error",
    };
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Signing in...");

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

      const data = await readJsonResponse(res);

      if (!res.ok || !data?.user) {
        toast.error(data.error || "Login failed", { id: toastId });
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful", { id: toastId });

      if (data.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      toast.error("Server error", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <motion.section
          className={styles.loginShell}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <aside className={styles.visualPanel}>
            <div className={styles.imageStage}>
              <img src="/hero.jpeg" alt="Rify Luxe abaya collection" />
              <span>
                <Sparkles size={15} />
                Rify Luxe
              </span>
            </div>

            <div className={styles.visualCopy}>
              <p className={styles.eyebrow}>
                <ShoppingBag size={15} />
                Customer access
              </p>
              <h1>Elegant shopping, secured for you.</h1>
              <div className={styles.featureStrip}>
                <span>
                  <PackageCheck size={15} />
                  Orders
                </span>
                <span>
                  <Truck size={15} />
                  Delivery
                </span>
                <span>
                  <ShieldCheck size={15} />
                  Profile
                </span>
              </div>
            </div>
          </aside>

          <motion.form
            className={styles.card}
            onSubmit={login}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.42 }}
          >
            <span className={styles.securePill}>
              <ShieldCheck size={15} />
              Secure sign in
            </span>

            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.subtitle}>
              Continue to your Rify Luxe dashboard.
            </p>

            <label className={styles.field} htmlFor="email">
              <span>Email address</span>
              <div className={styles.inputBox}>
                <Mail className={styles.icon} size={18} />
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className={styles.field} htmlFor="password">
              <span>Password</span>
              <div className={styles.inputBox}>
                <LockKeyhole className={styles.icon} size={18} />
                <input
                  id="password"
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  aria-label="Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  className={styles.passwordToggle}
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className={styles.spinnerIcon} size={18} />
                  Signing in
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className={styles.linkText}>
              New customer?
              <button
                className={styles.link}
                type="button"
                onClick={() => router.push("/register")}
              >
                <UserPlus size={15} />
                Create account
              </button>
            </p>
          </motion.form>
        </motion.section>
      </main>
    </div>
  );
}
