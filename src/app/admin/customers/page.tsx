"use client";

import {
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
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

export default function CustomersPage() {
  const searchId = useId();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setCustomers(
          Array.isArray(data) ? data : data.contacts || data.data || []
        )
      );
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

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Customers</p>
          <h1>
            <UsersRound size={30} /> Customer Contacts
          </h1>
        </div>

        <span className={styles.status}>
          {filteredCustomers.length} Customers
        </span>
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

                <span className={styles.status}>#{c.id}</span>
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
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : "Recent"}
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
