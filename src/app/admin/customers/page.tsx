"use client";

import {
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
<<<<<<< HEAD
=======
  Trash2,
>>>>>>> 2090a59 (new changes)
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type Customer = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  contact?: string;
  location?: string;
  message?: string;
  createdAt?: string;
};

<<<<<<< HEAD
=======
type ApiResponse = {
  error?: string;
  success?: boolean;
};

>>>>>>> 2090a59 (new changes)
export default function CustomersPage() {
  const searchId = useId();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
<<<<<<< HEAD

  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setCustomers(
          Array.isArray(data) ? data : data.contacts || data.data || []
        )
      );
=======
  const [deleting, setDeleting] = useState(false);

  const readJsonSafely = async (res: Response): Promise<ApiResponse> => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  const fetchCustomers = async () => {
    const res = await fetch("/api/contact", { cache: "no-store" });
    const data = await res.json();

    setCustomers(Array.isArray(data) ? data : data.contacts || data.data || []);
  };

  useEffect(() => {
    fetchCustomers();
>>>>>>> 2090a59 (new changes)
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return customers;

    return customers.filter((customer) => {
      const contact = customer.contact || customer.phone || customer.email || "";

      return (
        customer.name?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term) ||
        customer.location?.toLowerCase().includes(term) ||
        customer.message?.toLowerCase().includes(term) ||
        contact.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

<<<<<<< HEAD
=======
  const deleteCustomer = async (id: string | number) => {
    const confirmed = window.confirm("Delete this customer contact?");

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        alert(data.error || "Failed to delete customer");
        return;
      }

      await fetchCustomers();
    } catch (error) {
      console.error("DELETE CUSTOMER CLIENT ERROR:", error);
      alert("Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  const deleteAllCustomers = async () => {
    const confirmed = window.confirm(
      "Delete all customer contacts? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch("/api/contact?all=true", {
        method: "DELETE",
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        alert(data.error || "Failed to delete all customers");
        return;
      }

      await fetchCustomers();
    } catch (error) {
      console.error("DELETE ALL CUSTOMERS CLIENT ERROR:", error);
      alert("Failed to delete all customers");
    } finally {
      setDeleting(false);
    }
  };

>>>>>>> 2090a59 (new changes)
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Customers</p>
          <h1>
            <UsersRound size={30} /> Customer Contacts
          </h1>
        </div>

<<<<<<< HEAD
        <span className={styles.status}>
          {filteredCustomers.length} Customers
        </span>
=======
        <div className={styles.actionGroup}>
          <span className={styles.status}>
            {filteredCustomers.length} Customers
          </span>

          <button
            className={`${styles.primaryBtn} ${styles.dangerAction}`}
            onClick={deleteAllCustomers}
            disabled={deleting || customers.length === 0}
            type="button"
          >
            <Trash2 size={18} />
            Delete All
          </button>
        </div>
>>>>>>> 2090a59 (new changes)
      </div>

      <section className={styles.card}>
        <label className={styles.fieldLabel} htmlFor={searchId}>
          <Search size={14} /> Search customers
        </label>

        <input
          id={searchId}
          className={styles.input}
          placeholder="Search by name, email, phone, location, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className={styles.grid}>
        {filteredCustomers.map((c) => {
          const contact = c.contact || c.phone || c.email || "Not added";

          return (
            <article key={c.id} className={styles.card}>
              <div className={styles.rowBetween}>
                <h2>
                  <UserRound size={22} />
                  {c.name || "Unknown Customer"}
                </h2>

<<<<<<< HEAD
                <span className={styles.status}>#{c.id}</span>
=======
                <div className={styles.actionGroup}>
                  <span className={styles.status}>#{c.id}</span>

                  <button
                    className={`${styles.iconAction} ${styles.dangerAction}`}
                    onClick={() => deleteCustomer(c.id)}
                    disabled={deleting}
                    title="Delete customer"
                    type="button"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
>>>>>>> 2090a59 (new changes)
              </div>

              <p>
                <Mail size={15} />
                <strong>Email:</strong> {c.email || contact}
              </p>

              <p>
                <Phone size={15} />
                <strong>Phone:</strong> {c.phone || contact}
              </p>

              <p>
                <MapPin size={15} />
                <strong>Location:</strong> {c.location || "Not added"}
              </p>

              <p>
                <MessageCircle size={15} />
                <strong>Message:</strong> {c.message || "No message"}
              </p>

              <small className={styles.metaLine}>
                <CalendarDays size={14} />
<<<<<<< HEAD
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : "Recent"}
=======
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString()
                  : "Recent"}
>>>>>>> 2090a59 (new changes)
              </small>
            </article>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className={styles.card}>
            <h2>
              <UsersRound size={22} /> No customers found
            </h2>
            <p>No customer contacts match your search.</p>
          </div>
        )}
      </section>
    </main>
  );
}
