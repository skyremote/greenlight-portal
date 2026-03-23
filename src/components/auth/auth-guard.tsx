"use client"

import { useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Logo } from "@/components/layout/logo"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Logo compact />
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
