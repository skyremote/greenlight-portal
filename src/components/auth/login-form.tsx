"use client"

import { useState, FormEvent } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")

  const loginAction = useMutation(api.auth.login)
  const registerAction = useMutation(api.auth.register)
  const { login } = useAuth()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.")
      return
    }

    setIsSubmitting(true)

    try {
      const fn = mode === "register" ? registerAction : loginAction
      const result = await fn({ username: username.trim(), password })

      if (result && result.token) {
        login(result.token)
        window.location.href = "/dashboard"
        return
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-300">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          autoComplete="username"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-300">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "register" ? "Creating account..." : "Signing in..."
          : mode === "register" ? "Create Account" : "Sign In"}
      </Button>

      <p className="text-center text-sm text-gray-400">
        {mode === "login" ? (
          <>
            No account?{" "}
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null) }}
              className="text-green-400 hover:text-green-300 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null) }}
              className="text-green-400 hover:text-green-300 underline"
            >
              Sign In
            </button>
          </>
        )}
      </p>
    </form>
  )
}
