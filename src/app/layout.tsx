<<<<<<< HEAD
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* 🔥 Toast UI */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              borderRadius: "10px",
=======
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Rify Luxe Abaya",
    template: "%s | Rify Luxe Abaya",
  },
  description:
    "Elegant abayas and modest fashion products from Rify Luxe Abaya.",
  applicationName: "Rify Luxe Abaya",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/rify-icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/rify-icon.svg",
    apple: "/rify-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d302c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#102f2b",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "14px",
>>>>>>> 2090a59 (new changes)
            },
          }}
        />
      </body>
    </html>
  );
}
