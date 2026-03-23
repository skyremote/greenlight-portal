import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Greenlight Coaching Portal",
  description: "Coaching management portal by Greenlight",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "#1E1E1E", color: "#e5e7eb" }}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#2A2A2A",
              border: "1px solid #333",
              color: "#e5e7eb",
            },
          }}
        />
      </body>
    </html>
  );
}
