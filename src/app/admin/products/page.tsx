"use client";

import {
  Boxes,
  DollarSign,
  Grid3X3,
  ImagePlus,
<<<<<<< HEAD
=======
  Images,
>>>>>>> 2090a59 (new changes)
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
<<<<<<< HEAD
  stock?: number;
=======
  description: string;
  stock?: number;
  sizes?: string[];
  colors?: string[];
};

type GalleryItem = {
  id?: string | number;
  image?: string;
  url?: string;
  src?: string;
  title?: string;
  name?: string;
  category?: string;
  createdAt?: string;
};

type ApiResponse = {
  error?: string;
  success?: boolean;
>>>>>>> 2090a59 (new changes)
};

export default function ProductsPage() {
  const nameId = useId();
  const categoryId = useId();
  const priceId = useId();
  const stockId = useId();
<<<<<<< HEAD
=======
  const descriptionId = useId();
  const sizesId = useId();
  const colorsId = useId();
>>>>>>> 2090a59 (new changes)
  const imageId = useId();
  const searchId = useId();

  const [products, setProducts] = useState<Product[]>([]);
<<<<<<< HEAD
  const [view, setView] = useState<"grid" | "table">("grid");
=======
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [view, setView] = useState<"grid" | "table">("table");
>>>>>>> 2090a59 (new changes)
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
<<<<<<< HEAD
    image: null as File | null,
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : data.products || data.data || []);
  };

  useEffect(() => {
    fetchProducts();
=======
    description: "",
    sizes: "",
    colors: "",
    image: null as File | null,
  });

  const getGalleryImage = (item: GalleryItem) => {
    return item.image || item.url || item.src || "";
  };

  const readJsonSafely = async (res: Response): Promise<ApiResponse> => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  const fetchData = async () => {
    const [productsRes, galleryRes] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/gallery", { cache: "no-store" }),
    ]);

    const productsData = await productsRes.json();
    const galleryData = await galleryRes.json();

    setProducts(
      Array.isArray(productsData)
        ? productsData
        : productsData.products || productsData.data || []
    );

    setGallery(
      Array.isArray(galleryData)
        ? galleryData
        : galleryData.gallery || galleryData.images || galleryData.data || []
    );
  };

  useEffect(() => {
    fetchData();
>>>>>>> 2090a59 (new changes)
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
<<<<<<< HEAD
=======
        product.description?.toLowerCase().includes(term) ||
>>>>>>> 2090a59 (new changes)
        String(product.price || "").includes(term) ||
        String(product.stock || "").includes(term)
      );
    });
  }, [products, search]);

<<<<<<< HEAD
=======
  const splitValues = (value: string) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

>>>>>>> 2090a59 (new changes)
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

<<<<<<< HEAD
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
=======
    try {
      const body = new FormData();

      body.append("name", form.name);
      body.append("category", form.category);
      body.append("price", form.price);
      body.append("stock", form.stock);
      body.append("description", form.description);
      body.append("sizes", JSON.stringify(splitValues(form.sizes)));
      body.append("colors", JSON.stringify(splitValues(form.colors)));

      if (form.image) {
        body.append("image", form.image);
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body,
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        alert(data.error || "Failed to add product");
        return;
      }

      setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        sizes: "",
        colors: "",
        image: null,
      });

      const imageInput = document.getElementById(
        imageId
      ) as HTMLInputElement | null;

      if (imageInput) {
        imageInput.value = "";
      }

      await fetchData();
      setView("table");
    } finally {
      setLoading(false);
    }
>>>>>>> 2090a59 (new changes)
  };

  const deleteProduct = async (id: string | number) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

<<<<<<< HEAD
    await fetch(`/api/products/delete/${id}`, {
      method: "DELETE",
    });

    await fetchProducts();
=======
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        alert(data.error || "Failed to delete product");
        return;
      }

      await fetchData();
    } catch (error) {
      console.error("DELETE PRODUCT CLIENT ERROR:", error);
      alert("Failed to delete product");
    }
