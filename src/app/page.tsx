"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

import {
  FaCrown,
  FaGem,
  FaLeaf,
  FaRegHeart,
  FaPalette,
  FaTshirt,
} from "react-icons/fa";

export default function Home() {
  const [color, setColor] = useState("default");

  // ✅ SCROLL ANIMATION ENGINE
useEffect(() => {
  const elements = document.querySelectorAll(
    `.${styles.reveal}, .${styles.revealRight}, .${styles.revealScale}`
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.show);
        } else {
          // ✅ THIS ENABLES ANIMATE AGAIN WHEN SCROLLING UP/DOWN
          entry.target.classList.remove(styles.show);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  elements.forEach((el) => observer.observe(el));

  // cleanup (important for performance)
  return () => {
    elements.forEach((el) => observer.unobserve(el));
  };
}, []);

  return (
    <>
      <Navbar />

      {/* TOP */}
      <section className={`${styles.topGrid} ${styles.reveal}`}>
        <img src="/sectionlogo3.png" alt="Brand logo 1" />
        <img src="/sectionlogo4.png" alt="Brand logo 2" />
      </section>

      {/* SLOGAN + PALETTE */}
      <section className={styles.topRow}>
        <div className={`${styles.sloganSection} ${styles.reveal}`}>
          <p className={styles.label}>SLOGAN</p>
          <h2 className={styles.sloganText}>
            “Elegance in Every Layer”
          </h2>
        </div>

        <div className={`${styles.paletteSide} ${styles.revealRight}`}>
          <p className={styles.label}>COLOUR PALETTE</p>

          <div className={styles.colors}>
            <div onClick={() => setColor("noir")}>
              <span className={styles.c1}></span>
              <p>NOIR</p>
            </div>

            <div onClick={() => setColor("gold")}>
              <span className={styles.c2}></span>
              <p>GOLD</p>
            </div>

            <div onClick={() => setColor("champagne")}>
              <span className={styles.c3}></span>
              <p>CHAMPAGNE</p>
            </div>

            <div onClick={() => setColor("taupe")}>
              <span className={styles.c4}></span>
              <p>TAUPE</p>
            </div>

            <div onClick={() => setColor("rose")}>
              <span className={styles.c5}></span>
              <p>ROSE</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className={styles.mainGrid}>
        {/* LEFT */}
        <div className={styles.leftSide}>

          <div className={`${styles.altLogoSection} ${styles.reveal}`}>
            <p className={styles.label}>ALTERNATE LOGO</p>

            <div className={styles.logoGrid}>
            <img src="/alternate4.png" alt="Alternate logo design 1" />
<img src="/alternate5.png" alt="Alternate logo design 2" />
<img src="/alternate6.png" alt="Alternate logo design 3" />
            </div>
          </div>

          <div className={styles.typoVibeRow}>

            <div className={`${styles.typoBox} ${styles.reveal}`}>
              <p className={styles.label}>TYPOGRAPHY</p>
              <h4>PLAYFAIR DISPLAY</h4>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789</p>
            </div>

            <div className={`${styles.vibeBox} ${styles.revealRight}`}>
              <p className={styles.label}>BRAND VIBE</p>

              <div className={styles.vibe}>
                <div><FaCrown /><p>LUXURY</p></div>
                <div><FaRegHeart /><p>MODESTY</p></div>
                <div><FaTshirt /><p>ELEGANCE</p></div>
                <div><FaLeaf /><p>TIMELESS</p></div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={`${styles.imageSide} ${styles.revealScale}`}>
         <img src="/palette.png" alt="Luxury abaya fabric color palette design" />
        </div>
      </section>

      {/* STRIP */}
      <section className={`${styles.strip} ${styles.reveal}`}>
        <div><FaGem /> PREMIUM QUALITY</div>
        <div><FaPalette /> CAREFULLY CRAFTED</div>
        <div><FaTshirt /> LUXURIOUS FABRICS</div>
        <div><FaRegHeart /> MADE FOR YOU</div>
      </section>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} RIFY LUXE ABAYA
      </footer>
    </>
  );
}