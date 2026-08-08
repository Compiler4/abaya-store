import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import "./globals.css";

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
