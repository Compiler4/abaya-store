"use client";

import { useState } from "react";
import styles from "./chat.module.css";

export default function ChatBox() {
  const [msg, setMsg] = useState("");

  const send = async () => {
    if (!msg.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: msg }),
    });

    setMsg("");
  };

  return (
    <div className={styles.chatBox}>
      <input
        className={styles.input}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Chat admin..."
      />

      <button className={styles.sendBtn} onClick={send}>
        Send
      </button>
    </div>
  );
}