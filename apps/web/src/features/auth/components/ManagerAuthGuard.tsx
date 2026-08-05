"use client"

import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { useAuth } from "@/features/auth/providers/authProvider"

type ManagerAuthGuardProps = {
  children: ReactNode
}

const ManagerAuthGuard = ({ children }: ManagerAuthGuardProps) => {
  const router = useRouter()
  const { session, status } = useAuth()
  const isManager = session?.user.role === "manager"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/manager/login")
    }
  }, [router, status])

  if (status === "loading" || !isManager) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-background/55 p-6 backdrop-blur-md">
        <div className="grid w-full max-w-sm justify-items-center gap-4 rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-lg">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
          </span>
          <div className="grid gap-2">
            <p className="font-heading text-xl font-semibold">Ładujemy panel</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Sprawdzamy sesję i przygotowujemy dostęp do panelu.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export { ManagerAuthGuard }
export type { ManagerAuthGuardProps }
