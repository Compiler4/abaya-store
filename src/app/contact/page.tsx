"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaComment,
  FaPaperPlane,
  FaWhatsapp,
  FaCheckCircle,
  FaBox,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const msg = "Hello Rify Luxe Abaya, I need assistance.";
    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.contactHero}>
        <motion.div
          className={styles.welcome}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <motion.span
            className={styles.badge}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            Premium Support
          </motion.span>

          <h1 className={styles.welcomeTitle}>
            Your Elegance, Our Commitment
          </h1>

          <p className={styles.welcomeText}>
            At <strong>Rify Luxe Abaya</strong>, we are always ready to assist
            you. Send us a message anytime and we will respond quickly.
          </p>

          <div className={styles.quickStats}>
            {["Fast response", "Premium support", "24/7 availability"].map(
              (item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {item}
                </motion.span>
              )
            )}
          </div>

          <motion.button
            className={styles.heroWhatsapp}
            onClick={openWhatsApp}
            type="button"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            <FaWhatsapp />
            Chat on WhatsApp
          </motion.button>
        </motion.div>
      </section>

      <section className={styles.formSection}>
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <div className={styles.formHeader}>
            <p>Contact Form</p>
            <h2 className={styles.title}>Send Us a Message</h2>
          </div>

          <label className={styles.inputBox}>
            <FaUser />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </label>

          <label className={styles.inputBox}>
            <FaEnvelope />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </label>

          <label className={styles.inputBox}>
            <FaPhone />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number (optional)"
            />
          </label>

          <label className={styles.inputBox}>
            <FaMapMarkerAlt />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
            />
          </label>

          <label className={`${styles.inputBox} ${styles.messageBox}`}>
            <FaComment />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            />
          </label>

          <motion.button
            className={styles.submitBtn}
            disabled={loading}
            whileHover={!loading ? { y: -3, scale: 1.02 } : undefined}
            whileTap={!loading ? { scale: 0.97 } : undefined}
          >
            <FaPaperPlane />
            {loading ? "Sending..." : "Send Message"}
          </motion.button>

          {success && (
            <motion.div
              className={styles.success}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <FaCheckCircle /> Message sent successfully!
            </motion.div>
          )}
        </motion.form>
      </section>

      <motion.footer
        className={styles.footerDetails}
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <div className={styles.infoGrid}>
          <motion.div
            className={styles.infoSection}
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
          >
            <h2>RIFY LUXE ABAYA</h2>

            <div className={styles.contactLine}>
              <FaEnvelope />
              <span>rifylux@gmail.com</span>
            </div>

            <div className={styles.contactLine}>
              <FaPhone />
              <span>+255 713 758 200</span>
            </div>

            <div className={styles.contactLine}>
              <FaMapMarkerAlt />
              <span>Dar es Salaam, Tanzania</span>
            </div>

            <motion.button
              className={styles.iconBtn}
              onClick={openWhatsApp}
              aria-label="Open WhatsApp chat"
              title="Open WhatsApp chat"
              type="button"
              whileHover={{ scale: 1.12, rotate: 6 }}
              whileTap={{ scale: 0.92 }}
            >
              <FaWhatsapp />
            </motion.button>
          </motion.div>

          <motion.div
            className={styles.infoSection}
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
          >
            <h2>
              <FaBox /> Benefits
            </h2>

            <div className={styles.benefits}>
              {[
                "Premium Quality",
                "Elegant Design",
                "Fast Delivery",
                "Handmade Finish",
                "Global Shipping",
              ].map((item) => (
                <motion.p
                  key={item}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaStar /> {item}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>

        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} RIFY LUXE ABAYA
        </p>
      </motion.footer>
    </main>
  );
}
