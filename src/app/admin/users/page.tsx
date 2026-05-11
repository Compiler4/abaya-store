"use client";

import {
  CalendarDays,
  Edit3,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type User = {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
};

type UserForm = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  role: "Customer",
};

export default function UsersPage() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const roleId = useId();
  const searchId = useId();

  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("/api/users", { cache: "no-store" });
    const data = await res.json();

    setUsers(Array.isArray(data) ? data : data.users || data.data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [search, users]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editingId ? `/api/users/${editingId}` : "/api/users";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    await fetchUsers();
    setSaving(false);
  };

  const editUser = (user: User) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Customer",
    });
  };

  const deleteUser = async (id: string | number) => {
    const confirmed = confirm("Delete this user?");

    if (!confirmed) return;

    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    await fetchUsers();
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Accounts</p>
          <h1>
            <Users size={30} /> Registered Users
          </h1>
        </div>

        <span className={styles.status}>{filteredUsers.length} Users</span>
      </div>

      <section className={styles.split}>
        <form className={styles.card} onSubmit={submitUser}>
          <div className={styles.rowBetween}>
            <h2>
              <UserPlus size={22} />
              {editingId ? "Edit User" : "Add User"}
            </h2>

            {editingId && (
              <button
                className={styles.primaryBtn}
                onClick={resetForm}
                type="button"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <label className={styles.fieldLabel} htmlFor={nameId}>
            <Users size={14} /> User name
          </label>
          <input
            id={nameId}
            className={styles.input}
            placeholder="User name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label className={styles.fieldLabel} htmlFor={emailId}>
            <Mail size={14} /> Email
          </label>
          <input
            id={emailId}
            className={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label className={styles.fieldLabel} htmlFor={phoneId}>
            <Phone size={14} /> Phone
          </label>
          <input
            id={phoneId}
            className={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label className={styles.fieldLabel} htmlFor={roleId}>
            <ShieldCheck size={14} /> Role
          </label>
          <select
            id={roleId}
            className={styles.input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Customer">Customer</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className={styles.primaryBtn} disabled={saving}>
            {editingId ? <Save size={18} /> : <Plus size={18} />}
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add User"}
          </button>
        </form>

        <div className={styles.card}>
          <div className={styles.rowBetween}>
            <h2>
              <Users size={22} /> Users List
            </h2>
          </div>

          <label className={styles.fieldLabel} htmlFor={searchId}>
            <Search size={14} /> Search users
          </label>
          <input
            id={searchId}
            className={styles.input}
            placeholder="Search by name, email, phone, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr key={u.id}>
                    <td>{index + 1}</td>

                    <td>
                      <span className={styles.tableCellIcon}>
                        <Users size={15} />
                        {u.name || "Unnamed User"}
                      </span>
                    </td>

                    <td>
                      <span className={styles.tableCellIcon}>
                        <Mail size={15} />
                        {u.email}
                      </span>
                    </td>

                    <td>
                      <span className={styles.tableCellIcon}>
                        <Phone size={15} />
                        {u.phone || "Not added"}
                      </span>
                    </td>

                    <td>
                      <span className={styles.status}>
                        <ShieldCheck size={13} />
                        {u.role || "Customer"}
                      </span>
                    </td>

                    <td>
                      <span className={styles.tableCellIcon}>
                        <CalendarDays size={15} />
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          className={styles.iconAction}
                          onClick={() => editUser(u)}
                          aria-label={`Edit ${u.name || "user"}`}
                          title="Edit user"
                          type="button"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          className={`${styles.iconAction} ${styles.dangerAction}`}
                          onClick={() => deleteUser(u.id)}
                          aria-label={`Delete ${u.name || "user"}`}
                          title="Delete user"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
