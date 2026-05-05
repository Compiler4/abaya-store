"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "./Products.module.css";
import { useCart } from "@/store/cart";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [openCart, setOpenCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ PAGINATION STATE
  const [page, setPage] = useState(1);
  const perPage = 75;

  const cart = useCart((s) => s.cart);
  const addToCart = useCart((s) => s.addToCart);
  const removeFromCart = useCart((s) => s.removeFromCart);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    location: "",
    photo: null as any,
  });

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setProducts(data || []));
  }, []);

  // 🔍 FILTER
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // 📦 PAGINATION LOGIC
  const totalPages = Math.ceil(filtered.length / perPage);

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const total = cart.reduce(
    (sum: number, item: any) => sum + (item.price || 0),
    0
  );

  const buyWhatsApp = (p: any) => {
    const msg = `I want to buy:\n${p.name}\nPrice: ${p.price}`;
    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const sendOrder = () => {
    const items = cart.map((c: any) => `- ${c.name}`).join("\n");

    const msg = `
NEW ORDER:

${items}

TOTAL: ${total} TZS

Name: ${customer.name}
Phone: ${customer.phone}
Location: ${customer.location}
`;

    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <div className={styles.navbarFixed}>
        <Navbar />
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        <input
          className={styles.search}
          placeholder="Search products..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on search
          }}
        />

        <button
          className={styles.cartButton}
          onClick={() => setOpenCart(true)}
        >
          🛒 {cart.length}
        </button>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {paginated.map((p) => (
          <div key={p.id} className={styles.card}>
            <img
              src={p.image}
              className={styles.productImage}
              alt={p.name ? `Product: ${p.name}` : "Product image"}
              onClick={() => setSelectedImage(p.image)}
            />

            <div className={styles.productName}>{p.name}</div>

            <div className={styles.desc}>
              Luxury modern abaya design for elegant fashion.
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.addBtn}`}
                onClick={() => addToCart(p)}
              >
                🧺 Add
              </button>

              <button
                className={`${styles.btn} ${styles.waBtn}`}
                onClick={() => buyWhatsApp(p)}
              >
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 📄 PAGINATION CONTROLS */}
      <div className={styles.pagination}>
       <button
  onClick={prevPage}
  disabled={page === 1}
  className={styles.navBtn}
  aria-label="Previous page"
  title="Previous page"
>
  <FaChevronLeft />
</button>

<span className={styles.pageInfo}>
  Page {page} of {totalPages || 1}
</span>

<button
  onClick={nextPage}
  disabled={page === totalPages}
  className={styles.navBtn}
  aria-label="Next page"
  title="Next page"
>
  <FaChevronRight />
</button>
      </div>

      {/* CART */}
      {openCart && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setOpenCart(false)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setOpenCart(false)}
            >
              ❌ Close
            </button>

            <h3>🛒 Cart</h3>

            {cart.map((c: any, i: number) => (
              <div key={i} className={styles.cartItem}>
                <span>{c.name}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(c.id)}
                >
                  Delete
                </button>
              </div>
            ))}

            <div className={styles.total}>Total: {total} TZS</div>

            <button className={styles.cartWaBtn}>
              💚 Buy via WhatsApp
            </button>

            <button
              className={styles.orderBtn}
              onClick={() => setCheckout(true)}
            >
              Order Now
            </button>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className={styles.imageModal}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className={styles.modalImage}
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
}