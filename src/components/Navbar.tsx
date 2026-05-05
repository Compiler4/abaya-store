"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  Home,
  ShoppingBag,
  Info,
  Phone,
  User,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className={styles.navbar}>
        
        {/* LOGO */}
        <div className={styles.logoSection}>
          
          {/* 🟡 YOUR UPLOADED LOGO */}
          <Image
            src="/alternate4.png"
            alt="Rify Luxe Abaya Logo"
            width={55}
            height={55}
            className={styles.logoImg}
          />

          <div className={styles.brand}>Rify Luxe Abaya</div>
        </div>

        {/* DESKTOP LINKS */}
        <div className={styles.links}>
          
          <Link href="/" className={styles.link} onClick={() => setActive("home")}>
            <Home size={16} /> Home
          </Link>

          <Link href="/products" className={styles.link}>
            <ShoppingBag size={16} /> Products
          </Link>

          <Link href="/about" className={styles.link}>
            <Info size={16} /> About
          </Link>

          <Link href="/contact" className={styles.link}>
            <Phone size={16} /> Contact
          </Link>

          <Link href="/register" className={styles.registerBtn}>
            <UserPlus size={16} /> Register
          </Link>

          <Link href="/login" className={styles.loginBtn}>
            <User size={16} /> Login
          </Link>
        </div>

        {/* 🍔 MOBILE MENU BUTTON */}
        <div className={styles.menuBtn} onClick={() => setOpen(true)}>
          <Menu size={26} />
        </div>
      </div>

      {/* 🧊 MOBILE DRAWER */}
      <div className={`${styles.drawer} ${open ? styles.open : ""}`}>
        
        <div className={styles.close} onClick={closeMenu}>
          <X size={26} />
        </div>

        <Link href="/" onClick={closeMenu}>Home</Link>
        <Link href="/products" onClick={closeMenu}>Products</Link>
        <Link href="/about" onClick={closeMenu}>About</Link>
        <Link href="/contact" onClick={closeMenu}>Contact</Link>

        <Link href="/register" onClick={closeMenu}>Register</Link>
        <Link href="/login" onClick={closeMenu}>Login</Link>
      </div>
    </>
  );
}