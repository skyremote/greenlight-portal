"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/login";
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
      <p className="text-gray-400">Redirecting...</p>
    </div>
  );
}
