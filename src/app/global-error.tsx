"use client";

import { useEffect } from "react";

function clearClientRecoveryState() {
  const jobs: Promise<unknown>[] = [];

  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  } catch {
    // Storage can be blocked in some mobile browsers.
  }

  if ("caches" in window) {
    jobs.push(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
    );
  }

  if ("serviceWorker" in navigator) {
    jobs.push(
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        ),
    );
  }

  return Promise.allSettled(jobs);
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rify Luxe global client error:", error);
  }, [error]);

  const recover = async () => {
    await clearClientRecoveryState();
    reset();
    window.location.reload();
  };

  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100svh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "#f8f3ee",
            color: "#18332f",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <section
            style={{
              width: "min(460px, 100%)",
              border: "1px solid rgba(24, 51, 47, 0.16)",
              borderRadius: "16px",
              background: "#fffdf9",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(24, 51, 47, 0.14)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#9a6a22",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Rify Luxe Abaya
            </p>
            <h1 style={{ margin: "0 0 10px", fontSize: "28px" }}>
              Refresh needed
            </h1>
            <p style={{ margin: "0 0 22px", lineHeight: 1.6, color: "#4d625f" }}>
              We cleaned old phone browser data. Reload the shop to continue.
            </p>
            <button
              type="button"
              onClick={recover}
              style={{
                width: "100%",
                border: 0,
                borderRadius: "999px",
                background: "#18332f",
                color: "#ffffff",
                padding: "13px 18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reload shop
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
