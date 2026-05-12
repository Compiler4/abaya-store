"use client";

import {
  Boxes,
  DollarSign,
  Grid3X3,
  ImagePlus,
  Layers,
  List,
  PackagePlus,
  Search,
  Shirt,
  Tags,
  Trash2,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type Product = {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock?: number;
};

export default function ProductsPage() {
  const nameId = useId();
  const categoryId = useId();
  const priceId = useId();
  const stockId = useId();
  const imageId = useId();
  const searchId = useId();

  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: null as File | null,
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : data.products || data.data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        String(product.price || "").includes(term) ||
        String(product.stock || "").includes(term)
      );
    });
  }, [products, search]);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    body.append("name", form.name);
    body.append("category", form.category);
    body.append("price", form.price);
    body.append("stock", form.stock);

    if (form.image) {
      body.append("image", form.image);
    }

    await fetch("/api/products", {
      method: "POST",
      body,
    });

    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      image: null,
    });

    await fetchProducts();
    setLoading(false);
  };

  const deleteProduct = async (id: string | number) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    await fetch(`/api/products/delete/${id}`, {
      method: "DELETE",
    });

    await fetchProducts();
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Inventory</p>
          <h1>
            <Boxes size={30} /> Products
          </h1>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={() => setView(view === "grid" ? "table" : "grid")}
          type="button"
        >
          {view === "grid" ? <List size={18} /> : <Grid3X3 size={18} />}
          {view === "grid" ? "Table View" : "Grid View"}
        </button>
      </div>

      <section className={styles.split}>
        <form className={styles.card} onSubmit={addProduct}>
          <h2>
            <PackagePlus size={22} /> Add Product
          </h2>

          <label className={styles.fieldLabel} htmlFor={nameId}>
            <Shirt size={14} /> Product name
          </label>
          <input
            id={nameId}
            className={styles.input}
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label className={styles.fieldLabel} htmlFor={categoryId}>
            <Tags size={14} /> Category
          </label>
          <select
            id={categoryId}
            className={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Choose category</option>
            <option value="Abaya">Abaya</option>
            <option value="Hijab">Hijab</option>
            <option value="Dress">Dress</option>
            <option value="Accessories">Accessories</option>
          </select>

          <label className={styles.fieldLabel} htmlFor={priceId}>
            <DollarSign size={14} /> Price
          </label>
          <input
            id={priceId}
            className={styles.input}
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <label className={styles.fieldLabel} htmlFor={stockId}>
            <Layers size={14} /> Stock
          </label>
          <input
            id={stockId}
            className={styles.input}
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <label className={styles.fieldLabel} htmlFor={imageId}>
            <ImagePlus size={14} /> Product photo
          </label>
          <input
            id={imageId}
            className={styles.input}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files?.[0] || null })
            }
          />

          <button className={styles.primaryBtn} disabled={loading}>
            <PackagePlus size={18} />
            {loading ? "Saving..." : "Add Product"}
          </button>
        </form>

        <div className={styles.card}>
          <div className={styles.rowBetween}>
            <h2>
              <Boxes size={22} /> All Products
            </h2>

            <span className={styles.status}>
              {filteredProducts.length} Items
            </span>
          </div>

          <label className={styles.fieldLabel} htmlFor={searchId}>
            <Search size={14} /> Search products
          </label>
          <input
            id={searchId}
            className={styles.input}
            placeholder="Search by name, category, price, or stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {view === "grid" ? (
            <div className={styles.productGrid}>
              {filteredProducts.map((p) => (
                <div key={p.id} className={styles.productCard}>
                  <img src={p.image} alt={p.name} />

                  <h3>{p.name}</h3>

                  <p>
                    <Tags size={14} /> {p.category || "No category"}
                  </p>

                  <p>
                    <Layers size={14} /> Stock: {p.stock || 0}
                  </p>

                  <strong>{Number(p.price || 0).toLocaleString()} TZS</strong>

                  <button
                    className={`${styles.iconAction} ${styles.dangerAction}`}
                    onClick={() => deleteProduct(p.id)}
                    title="Delete product"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <p>No products found. Try another search or add your first product.</p>
              )}
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          className={styles.tableImg}
                          src={p.image}
                          alt={p.name}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td>{p.category || "No category"}</td>
                      <td>{Number(p.price || 0).toLocaleString()} TZS</td>
                      <td>{p.stock || 0}</td>
                      <td>
                        <button
                          className={`${styles.iconAction} ${styles.dangerAction}`}
                          onClick={() => deleteProduct(p.id)}
                          title="Delete product"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7}>No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