>>>>>>> 2090a59 (new changes)
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
<<<<<<< HEAD
=======
            min="0"
>>>>>>> 2090a59 (new changes)
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
<<<<<<< HEAD
=======
            min="0"
>>>>>>> 2090a59 (new changes)
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

<<<<<<< HEAD
          <label className={styles.fieldLabel} htmlFor={imageId}>
            <ImagePlus size={14} /> Product photo
=======
          <label className={styles.fieldLabel} htmlFor={descriptionId}>
            <Layers size={14} /> Description
          </label>
          <textarea
            id={descriptionId}
            className={styles.input}
            placeholder="Product description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          <label className={styles.fieldLabel} htmlFor={sizesId}>
            <Layers size={14} /> Sizes
          </label>
          <input
            id={sizesId}
            className={styles.input}
            placeholder="Example: S, M, L, XL"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
          />

          <label className={styles.fieldLabel} htmlFor={colorsId}>
            <Layers size={14} /> Colors
          </label>
          <input
            id={colorsId}
            className={styles.input}
            placeholder="Example: Black, White, Brown"
            value={form.colors}
            onChange={(e) => setForm({ ...form, colors: e.target.value })}
          />

          <label className={styles.fieldLabel} htmlFor={imageId}>
            <ImagePlus size={14} /> Upload product photo
>>>>>>> 2090a59 (new changes)
          </label>
          <input
            id={imageId}
            className={styles.input}
            type="file"
            accept="image/*"
            onChange={(e) =>
<<<<<<< HEAD
              setForm({ ...form, image: e.target.files?.[0] || null })
            }
=======
              setForm({
                ...form,
                image: e.target.files?.[0] || null,
              })
            }
            required
>>>>>>> 2090a59 (new changes)
          />

          <button className={styles.primaryBtn} disabled={loading}>
            <PackagePlus size={18} />
            {loading ? "Saving..." : "Add Product"}
          </button>
        </form>

        <div className={styles.card}>
          <div className={styles.rowBetween}>
            <h2>
<<<<<<< HEAD
              <Boxes size={22} /> All Products
=======
              <Boxes size={22} /> Added Products
>>>>>>> 2090a59 (new changes)
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
<<<<<<< HEAD
            placeholder="Search by name, category, price, or stock..."
=======
            placeholder="Search by name, category, price, stock, or description..."
>>>>>>> 2090a59 (new changes)
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

<<<<<<< HEAD
=======
                  <p>{p.description}</p>

>>>>>>> 2090a59 (new changes)
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
<<<<<<< HEAD
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
=======
                <p>
                  No products found. Try another search or add your first
                  product.
                </p>
              )}
            </div>
          ) : (
            <>
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

              <div className={styles.rowBetween}>
                <h2>
                  <Images size={22} /> Gallery Photos
                </h2>

                <span className={styles.status}>{gallery.length} Photos</span>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Photo</th>
                      <th>Title</th>
                      <th>Image URL</th>
                    </tr>
                  </thead>

                  <tbody>
                    {gallery.map((item, index) => {
                      const image = getGalleryImage(item);

                      return (
                        <tr key={item.id || image || index}>
                          <td>{index + 1}</td>
                          <td>
                            {image ? (
                              <img
                                className={styles.tableImg}
                                src={image}
                                alt={item.title || item.name || "Gallery image"}
                              />
                            ) : (
                              "No image"
                            )}
                          </td>
                          <td>{item.title || item.name || "Gallery image"}</td>
                          <td>{image || "No URL"}</td>
                        </tr>
                      );
                    })}

                    {gallery.length === 0 && (
                      <tr>
                        <td colSpan={4}>No gallery photos found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
>>>>>>> 2090a59 (new changes)
          )}
        </div>
      </section>
    </main>
  );
}
