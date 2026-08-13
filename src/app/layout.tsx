import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const clientRecoveryScript = `
(function () {
  var version = "rify-luxe-mobile-recovery-2026-08-13-1";
  var versionKey = "rify_client_version";
  var reloadKey = "rify_client_recovered_" + version;

  function safely(work) {
    try {
      return work();
    } catch (error) {
      return undefined;
    }
  }

  function removeInvalidJson(key) {
    try {
      var value = window.localStorage && window.localStorage.getItem(key);
      if (value) JSON.parse(value);
    } catch (error) {
      safely(function () { window.localStorage.removeItem(key); });
    }
  }

  function clearInvalidUser() {
    try {
      var value = window.localStorage && window.localStorage.getItem("user");
      if (!value) return;
      JSON.parse(value);
    } catch (error) {
      safely(function () { window.localStorage.removeItem("user"); });
      safely(function () { window.localStorage.removeItem("token"); });
    }
  }

  function waitForJobs(jobs) {
    return Promise.all(
      jobs.map(function (job) {
        return Promise.resolve(job).catch(function () {
          return undefined;
        });
      })
    );
  }

  function clearAppCaches() {
    var jobs = [];

    if ("caches" in window) {
      jobs.push(
        window.caches.keys().then(function (keys) {
          return Promise.all(keys.map(function (key) {
            return window.caches.delete(key);
          }));
        })
      );
    }

    if ("serviceWorker" in navigator) {
      jobs.push(
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          return Promise.all(registrations.map(function (registration) {
            return registration.unregister();
          }));
        })
      );
    }

    return waitForJobs(jobs);
  }

  function shouldRecover(reason) {
    var message = String(
      (reason && (reason.message || reason.reason || reason.error)) || reason || ""
    );

    return /ChunkLoadError|Loading chunk|Cannot read properties of undefined|Minified React error|hydration/i.test(message);
  }

  function recover(reason) {
    if (!shouldRecover(reason)) return;

    try {
      if (window.sessionStorage.getItem(reloadKey)) return;
      window.sessionStorage.setItem(reloadKey, "1");
    } catch (error) {
      return;
    }

    clearInvalidUser();
    clearAppCaches().finally(function () {
      var separator = window.location.search ? "&" : "?";
      window.location.replace(
        window.location.pathname +
          window.location.search +
          separator +
          "rify_recovered=1" +
          window.location.hash
      );
    });
  }

  clearInvalidUser();
  removeInvalidJson("customer_deleted_reply_notifications");
  removeInvalidJson("customer_read_reply_notifications");
  removeInvalidJson("admin_deleted_notifications");
  removeInvalidJson("admin_read_notifications");

  safely(function () {
    var current = window.localStorage.getItem(versionKey);
    if (current !== version) {
      window.localStorage.setItem(versionKey, version);
      clearAppCaches();
    }
  });

  window.addEventListener("error", function (event) {
    recover(event.error || event.message);
  });

  window.addEventListener("unhandledrejection", function (event) {
    recover(event.reason);
  });
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),

  title: {
    default: "Rify Luxe Abaya",
    template: "%s | Rify Luxe Abaya",
  },

  description:
    "Discover elegant and premium abayas from Rify Luxe Abaya in Dar es Salaam.",

  applicationName: "Rify Luxe Abaya",
  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/rify-icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/rify-icon.svg",
        color: "#0d302c",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
  colorScheme: "light",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          id="rify-client-recovery"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: clientRecoveryScript }}
        />
        {children}

        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111111",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              padding: "14px 16px",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.22)",
            },
            success: {
              style: {
                background: "#14532d",
                color: "#ffffff",
              },
            },
            error: {
              style: {
                background: "#7f1d1d",
                color: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
