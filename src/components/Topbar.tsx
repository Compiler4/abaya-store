"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import socket from "@/lib/socket"; // ✅ FIXED

type TopbarProps = {
  setPage: Dispatch<SetStateAction<string>>;
};

export default function Topbar({ setPage }: TopbarProps) {
  useEffect(() => {
    const handleNewOrder = (data: any) => {
      alert("New Order Received!");
      console.log("Order:", data);
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>

      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("products")}>Products</button>
      <button onClick={() => setPage("orders")}>Orders</button>
    </div>
  );
}