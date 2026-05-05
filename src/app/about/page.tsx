"use client";

import Navbar from "@/components/Navbar";
import styles from "./about.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaWhatsapp,
  FaShippingFast,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";

export default function AboutPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "sw" | "ar">("en");

  const t = {
    en: {
      heroTitle: "Luxury Modest Fashion Reimagined",
      heroDesc:
        "Rify Luxe Abaya blends timeless elegance with modern sophistication crafted for women who value true beauty.",

      stats1: "Clients",
      stats2: "Orders",
      stats3: "Rating",

      fast: "Fast Delivery",
      support: "24/7 Support",
      secure: "Secure Payments",

      aboutTitle: "About Rify Luxe Abaya",
      aboutText:
        "A world-class modest fashion house blending elegance, craftsmanship, and modern luxury for confident women.",

      faqTitle: "Smart FAQ Assistant",

      q1: "How long is delivery?",
      q2: "Do you ship worldwide?",
      q3: "Is it handmade?",

      a1: "2–5 working days delivery.",
      a2: "Yes, global shipping available.",
      a3: "Yes, handcrafted premium quality.",

      chat: "Welcome 👋 How can we help you?",
    },

    sw: {
      heroTitle: "Mavazi ya Kifahari ya Heshima",
      heroDesc:
        "Rify Luxe Abaya inaleta mchanganyiko wa urembo wa kisasa na heshima ya kipekee.",

      stats1: "Wateja",
      stats2: "Oda",
      stats3: "Tathmini",

      fast: "Uwasilishaji Haraka",
      support: "Huduma 24/7",
      secure: "Malipo Salama",

      aboutTitle: "Kuhusu Rify Luxe Abaya",
      aboutText:
        "Chapa ya kimataifa ya mavazi ya heshima yenye ubora na ubunifu wa kisasa.",

      faqTitle: "Msaada wa Maswali",

      q1: "Uwasilishaji unachukua muda gani?",
      q2: "Mnasafirisha kimataifa?",
      q3: "Je ni ya mikono?",

      a1: "Siku 2–5 za kazi.",
      a2: "Ndiyo, tunasafirisha dunia nzima.",
      a3: "Ndiyo, imetengenezwa kwa mikono.",

      chat: "Karibu 👋 Tusaidieje?",
    },

    ar: {
      heroTitle: "إعادة تعريف الأزياء المحتشمة الفاخرة",
      heroDesc: "ريفاي لوكس عباية تمثل الأناقة والفخامة بأسلوب عصري.",

      stats1: "عملاء",
      stats2: "طلبات",
      stats3: "تقييم",

      fast: "توصيل سريع",
      support: "دعم 24/7",
      secure: "دفع آمن",

      aboutTitle: "عن ريفاي لوكس عباية",
      aboutText:
        "علامة فاخرة للأزياء المحتشمة تجمع بين الأناقة والجودة والحرفية.",

      faqTitle: "الأسئلة الشائعة",

      q1: "كم مدة التوصيل؟",
      q2: "هل تشحنون دولياً؟",
      q3: "هل هو مصنوع يدوياً؟",

      a1: "2–5 أيام عمل.",
      a2: "نعم، نشحن عالمياً.",
      a3: "نعم، مصنوع يدوياً.",

      chat: "مرحباً 👋 كيف يمكننا مساعدتك؟",
    },
  };

  const faq = [
    { q: t[lang].q1, a: t[lang].a1 },
    { q: t[lang].q2, a: t[lang].a2 },
    { q: t[lang].q3, a: t[lang].a3 },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* 🌐 LANGUAGE SWITCH */}
      <div className={styles.langWrap}>
        {["en", "sw", "ar"].map((l) => (
          <button
            key={l}
            className={styles.langBtn}
            aria-label={`Switch language to ${l}`}
            onClick={() => setLang(l as any)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* HERO TEXT */}
      <section className={styles.heroText}>
        <div className={styles.marquee}>
          <span>
            RIFY LUXE ABAYA • LUXURY MODEST FASHION • ELEGANCE • PREMIUM DESIGN •
          </span>
        </div>

        <motion.div
          className={styles.heroCenter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{t[lang].heroTitle}</h1>
          <p>{t[lang].heroDesc}</p>
        </motion.div>
      </section>

      {/* COUNTERS */}
      <section className={styles.counters}>
        <div><h2>500+</h2><p>{t[lang].stats1}</p></div>
        <div><h2>1000+</h2><p>{t[lang].stats2}</p></div>
        <div><h2>5★</h2><p>{t[lang].stats3}</p></div>
      </section>

      {/* FEATURE CARDS (FIXED + ANIMATED) */}
      <section className={styles.grid}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <FaShippingFast />
          <h3>{t[lang].fast}</h3>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaHeadset />
          <h3>{t[lang].support}</h3>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <FaShieldAlt />
          <h3>{t[lang].secure}</h3>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className={styles.section}>
        <h2>{t[lang].aboutTitle}</h2>
        <p>{t[lang].aboutText}</p>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <h2>{t[lang].faqTitle}</h2>

        {faq.map((item, i) => (
          <div key={i} className={styles.faqItem}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-label={`Toggle FAQ ${i}`}
            >
              {item.q}
            </button>

            {open === i && <p>{item.a}</p>}
          </div>
        ))}
      </section>

      {/* CHAT */}
      <button
        className={styles.chatBtn}
        aria-label="Open live chat support"
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </button>

      {chatOpen && (
        <div className={styles.chatBox}>
          <p>{t[lang].chat}</p>
          <input placeholder="..." />
        </div>
      )}

      {/* WHATSAPP */}
      <button
        className={styles.whatsapp}
        aria-label="Chat on WhatsApp"
        onClick={() => window.open("https://wa.me/255713758200")}
      >
        <FaWhatsapp />
      </button>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Rify Luxe Abaya
      </footer>
    </div>
  );
}