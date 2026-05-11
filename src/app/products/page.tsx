"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "./Products.module.css";
import { useCart } from "@/store/cart";
import {
  FaBoxOpen,
  FaChevronLeft,
  FaChevronRight,
  FaGem,
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaShoePrints,
  FaSprayCan,
  FaTimes,
  FaTrash,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";
import {
  GiAmpleDress,
  GiDelicatePerfume,
  GiDiamondRing,
  GiHandBag,
  GiLipstick,
  GiWrappedSweet,
} from "react-icons/gi";
import {
  MdCategory,
  MdLocalOffer,
  MdOutlineInventory2,
  MdPhone,
  MdPhotoCamera,
  MdStyle,
} from "react-icons/md";

type Product = {
  id: number | string;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  description?: string;
};

type CartProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

type Customer = {
  name: string;
  phone: string;
  location: string;
  photo: File | null;
};

type ShopCategory = {
  name: string;
  icon: React.ReactNode;
  keywords: string[];
};

const shopCategories: ShopCategory[] = [
  { name: "All", icon: <MdOutlineInventory2 />, keywords: [] },
  {
    name: "Abaya",
    icon: <GiAmpleDress />,
    keywords: ["abaya", "jilbab", "kaftan", "modest"],
  },
  {
    name: "Hijab",
    icon: <MdStyle />,
    keywords: ["hijab", "scarf", "shawl", "veil", "khimar"],
  },
  {
    name: "Dresses",
    icon: <GiAmpleDress />,
    keywords: ["dress", "gown", "maxi", "robe"],
  },
  {
    name: "Shoes",
    icon: <FaShoePrints />,
    keywords: ["shoe", "shoes", "heels", "sandal", "sandals", "sneaker", "boot"],
  },
  {
    name: "Bags",
    icon: <GiHandBag />,
    keywords: ["bag", "bags", "handbag", "purse", "clutch", "tote"],
  },
  {
    name: "Accessories",
    icon: <FaGem />,
    keywords: ["accessory", "accessories", "belt", "pin", "brooch", "watch"],
  },
  {
    name: "Jewelry",
    icon: <GiDiamondRing />,
    keywords: ["jewelry", "jewellery", "ring", "necklace", "bracelet", "earring"],
  },
  {
    name: "Beauty",
    icon: <GiLipstick />,
    keywords: ["beauty", "makeup", "lipstick", "cosmetic", "cosmetics"],
  },
  {
    name: "Perfume",
    icon: <GiDelicatePerfume />,
    keywords: ["perfume", "fragrance", "oud", "attar", "spray"],
  },
  {
    name: "Skincare",
    icon: <FaSprayCan />,
    keywords: ["skin", "skincare", "cream", "lotion", "serum", "soap"],
  },
  {
    name: "Gifts",
    icon: <GiWrappedSweet />,
    keywords: ["gift", "bundle", "set", "box"],
  },
];

function normalizeProducts(data: any): Product[] {
  if (Array.isArray(data)) return data;
  return data?.products || data?.gallery || data?.data || [];
}

function makeNumberId(id: number | string) {
  if (typeof id === "number") return id;

  const numeric = Number(id);
  if (!Number.isNaN(numeric)) return numeric;

  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function toCartProduct(product: Product): CartProduct {
  return {
    id: makeNumberId(product.id),
    name: product.name || "Product",
    price: Number(product.price || 0),
    image: product.image || "/placeholder.png",
    category: product.category,
    description: product.description,
  };
}

function getProductText(product: Product) {
  return `${product.name || ""} ${product.category || ""} ${
    product.description || ""
  }`.toLowerCase();
}

function inferCategory(product: Product) {
  const realCategory = product.category?.trim();

  if (realCategory) {
    const matched = shopCategories.find(
      (category) =>
        category.name.toLowerCase() === realCategory.toLowerCase() ||
        category.keywords.some((keyword) =>
          realCategory.toLowerCase().includes(keyword)
        )
    );

    return matched?.name || realCategory;
  }

  const text = getProductText(product);

  const matched = shopCategories.find(
    (category) =>
      category.name !== "All" &&
      category.keywords.some((keyword) => text.includes(keyword))
  );

  return matched?.name || "Other";
}

function getCategoryIcon(categoryName: string) {
  const category = shopCategories.find(
    (item) => item.name.toLowerCase() === categoryName.toLowerCase()
  );

  return category?.icon || <MdCategory />;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openCart, setOpenCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const perPage = 75;

  const cart = useCart((s) => s.cart);
  const addToCart = useCart((s) => s.addToCart);
  const removeFromCart = useCart((s) => s.removeFromCart);

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    location: "",
    photo: null,
  });

  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setProducts(normalizeProducts(data)))
      .catch(() => setProducts([]));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const category = inferCategory(product);
      counts.set(category, (counts.get(category) || 0) + 1);
    });

    counts.set("All", products.length);

    return counts;
  }, [products]);

  const visibleCategories = useMemo(() => {
    const dynamicCategories = Array.from(
      new Set(products.map((product) => inferCategory(product)))
    )
      .filter(
        (category) =>
          category !== "Other" &&
          !shopCategories.some(
            (item) => item.name.toLowerCase() === category.toLowerCase()
          )
      )
      .map((category) => ({
        name: category,
        icon: <MdLocalOffer />,
        keywords: [category.toLowerCase()],
      }));

    return [...shopCategories, ...dynamicCategories];
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return products.filter((product) => {
      const category = inferCategory(product);
      const productText = getProductText(product);

      const matchesCategory =
        selectedCategory === "All" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !term ||
        productText.includes(term) ||
        category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const total = cart.reduce(
    (sum: number, item: any) => sum + Number(item.price || 0),
    0
  );

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const buyWhatsApp = (product: Product) => {
    const msg = `NEW PRODUCT REQUEST

Product Name: ${product.name || "Product"}
Category: ${inferCategory(product)}
Description: ${product.description || "No description"}
Price: ${Number(product.price || 0).toLocaleString()} TZS
Image: ${product.image || "No image"}

Customer Name: ${customer.name || "Not added"}
Customer Phone: ${customer.phone || "Not added"}
Customer Location: ${customer.location || "Not added"}`;

    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const sendOrder = () => {
    if (!cart.length) return;

    const items = cart
      .map(
        (item: any, index: number) => `PRODUCT ${index + 1}
Name: ${item.name || "Product"}
Category: ${item.category || "Not added"}
Description: ${item.description || "No description"}
Price: ${Number(item.price || 0).toLocaleString()} TZS
Image: ${item.image || "No image"}`
      )
      .join("\n\n");

    const msg = `NEW ORDER

${items}

TOTAL: ${total.toLocaleString()} TZS

CUSTOMER DETAILS
Name: ${customer.name || "Not added"}
Phone: ${customer.phone || "Not added"}
Location: ${customer.location || "Not added"}`;

    window.open(
      `https://wa.me/255713758200?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.navbarFixed}>
        <Navbar />
      </div>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>
            <FaShoppingBag /> Rify Luxe Collection
          </p>
          <h1>Shop Abayas, Shoes, Beauty & Accessories</h1>
          <p>
            Browse elegant fashion products for girls and women. Choose a
            category to see only the products you want.
          </p>
        </div>

        <button
          className={styles.heroCart}
          onClick={() => setOpenCart(true)}
          type="button"
        >
          <FaShoppingCart />
          <span>{cart.length}</span>
        </button>
      </section>

      <section className={styles.header}>
        <div className={styles.searchWrap}>
          <FaSearch />
          <input
            className={styles.search}
            placeholder="Search abaya, shoes, bags, beauty..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search products"
          />
        </div>

        <button
          className={styles.cartButton}
          onClick={() => setOpenCart(true)}
          aria-label="Open cart"
          title="Open cart"
          type="button"
        >
          <FaShoppingCart />
          Cart
          <span>{cart.length}</span>
        </button>
      </section>

      <section className={styles.categorySection}>
        <div className={styles.categoryTitle}>
          <MdCategory />
          <h2>Shop By Category</h2>
        </div>

        <div className={styles.categoryList}>
          {visibleCategories.map((category) => (
            <button
              key={category.name}
              className={`${styles.categoryBtn} ${
                selectedCategory === category.name ? styles.activeCategory : ""
              }`}
              onClick={() => selectCategory(category.name)}
              type="button"
            >
              {category.icon}
              {category.name}

              <span className={styles.categoryCount}>
                {categoryCounts.get(category.name) || 0}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.resultBar}>
        <div>
          <FaBoxOpen />
          <strong>{filtered.length}</strong>
          <span>
            {selectedCategory === "All"
              ? "products available"
              : `${selectedCategory} products`}
          </span>
        </div>

        <small>
          Page {page} of {totalPages}
        </small>
      </section>

      <section className={styles.grid}>
        {paginated.map((product, index) => {
          const category = inferCategory(product);

          return (
            <article
              key={product.id || index}
              className={`${styles.card} ${styles.animatedCard}`}
            >
              <button
                className={styles.imageButton}
                onClick={() => setSelectedImage(product.image || "")}
                type="button"
                aria-label={`Preview ${product.name || "product"}`}
              >
                <img
                  src={product.image || "/placeholder.png"}
                  className={styles.productImage}
                  alt={
                    product.name ? `Product: ${product.name}` : "Product image"
                  }
                />

                <span className={styles.previewHint}>
                  <MdPhotoCamera />
                  Preview
                </span>
              </button>

              <div className={styles.cardBody}>
                <span className={styles.categoryPill}>
                  {getCategoryIcon(category)}
                  {category}
                </span>

                <h3 className={styles.productName}>{product.name}</h3>

                <p className={styles.desc}>
                  {product.description ||
                    "Beautiful premium fashion product for elegant girls and women."}
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.btn} ${styles.addBtn}`}
                  onClick={() => addToCart(toCartProduct(product))}
                  type="button"
                >
                  <FaShoppingCart />
                  Add
                </button>

                <button
                  className={`${styles.btn} ${styles.waBtn}`}
                  onClick={() => buyWhatsApp(product)}
                  type="button"
                >
                  <FaWhatsapp />
                  WhatsApp
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {paginated.length === 0 && (
        <section className={styles.empty}>
          <FaBoxOpen />
          <h2>No products found</h2>
          <p>Try another category or search keyword.</p>
        </section>
      )}

      <div className={styles.pagination}>
        <button
          onClick={prevPage}
          disabled={page === 1}
          className={styles.navBtn}
          aria-label="Previous page"
          title="Previous page"
          type="button"
        >
          <FaChevronLeft />
        </button>

        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className={styles.navBtn}
          aria-label="Next page"
          title="Next page"
          type="button"
        >
          <FaChevronRight />
        </button>
      </div>

      {openCart && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setOpenCart(false)}
        >
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setOpenCart(false)}
              type="button"
            >
              <FaTimes />
              Close
            </button>

            <h3>
              <FaShoppingCart />
              Cart
            </h3>

            {cart.length === 0 && (
              <p className={styles.drawerEmpty}>Your cart is empty.</p>
            )}

            {cart.map((item: any, index: number) => (
              <div key={`${item.id}-${index}`} className={styles.cartItem}>
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name || "Cart product"}
                  className={styles.cartImage}
                />

                <div>
                  <strong>{item.name}</strong>
                  <small>{item.category || "Product"}</small>
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  type="button"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <div className={styles.total}>
              <span>Total</span>
              <strong>{total.toLocaleString()} TZS</strong>
            </div>

            <button
              className={styles.cartWaBtn}
              onClick={sendOrder}
              type="button"
            >
              <FaWhatsapp />
              Buy via WhatsApp
            </button>

            <button
              className={styles.orderBtn}
              onClick={() => setCheckout((prev) => !prev)}
              type="button"
            >
              <FaShoppingBag />
              {checkout ? "Hide Checkout" : "Order Now"}
            </button>

            {checkout && (
              <div className={styles.checkout}>
                <label>
                  <FaUser />
                  Your name
                </label>
                <input
                  className={styles.input}
                  placeholder="Your name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />

                <label>
                  <MdPhone />
                  Phone number
                </label>
                <input
                  className={styles.input}
                  placeholder="Phone number"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />

                <label>
                  <FaMapMarkerAlt />
                  Location
                </label>
                <input
                  className={styles.input}
                  placeholder="Location"
                  value={customer.location}
                  onChange={(e) =>
                    setCustomer({ ...customer, location: e.target.value })
                  }
                />

                <button
                  className={styles.orderBtn}
                  onClick={sendOrder}
                  type="button"
                >
                  <FaWhatsapp />
                  Send Order
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {selectedImage && (
        <div
          className={styles.imageModal}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className={styles.modalImage}
            alt="Product preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
