"use client";

import {
  CalendarDays,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
  Reply,
  Search,
  Send,
  Trash2,
  UserPlus,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type Message = {
  id: number;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  location?: string;
  message: string;
  createdAt: string;
};

type MessageReply = {
  id: number;
  contactMessageId?: number | null;
  customerName: string;
  customerContact: string;
  message: string;
  channel: string;
  read: boolean;
  createdAt: string;
};

type MessageGroup = {
  key: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  location?: string;
  messages: Message[];
  latestMessage?: Message;
};

const defaultReply =
  "Hello, thank you for contacting Rify Luxe Abaya. We have received your message and we will assist you shortly.";

function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

function cleanPhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

function getContact(msg: Message) {
  return msg.contact || msg.phone || msg.email || "";
}

async function readJsonSafely(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export default function MessagesPage() {
  const searchId = useId();
  const replyId = useId();
  const startNameId = useId();
  const startContactId = useId();
  const startMessageId = useId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [replyText, setReplyText] = useState(defaultReply);
  const [sending, setSending] = useState(false);

  const [startForm, setStartForm] = useState({
    name: "",
    contact: "",
    message: "",
  });

  const fetchMessages = async () => {
    const res = await fetch("/api/messages", { cache: "no-store" });
    const data = await res.json();
    setMessages(data.contacts || data.messages || data.data || []);
  };

  const fetchReplies = async () => {
    const res = await fetch("/api/messages/replies", { cache: "no-store" });
    const data = await res.json();
    setReplies(data.replies || data.data || []);
  };

  const refreshData = async () => {
    await Promise.all([fetchMessages(), fetchReplies()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const groupedMessages = useMemo<MessageGroup[]>(() => {
    const map = new Map<string, MessageGroup>();

    messages.forEach((msg) => {
      const contact = getContact(msg);
      const key = `${msg.name || "Unknown"}-${contact || msg.id}`;
      const current = map.get(key);

      if (current) {
        current.messages.push(msg);
        current.latestMessage = current.messages
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )[0];
      } else {
        map.set(key, {
          key,
          name: msg.name || "Unknown Customer",
          contact,
          phone: msg.phone,
          email: msg.email,
          location: msg.location,
          messages: [msg],
          latestMessage: msg,
        });
      }
    });

    replies.forEach((reply) => {
      const key = `${reply.customerName || "Customer"}-${
        reply.customerContact || reply.id
      }`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          name: reply.customerName || "Customer",
          contact: reply.customerContact,
          messages: [],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const aTime = new Date(a.latestMessage?.createdAt || 0).getTime();
      const bTime = new Date(b.latestMessage?.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [messages, replies]);

  const filteredGroups = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return groupedMessages;

    return groupedMessages.filter((group) => {
      return (
        group.name.toLowerCase().includes(term) ||
        group.contact.toLowerCase().includes(term) ||
        group.location?.toLowerCase().includes(term) ||
        group.messages.some((msg) => msg.message?.toLowerCase().includes(term))
      );
    });
  }, [groupedMessages, search]);

  const activeGroup =
    filteredGroups.find((group) => group.key === selectedKey) ||
    filteredGroups[0] ||
    null;

  const activeContact = activeGroup?.contact || "";
  const activeReplies = replies.filter(
    (reply) => reply.customerContact === activeContact
  );

  const canReplyByEmail = isEmail(activeContact);
  const canReplyByWhatsApp =
    Boolean(cleanPhone(activeContact)) && !canReplyByEmail;

  const sendToDashboard = async () => {
    if (!activeGroup || !replyText.trim()) return;

    setSending(true);

    const res = await fetch("/api/messages/replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactMessageId: activeGroup.latestMessage?.id || null,
        customerName: activeGroup.name,
        customerContact: activeContact,
        message: replyText,
        channel: "DASHBOARD",
      }),
    });

    const data = await readJsonSafely(res);

    if (!res.ok) {
      alert(data.error || "Failed to send reply");
      setSending(false);
      return;
    }

    setReplyText(defaultReply);
    await refreshData();
    setSending(false);
  };

  const startConversation = async () => {
    if (!startForm.name.trim() || !startForm.contact.trim() || !startForm.message.trim()) {
      alert("Name, contact and message are required");
      return;
    }

    setSending(true);

    const res = await fetch("/api/messages/replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactMessageId: null,
        customerName: startForm.name,
        customerContact: startForm.contact,
        message: startForm.message,
        channel: "DASHBOARD",
      }),
    });

    const data = await readJsonSafely(res);

    if (!res.ok) {
      alert(data.error || "Failed to start conversation");
      setSending(false);
      return;
    }

    setStartForm({
      name: "",
      contact: "",
      message: "",
    });

    await refreshData();
    setSending(false);
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Delete this customer message?")) return;

    const res = await fetch(`/api/messages?id=${id}`, {
      method: "DELETE",
    });

    const data = await readJsonSafely(res);

    if (!res.ok) {
      alert(data.error || "Failed to delete message");
      return;
    }

    await refreshData();
  };

  const deleteReply = async (id: number) => {
    if (!window.confirm("Delete this admin message?")) return;

    const res = await fetch(`/api/messages/replies?id=${id}`, {
      method: "DELETE",
    });

    const data = await readJsonSafely(res);

    if (!res.ok) {
      alert(data.error || "Failed to delete reply");
      return;
    }

    await refreshData();
  };

  const openWhatsAppReply = () => {
    const phone = cleanPhone(activeContact);
    if (!phone) return;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(replyText)}`,
      "_blank"
    );
  };

  const openEmailReply = () => {
    if (!activeContact || !isEmail(activeContact)) return;

    window.open(
      `mailto:${activeContact}?subject=${encodeURIComponent(
        "Rify Luxe Abaya Support"
      )}&body=${encodeURIComponent(replyText)}`,
      "_blank"
    );
  };

  const copyReply = async () => {
    await navigator.clipboard.writeText(replyText);
    alert("Reply copied");
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Support Inbox</p>
          <h1>
            <MessagesSquare size={30} /> Customer Messages
          </h1>
        </div>

        <span className={styles.status}>
          {filteredGroups.length} Customers - {messages.length} Messages
        </span>
      </div>

      <section className={styles.messageLayout}>
        <aside className={styles.card}>
          <h2>
            <UsersRound size={22} /> Users
          </h2>

          <label className={styles.fieldLabel} htmlFor={searchId}>
            <Search size={14} /> Search users or messages
          </label>

          <input
            id={searchId}
            className={styles.input}
            placeholder="Search by name, contact, location, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className={styles.messageUserList}>
            {filteredGroups.map((group) => {
              const selected = activeGroup?.key === group.key;

              return (
                <button
                  key={group.key}
                  className={`${styles.messageUserButton} ${
                    selected ? styles.selectedCard : ""
                  }`}
                  type="button"
                  onClick={() => setSelectedKey(group.key)}
                >
                  <span className={styles.avatar}>
                    {group.name.charAt(0).toUpperCase()}
                  </span>

                  <span>
                    <strong>{group.name}</strong>
                    <small>{group.contact || "No contact"}</small>
                    <small>{group.messages.length} customer messages</small>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={styles.card}>
          <h2>
            <MessageCircle size={22} /> Conversation
          </h2>

          {activeGroup ? (
            <>
              <div className={styles.cardSoft}>
                <p>
                  <UserRound size={15} />
                  <strong>Customer:</strong> {activeGroup.name}
                </p>

                <p>
                  {isEmail(activeContact) ? <Mail size={15} /> : <Phone size={15} />}
                  <strong>Contact:</strong> {activeContact || "Not added"}
                </p>

                <p>
                  <MapPin size={15} />
                  <strong>Location:</strong> {activeGroup.location || "Not added"}
                </p>
              </div>

              <div className={styles.conversationList}>
                {activeGroup.messages
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((msg) => (
                    <article key={msg.id} className={styles.messageBubble}>
                      <p>{msg.message}</p>

                      <small className={styles.metaLine}>
                        <CalendarDays size={14} />
                        {new Date(msg.createdAt).toLocaleString()}
                      </small>

                      <button
                        className={`${styles.iconAction} ${styles.dangerAction}`}
                        type="button"
                        onClick={() => deleteMessage(msg.id)}
                        title="Delete customer message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </article>
                  ))}

                {activeReplies.map((reply) => (
                  <article key={reply.id} className={styles.adminBubble}>
                    <p>{reply.message}</p>

                    <small className={styles.metaLine}>
                      <Send size={14} />
                      Sent to customer dashboard -{" "}
                      {new Date(reply.createdAt).toLocaleString()}
                    </small>

                    <button
                      className={`${styles.iconAction} ${styles.dangerAction}`}
                      type="button"
                      onClick={() => deleteReply(reply.id)}
                      title="Delete admin message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p>No message selected.</p>
          )}
        </section>

        <aside className={styles.card}>
          <h2>
            <UserPlus size={22} /> Start Conversation
          </h2>

          <label className={styles.fieldLabel} htmlFor={startNameId}>
            <UserRound size={14} /> Customer name
          </label>
          <input
            id={startNameId}
            className={styles.input}
            placeholder="Customer name"
            value={startForm.name}
            onChange={(e) =>
              setStartForm({ ...startForm, name: e.target.value })
            }
          />

          <label className={styles.fieldLabel} htmlFor={startContactId}>
            <Phone size={14} /> Phone or email
          </label>
          <input
            id={startContactId}
            className={styles.input}
            placeholder="Phone number or email"
            value={startForm.contact}
            onChange={(e) =>
              setStartForm({ ...startForm, contact: e.target.value })
            }
          />

          <label className={styles.fieldLabel} htmlFor={startMessageId}>
            <MessageCircle size={14} /> Message
          </label>
          <textarea
            id={startMessageId}
            className={styles.input}
            rows={5}
            placeholder="Start a conversation..."
            value={startForm.message}
            onChange={(e) =>
              setStartForm({ ...startForm, message: e.target.value })
            }
          />

          <button
            className={styles.primaryBtn}
            type="button"
            onClick={startConversation}
            disabled={sending}
          >
            <Send size={17} />
            Start Conversation
          </button>

          <h2>
            <Send size={22} /> Reply Direct
          </h2>

          {activeGroup ? (
            <>
              <label className={styles.fieldLabel} htmlFor={replyId}>
                <Reply size={14} /> Reply message
              </label>

              <textarea
                id={replyId}
                className={styles.input}
                rows={7}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />

              <div className={styles.actionGroup}>
                <button
                  className={styles.primaryBtn}
                  type="button"
                  onClick={sendToDashboard}
                  disabled={sending || !replyText.trim()}
                >
                  <Send size={17} />
                  {sending ? "Sending..." : "Send"}
                </button>

                <button
                  className={styles.primaryBtn}
                  type="button"
                  onClick={openWhatsAppReply}
                  disabled={!canReplyByWhatsApp}
                >
                  <Phone size={17} />
                  WhatsApp
                </button>

                <button
                  className={styles.primaryBtn}
                  type="button"
                  onClick={openEmailReply}
                  disabled={!canReplyByEmail}
                >
                  <Mail size={17} />
                  Email
                </button>

                <button
                  className={styles.iconAction}
                  type="button"
                  onClick={copyReply}
                  aria-label="Copy reply message"
                  title="Copy reply message"
                >
                  <Copy size={17} />
                </button>
              </div>
            </>
          ) : (
            <p>Select a customer to reply.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
