"use client";

import { useEffect } from "react";
import { Logo } from "@/components/layout/logo";

export default function Home() {
  useEffect(() => {
    window.location.href = "/login";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <Logo />
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      <p className="text-sm text-gray-500">Redirecting...</p>
    </div>
  );
}
