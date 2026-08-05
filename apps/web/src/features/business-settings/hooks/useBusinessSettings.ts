"use client"

import { useSyncExternalStore } from "react"

import type { BusinessSettings } from "@/features/business-settings/types/businessSettings"
import {
  businessSettingsChangeEventName,
  businessSettingsStorageKey,
  readBusinessSettings,
} from "@/features/business-settings/utils/businessSettingsStorage"

let cachedRawSettings: string | null | undefined
let cachedBusinessSettings: BusinessSettings | undefined

const subscribeToBusinessSettings = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(businessSettingsChangeEventName, onStoreChange)

  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(businessSettingsChangeEventName, onStoreChange)
  }
}

const getBusinessSettingsSnapshot = () => {
  if (typeof window === "undefined") {
    return readBusinessSettings()
  }

  const rawSettings = window.localStorage.getItem(businessSettingsStorageKey)

  if (rawSettings === cachedRawSettings && cachedBusinessSettings) {
    return cachedBusinessSettings
  }

  cachedRawSettings = rawSettings
  cachedBusinessSettings = readBusinessSettings()

  return cachedBusinessSettings
}

const getBusinessSettingsServerSnapshot = () => readBusinessSettings()

const useBusinessSettings = () =>
  useSyncExternalStore(
    subscribeToBusinessSettings,
    getBusinessSettingsSnapshot,
    getBusinessSettingsServerSnapshot
  )

export { useBusinessSettings }
