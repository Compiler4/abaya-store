"use client";

import { useEffect, useState } from "react";
import styles from "./products.module.css";

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  description: string;
  image: string;
};

type FormState = {
  name: string;
  stock: string;
  price: string;
  description: string;
  image: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    stock: "",
    price: "",
    description: "",
    image: ""
  });

  // LOAD PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // OPEN ADD FORM
  const openAddForm = () => {
    console.log("Add button clicked"); // debug
    setEditId(null);
    setForm({
      name: "",
      stock: "",
      price: "",
      description: "",
      image: ""
    });
    setShowForm(true);
  };

  // SAVE PRODUCT
  const handleSave = async () => {
    if (!form.name) return;

    const payload = {
      name: form.name,
      stock: Number(form.stock),
      price: Number(form.price),
      description: form.description,
      image: form.image
    };

    if (editId) {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...payload })
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    setShowForm(false);
    fetchProducts();
  };

  // EDIT
  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      stock: String(product.stock),
      price: String(product.price),
      description: product.description,
      image: product.image
    });
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    fetchProducts();
  };

  return (
    <div className={styles.container}>
      <h1>🛍️ Products</h1>

      {/* ADD BUTTON */}
      <button type="button" onClick={openAddForm}>
        ➕ Add Product
      </button>

      {/* MODAL */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />

            <button type="button" onClick={handleSave}>
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt={p.name} width={50} />
              </td>
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>${p.price}</td>
              <td>{p.description}</td>
              <td>
                <button onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}