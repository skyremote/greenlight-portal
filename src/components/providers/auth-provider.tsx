"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

interface User {
  _id: string
  username: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = "greenlight_session_token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      setToken(stored)
    }
    setIsLoading(false)
  }, [])

  // validateSession returns { userId, username } or null
  const sessionResult = useQuery(
    api.authHelpers.validateSession,
    token ? { token } : "skip"
  )

  // sessionResult is undefined while loading, null if invalid, or { userId, username }
  const user: User | null =
    sessionResult
      ? { _id: sessionResult.userId as string, username: sessionResult.username as string }
      : null

  // If token exists but session came back null (invalid), clear it
  useEffect(() => {
    if (token && sessionResult === null) {
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [token, sessionResult])

  const login = useCallback((newToken: string) => {
    setToken(newToken)
    localStorage.setItem(TOKEN_KEY, newToken)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  // Still loading if: initial localStorage check not done, or token exists but query result not yet returned
  // When token is null, we skip the query so sessionResult stays undefined - that's NOT loading
  const stillLoading = isLoading || (!!token && sessionResult === undefined)
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading: stillLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
