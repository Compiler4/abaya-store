"use client";

import { useEffect, useState } from "react";
import styles from "./product.module.css";

export default function ProductPage({ params }: any) {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [params.id]);

  if (!product) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}   // ✅ FIXED (accessibility)
        className={styles.image}
      />

      {/* INFO */}
      <div className={styles.info}>
        <h1>{product.name}</h1>
        <h2>${product.price}</h2>

        <p className={styles.desc}>
          Luxury premium abaya collection with modern design.
        </p>

        <button className={styles.button}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}