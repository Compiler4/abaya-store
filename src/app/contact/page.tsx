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

  // ⚡ FAST STATE UPDATE
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 SUBMIT HANDLER (FAST API READY)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

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

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/255713758200", "_blank");
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* HERO SECTION */}
      <motion.section
        className={styles.welcome}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.welcomeTitle}>
          Your Elegance, Our Commitment ✨
        </h1>

        <p className={styles.welcomeText}>
          At <strong>Rify Luxe Abaya</strong>, we are always ready to assist you.
          Send us a message anytime and we will respond quickly.
        </p>

        <p className={styles.welcomeSub}>
          💎 Fast response • Premium support • 24/7 availability
        </p>
      </motion.section>

      {/* FORM */}
      <motion.form
        className={styles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.title}>Contact Us</h2>

        {/* NAME */}
        <div className={styles.inputBox}>
          <FaUser />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </div>

        {/* EMAIL */}
        <div className={styles.inputBox}>
          <FaEnvelope />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </div>

        {/* PHONE */}
        <div className={styles.inputBox}>
          <FaPhone />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number (optional)"
          />
        </div>

        {/* LOCATION */}
        <div className={styles.inputBox}>
          <FaMapMarkerAlt />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
        </div>

        {/* MESSAGE */}
        <div className={styles.inputBox}>
          <FaComment />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button className={styles.submitBtn} disabled={loading}>
          <FaPaperPlane />
          {loading ? "Sending..." : "Send Message"}
        </button>

        {/* SUCCESS */}
        {success && (
          <motion.div
            className={styles.success}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaCheckCircle /> Message sent successfully!
          </motion.div>
        )}
      </motion.form>

      {/* INFO SECTION */}
      <motion.div className={styles.infoGrid}>
        <div className={styles.infoSection}>
          <h2>RIFY LUXE ABAYA</h2>
          <p>📧 rifylux@gmail.com</p>
          <p>📞 +255 713 758 200</p>
          <p>📍 Dar es Salaam, Tanzania</p>

          <button
  className={styles.iconBtn}
  onClick={openWhatsApp}
  aria-label="Open WhatsApp chat"
  title="Open WhatsApp chat"
>
  <FaWhatsapp />
</button>
        </div>

        <div className={styles.infoSection}>
          <h2>
            <FaBox /> Benefits
          </h2>
          <p>
            <FaStar /> Premium Quality
          </p>
          <p>
            <FaStar /> Elegant Design
          </p>
          <p>
            <FaStar /> Fast Delivery
          </p>
          <p>
            <FaStar /> Handmade Finish
          </p>
          <p>
            <FaStar /> Global Shipping
          </p>
        </div>
      </motion.div>
    </div>
  );
}