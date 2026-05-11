"use client";

import Navbar from "@/components/Navbar";
import styles from "./about.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FaWhatsapp,
  FaShippingFast,
  FaHeadset,
  FaShieldAlt,
  FaChevronDown,
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
      a1: "2-5 working days delivery.",
      a2: "Yes, global shipping available.",
      a3: "Yes, handcrafted premium quality.",
      chat: "Welcome. How can we help you?",
      placeholder: "Type your message...",
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
      a1: "Siku 2-5 za kazi.",
      a2: "Ndiyo, tunasafirisha dunia nzima.",
      a3: "Ndiyo, imetengenezwa kwa mikono.",
      chat: "Karibu. Tusaidieje?",
      placeholder: "Andika ujumbe...",
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
      a1: "2-5 أيام عمل.",
      a2: "نعم، نشحن عالمياً.",
      a3: "نعم، مصنوع يدوياً.",
      chat: "مرحباً. كيف يمكننا مساعدتك؟",
      placeholder: "اكتب رسالتك...",
    },
  };

  const faq = [
    { q: t[lang].q1, a: t[lang].a1 },
    { q: t[lang].q2, a: t[lang].a2 },
    { q: t[lang].q3, a: t[lang].a3 },
  ];

  const features = [
    { icon: <FaShippingFast />, title: t[lang].fast },
    { icon: <FaHeadset />, title: t[lang].support },
    { icon: <FaShieldAlt />, title: t[lang].secure },
  ];

  return (
    <main className={styles.page} dir={lang === "ar" ? "rtl" : "ltr"}>
      <Navbar />

      <div className={styles.langWrap}>
        {(["en", "sw", "ar"] as const).map((l) => (
          <motion.button
            key={l}
            className={`${styles.langBtn} ${lang === l ? styles.activeLang : ""}`}
            aria-label={`Switch language to ${l}`}
            onClick={() => setLang(l)}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
          >
            {l.toUpperCase()}
          </motion.button>
        ))}
      </div>

      <section className={styles.heroText}>
        <div className={styles.marquee}>
          <span>
            RIFY LUXE ABAYA • LUXURY MODEST FASHION • ELEGANCE • PREMIUM DESIGN •
          </span>
        </div>

        <motion.div
          key={lang}
          className={styles.heroCenter}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1>{t[lang].heroTitle}</h1>
          <p>{t[lang].heroDesc}</p>
        </motion.div>
      </section>

      <section className={styles.counters}>
        {[
          ["500+", t[lang].stats1],
          ["1000+", t[lang].stats2],
          ["5★", t[lang].stats3],
        ].map(([number, label], index) => (
          <motion.div
            key={label}
            className={styles.counterCard}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            <h2>{number}</h2>
            <p>{label}</p>
          </motion.div>
        ))}
      </section>

      <section className={styles.grid}>
        {features.map((item, index) => (
          <motion.div
            key={item.title}
            className={styles.card}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -10, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: false, amount: 0.25 }}
          >
            <div className={styles.cardIcon}>{item.icon}</div>
            <h3>{item.title}</h3>
          </motion.div>
        ))}
      </section>

      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.55 }}
      >
        <h2>{t[lang].aboutTitle}</h2>
        <p>{t[lang].aboutText}</p>
      </motion.section>

      <section className={styles.faq}>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          {t[lang].faqTitle}
        </motion.h2>

        {faq.map((item, i) => (
          <motion.div
            key={`${lang}-${i}`}
            className={styles.faqItem}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <button onClick={() => setOpen(open === i ? null : i)}>
              <span>{item.q}</span>
              <FaChevronDown className={open === i ? styles.rotateIcon : ""} />
            </button>

            <AnimatePresence>
              {open === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>

      <motion.button
        className={styles.chatBtn}
        aria-label="Open live chat support"
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.1, rotate: 4 }}
        whileTap={{ scale: 0.92 }}
      >
        💬
      </motion.button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className={styles.chatBox}
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.92 }}
          >
            <p>{t[lang].chat}</p>
            <input placeholder={t[lang].placeholder} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={styles.whatsapp}
        aria-label="Chat on WhatsApp"
        onClick={() => window.open("https://wa.me/255713758200", "_blank")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <FaWhatsapp />
      </motion.button>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Rify Luxe Abaya
      </footer>
    </main>
  );
}
