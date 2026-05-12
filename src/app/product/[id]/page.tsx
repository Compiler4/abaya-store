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

  if (!product)
    return <p className={styles.notFound}>Loading...</p>;

  return (
    <div className={styles.container}>
      
      <div className={styles.imageWrapper}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
        />
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>{product.name}</h1>

        <h2 className={styles.price}>
          ${product.price}
        </h2>

        <p className={styles.description}>
          Luxury premium abaya collection with modern design.
        </p>

        <button className={styles.button}>
          Add to Cart
        </button>
      </div>

    </div>
  );
}