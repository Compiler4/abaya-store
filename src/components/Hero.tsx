"use client";

import { useEffect } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY * 0.2;

      // set CSS variable globally (NO inline styles on element)
      document.documentElement.style.setProperty(
        "--parallax",
        `${offset}px`
      );
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // initialize on load

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className={styles.hero}>Luxury Abaya Collection</div>;
}