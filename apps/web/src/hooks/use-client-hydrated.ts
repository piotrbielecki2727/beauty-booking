"use client"

import { useSyncExternalStore } from "react"

const subscribeToClientHydration = (onStoreChange: () => void) => {
  const timeoutId = window.setTimeout(onStoreChange, 0)

  return () => window.clearTimeout(timeoutId)
}

const getClientHydrationSnapshot = () => true

const getServerHydrationSnapshot = () => false

const useClientHydrated = () =>
  useSyncExternalStore(
    subscribeToClientHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  )

export { useClientHydrated }
