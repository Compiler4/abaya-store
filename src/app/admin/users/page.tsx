"use client";

import { useState } from "react";
import styles from "./users.module.css";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@mail.com" },
    { id: 2, name: "Sarah Smith", email: "sarah@mail.com" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // OPEN ADD
  const openAdd = () => {
    setForm({ name: "", email: "" });
    setEditingId(null);
    setModalOpen(true);
  };

  // OPEN EDIT
  const openEdit = (user: User) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
    setModalOpen(true);
  };

  // SAVE USER
  const handleSave = () => {
    if (!form.name || !form.email) return;

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId ? { ...u, ...form } : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setModalOpen(false);
    setForm({ name: "", email: "" });
    setEditingId(null);
  };

  // DELETE USER
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>👥 Users Management</h1>
        <button onClick={openAdd} className={styles.addBtn}>
          + Add User
        </button>
      </div>

      {/* USERS GRID */}
      <div className={styles.grid}>
        {users.map((u) => (
          <div key={u.id} className={styles.card}>
            <div className={styles.avatar}>
              {u.name.charAt(0)}
            </div>

            <div className={styles.info}>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.editBtn}
                onClick={() => openEdit(u)}
              >
                ✏️ Edit
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(u.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>{editingId ? "Edit User" : "Add User"}</h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <div className={styles.modalActions}>
              <button onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}