"use client";

import { useEffect, useState } from "react";
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

const colors = [
  { id: "noir", name: "NOIR", className: "c1" },
  { id: "gold", name: "GOLD", className: "c2" },
  { id: "champagne", name: "CHAMPAGNE", className: "c3" },
  { id: "taupe", name: "TAUPE", className: "c4" },
  { id: "rose", name: "ROSE", className: "c5" },
];

export default function Home() {
  const [color, setColor] = useState("default");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll(
      `.${styles.reveal}, .${styles.revealRight}, .${styles.revealScale}`
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(styles.show, entry.isIntersecting);
        });
      },
      { threshold: 0.18 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <main className={`${styles.page} ${styles[color]}`}>
      <Navbar />

      <section className={`${styles.topGrid} ${styles.reveal}`}>
        <button
          className={styles.imageButton}
          onClick={() => setSelectedImage("/sectionlogo3.png")}
          aria-label="Open brand logo 1"
        >
          <img src="/sectionlogo3.png" alt="Brand logo 1" />
        </button>

        <button
          className={styles.imageButton}
          onClick={() => setSelectedImage("/sectionlogo4.png")}
          aria-label="Open brand logo 2"
        >
          <img src="/sectionlogo4.png" alt="Brand logo 2" />
        </button>
      </section>

      <section className={styles.topRow}>
        <div className={`${styles.sloganSection} ${styles.reveal}`}>
          <p className={styles.label}>SLOGAN</p>
          <h2 className={styles.sloganText}>“Elegance in Every Layer”</h2>
        </div>

        <div className={`${styles.paletteSide} ${styles.revealRight}`}>
          <p className={styles.label}>COLOUR PALETTE</p>

          <div className={styles.colors}>
            {colors.map((item) => (
              <button
                key={item.id}
                className={`${styles.colorItem} ${
                  color === item.id ? styles.activeColor : ""
                }`}
                onClick={() => setColor(item.id)}
                type="button"
              >
                <span className={styles[item.className]} />
                <p>{item.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.mainGrid}>
        <div className={styles.leftSide}>
          <div className={`${styles.altLogoSection} ${styles.reveal}`}>
            <p className={styles.label}>ALTERNATE LOGO</p>

            <div className={styles.logoGrid}>
              {["/alternate4.png", "/alternate5.png", "/alternate6.png"].map(
                (src, index) => (
                  <button
                    key={src}
                    className={styles.logoButton}
                    onClick={() => setSelectedImage(src)}
                    aria-label={`Open alternate logo ${index + 1}`}
                  >
                    <img src={src} alt={`Alternate logo design ${index + 1}`} />
                  </button>
                )
              )}
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
                <div>
                  <FaCrown />
                  <p>LUXURY</p>
                </div>

                <div>
                  <FaRegHeart />
                  <p>MODESTY</p>
                </div>

                <div>
                  <FaTshirt />
                  <p>ELEGANCE</p>
                </div>

                <div>
                  <FaLeaf />
                  <p>TIMELESS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`${styles.imageSide} ${styles.revealScale}`}
          onClick={() => setSelectedImage("/palette.png")}
          aria-label="Open palette image"
        >
          <img
            src="/palette.png"
            alt="Luxury abaya fabric color palette design"
          />
        </button>
      </section>

      <section className={`${styles.strip} ${styles.reveal}`}>
        <div>
          <FaGem /> PREMIUM QUALITY
        </div>

        <div>
          <FaPalette /> CAREFULLY CRAFTED
        </div>

        <div>
          <FaTshirt /> LUXURIOUS FABRICS
        </div>

        <div>
          <FaRegHeart /> MADE FOR YOU
        </div>
      </section>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} RIFY LUXE ABAYA
      </footer>

      {selectedImage && (
        <div
          className={styles.imageModal}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className={styles.modalImage}
            alt="Large preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
