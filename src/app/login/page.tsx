"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogIn, UserPlus, Loader2, Shield } from "lucide-react";

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
      toast.error("Missing credentials", {
        description: "Please enter both username and password.",
      });
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
        toast.success(
          mode === "register" ? "Account created" : "Welcome back",
          {
            description:
              mode === "register"
                ? "Your account has been created successfully."
                : "You have been signed in.",
          }
        );
        window.location.href = "/dashboard";
        return;
      } else if (data.errorMessage) {
        const msg = data.errorMessage;
        if (msg.includes("already exists")) {
          setError("Username taken. Try signing in.");
          toast.error("Username taken", {
            description: "This username is already registered. Try signing in instead.",
          });
        } else if (msg.includes("Invalid")) {
          setError("Invalid username or password.");
          toast.error("Invalid credentials", {
            description: "Please check your username and password.",
          });
        } else {
          setError(msg);
          toast.error("Error", { description: msg });
        }
      } else {
        setError("Something went wrong.");
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
      }
    } catch (err: any) {
      setError(err?.message || "Network error.");
      toast.error("Network error", {
        description: "Could not reach the server. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Animated orb background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/50">
          <CardHeader className="text-center pb-2">
            <h2 className="text-2xl font-semibold text-gray-100 font-heading">
              {mode === "register" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === "register"
                ? "Set up your coaching portal in seconds"
                : "Sign in to continue to your portal"}
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-300"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                  disabled={isSubmitting}
                  autoComplete="username"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password"
                  disabled={isSubmitting}
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  className="h-11"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Shield className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-sm font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "register"
                      ? "Creating account..."
                      : "Signing in..."}
                  </>
                ) : mode === "register" ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <Separator className="my-2" />

              <p className="text-center text-sm text-gray-400">
                {mode === "login" ? (
                  <>
                    No account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setError(null);
                      }}
                      className="text-green-400 hover:text-green-300 font-medium transition-colors"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setError(null);
                      }}
                      className="text-green-400 hover:text-green-300 font-medium transition-colors"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer tagline */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Greenlight Coaching Portal &middot; Empowering growth through
          structured coaching
        </p>
      </div>
    </div>
  );
}
