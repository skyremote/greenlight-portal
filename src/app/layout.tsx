import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

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
    <html lang="en" className={`h-full antialiased ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-200">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e5e7eb",
            },
          }}
        />
      </body>
    </html>
  );
}
