"use client";

export default function Payments() {
  const payments = [
    { id: 1, method: "Stripe", amount: 120 }
  ];

  return (
    <div>
      <h1>💰 Payments</h1>

      {payments.map(p => (
        <div key={p.id}>
          {p.method} - ${p.amount}
        </div>
      ))}
    </div>
  );
}