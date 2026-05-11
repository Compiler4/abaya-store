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

export default function MessagesPage() {
  const searchId = useId();
  const replyId = useId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [replyText, setReplyText] = useState(defaultReply);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    const res = await fetch("/api/messages", { cache: "no-store" });
    const data = await res.json();
    setMessages(data.contacts || data.data || []);
  };

  const fetchReplies = async () => {
    const res = await fetch("/api/messages/replies", { cache: "no-store" });
    const data = await res.json();
    setReplies(data.replies || []);
  };

  useEffect(() => {
    fetchMessages();
    fetchReplies();
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

    return Array.from(map.values()).sort((a, b) => {
      const aTime = new Date(a.latestMessage?.createdAt || 0).getTime();
      const bTime = new Date(b.latestMessage?.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [messages]);

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
  const canReplyByWhatsApp = Boolean(cleanPhone(activeContact)) && !canReplyByEmail;

  const sendToDashboard = async () => {
    if (!activeGroup || !replyText.trim()) return;

    setSending(true);

    await fetch("/api/messages/replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactMessageId: activeGroup.latestMessage?.id,
        customerName: activeGroup.name,
        customerContact: activeContact,
        message: replyText,
        channel: "DASHBOARD",
      }),
    });

    setReplyText(defaultReply);
    await fetchReplies();
    setSending(false);
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
          {filteredGroups.length} Customers • {messages.length} Messages
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
                    <small>{group.messages.length} messages</small>
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
                    </article>
                  ))}

                {activeReplies.map((reply) => (
                  <article key={reply.id} className={styles.adminBubble}>
                    <p>{reply.message}</p>

                    <small className={styles.metaLine}>
                      <Send size={14} />
                      Sent to customer dashboard •{" "}
                      {new Date(reply.createdAt).toLocaleString()}
                    </small>
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
                rows={9}
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
                  {sending ? "Sending..." : "Send to Dashboard"}
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
