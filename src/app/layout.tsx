import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
