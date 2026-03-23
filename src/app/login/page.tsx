"use client";

import { useState, FormEvent } from "react";
import { Logo } from "@/components/layout/logo";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("register");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      const fnName = mode === "register" ? "auth:register" : "auth:login";

      const res = await fetch(`${convexUrl}/api/mutation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: fnName,
          args: { username: username.trim(), password },
        }),
      });

      const data = await res.json();

      if (data.status === "success" && data.value?.token) {
        localStorage.setItem("greenlight_session_token", data.value.token);
        window.location.href = "/dashboard";
        return;
      } else if (data.errorMessage) {
        const msg = data.errorMessage;
        if (msg.includes("already exists")) {
          setError("Username taken. Try signing in.");
        } else if (msg.includes("Invalid")) {
          setError("Invalid username or password.");
        } else {
          setError(msg);
        }
      } else {
        setError("Something went wrong.");
      }
    } catch (err: any) {
      setError(err?.message || "Network error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-[#2A2A2A] border border-[#333] rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Welcome
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username" disabled={isSubmitting}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#444] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password" disabled={isSubmitting}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#444] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={isSubmitting}
              className="w-full py-2 px-4 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium transition disabled:opacity-50">
              {isSubmitting ? (mode === "register" ? "Creating account..." : "Signing in...") : (mode === "register" ? "Create Account" : "Sign In")}
            </button>
            <p className="text-center text-sm text-gray-400">
              {mode === "login" ? (
                <>No account? <button type="button" onClick={() => { setMode("register"); setError(null); }} className="text-green-400 underline">Register</button></>
              ) : (
                <>Have an account? <button type="button" onClick={() => { setMode("login"); setError(null); }} className="text-green-400 underline">Sign In</button></>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
