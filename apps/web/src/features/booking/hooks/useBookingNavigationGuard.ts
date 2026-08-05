"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import type { CustomerNavigationIntent } from "@/features/account/components/CustomerSidebar"

type UseBookingNavigationGuardOptions = {
  shouldGuard: boolean
}

const useBookingNavigationGuard = ({
  shouldGuard,
}: UseBookingNavigationGuardOptions) => {
  const router = useRouter()
  const [pendingNavigationIntent, setPendingNavigationIntent] =
    useState<CustomerNavigationIntent>()

  useEffect(() => {
    if (!shouldGuard) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [shouldGuard])

  const requestNavigation = useCallback(
    (intent: CustomerNavigationIntent) => {
      if (!shouldGuard) {
        return true
      }

      setPendingNavigationIntent(intent)
      return false
    },
    [shouldGuard]
  )

  const cancelPendingNavigation = () => setPendingNavigationIntent(undefined)

  const confirmPendingNavigation = () => {
    const intent = pendingNavigationIntent

    setPendingNavigationIntent(undefined)

    if (!intent) {
      return
    }

    if (intent.onConfirm) {
      intent.onConfirm()
      return
    }

    router.push(intent.href)
  }

  return {
    cancelPendingNavigation,
    confirmPendingNavigation,
    isNavigationGuardOpen: Boolean(pendingNavigationIntent),
    requestNavigation,
  }
}

export { useBookingNavigationGuard }
export type { UseBookingNavigationGuardOptions }
