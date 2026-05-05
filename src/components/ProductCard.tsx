"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProductCard.module.css";
import { FaShoppingCart, FaWhatsapp } from "react-icons/fa";

export default function ProductCard({ product }: any) {
  const [view, setView] = useState(false);
  const [order, setOrder] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [qty, setQty] = useState(1);

  const whatsappNumber = "255652466413";

  const handleWhatsApp = () => {
    const msg = `🛍️ ORDER

Name: ${name}
Phone: ${phone}
Location: ${location}

Product: ${product.name}
Qty: ${qty}
Price: $${product.price}

Image: ${product.image}
`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <>
      {/* CARD */}
      <motion.div
        className={styles.card}
        whileHover={{ scale: 1.05, y: -8 }}
        onClick={() => setView(true)}
      >
        <motion.img
          src={product.image}
          className={styles.image}
          whileHover={{ scale: 1.2 }}
        />

        <h4>{product.name}</h4>
        <p>${product.price}</p>

        <button
          className={styles.cartBtn}
          onClick={(e) => {
            e.stopPropagation();
            setOrder(true);
          }}
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </motion.div>

      {/* FULL VIEW */}
      <AnimatePresence>
        {view && (
          <motion.div className={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className={styles.content} initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
              
              <button className={styles.close} onClick={() => setView(false)}>✕</button>

              <img src={product.image} className={styles.fullImage} />

              <h2>{product.name}</h2>
              <p>{product.description}</p>

              <button
                className={styles.smallBtn}
                onClick={() => setOrder(true)}
              >
                <FaShoppingCart /> Order
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORDER FORM */}
      <AnimatePresence>
        {order && (
          <motion.div className={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className={styles.form} initial={{ y: 100 }} animate={{ y: 0 }}>

              <button className={styles.close} onClick={() => setOrder(false)}>✕</button>

              <h3>Complete Order</h3>

              <input
  className={styles.input}
  placeholder="Name"
  onChange={(e) => setName(e.target.value)}
/>

<input
  className={styles.input}
  placeholder="Phone"
  onChange={(e) => setPhone(e.target.value)}
/>

<input
  className={styles.input}
  placeholder="Location"
  onChange={(e) => setLocation(e.target.value)}
/>

<input
  className={styles.input}
  type="number"
  value={qty}
  onChange={(e) => setQty(Number(e.target.value))}
/>
              <button className={styles.whatsapp} onClick={handleWhatsApp}>
                <FaWhatsapp /> Send Order
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}