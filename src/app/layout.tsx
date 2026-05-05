import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
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
            },
          }}
        />
      </body>
    </html>
  );
}