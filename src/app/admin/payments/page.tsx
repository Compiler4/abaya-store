"use client";

import {
  Banknote,
  CalendarDays,
  CreditCard,
  DollarSign,
  Landmark,
  ReceiptText,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type Payment = {
  id: string | number;
  customer: string;
  method: string;
  amount: number;
  status: string;
  createdAt?: string;
};

function PaymentMethodIcon({ method }: { method: string }) {
  const value = method.toLowerCase();

  if (value.includes("bank")) return <Landmark size={15} />;
  if (value.includes("card")) return <CreditCard size={15} />;

  return <WalletCards size={15} />;
}

export default function PaymentsPage() {
  const searchId = useId();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/payments", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setPayments(Array.isArray(data) ? data : data.payments || data.data || [])
      );
  }, []);

  const filteredPayments = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return payments;

    return payments.filter((payment) => {
      return (
        payment.customer?.toLowerCase().includes(term) ||
        payment.method?.toLowerCase().includes(term) ||
        payment.status?.toLowerCase().includes(term) ||
        String(payment.amount || "").includes(term)
      );
    });
  }, [payments, search]);

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const paidCount = filteredPayments.filter((payment) =>
    payment.status?.toLowerCase().includes("paid")
  ).length;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Finance</p>
          <h1>
            <ReceiptText size={30} /> Payments
          </h1>
        </div>

        <span className={styles.status}>
          <Banknote size={14} /> {totalAmount.toLocaleString()} TZS
        </span>
      </div>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>
            <DollarSign size={22} /> Total Amount
          </h2>
          <p>{totalAmount.toLocaleString()} TZS</p>
        </div>

        <div className={styles.card}>
          <h2>
            <ShieldCheck size={22} /> Paid Records
          </h2>
          <p>{paidCount}</p>
        </div>

        <div className={styles.card}>
          <h2>
            <WalletCards size={22} /> Payment Rows
          </h2>
          <p>{filteredPayments.length}</p>
        </div>
      </section>

      <section className={styles.card}>
        <label className={styles.fieldLabel} htmlFor={searchId}>
          <Search size={14} /> Search payments
        </label>

        <input
          id={searchId}
          className={styles.input}
          placeholder="Search by customer, method, status, or amount..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>

                  <td>
                    <span className={styles.tableCellIcon}>
                      <UserRound size={15} />
                      {p.customer || "Unknown customer"}
                    </span>
                  </td>

                  <td>
                    <span className={styles.tableCellIcon}>
                      <PaymentMethodIcon method={p.method || ""} />
                      {p.method || "Not added"}
                    </span>
                  </td>

                  <td>
                    <span className={styles.tableCellIcon}>
                      <Banknote size={15} />
                      {Number(p.amount || 0).toLocaleString()} TZS
                    </span>
                  </td>

                  <td>
                    <span className={styles.status}>
                      <ShieldCheck size={13} />
                      {p.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <span className={styles.tableCellIcon}>
                      <CalendarDays size={15} />
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6}>No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
