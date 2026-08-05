import { defaultBusinessSettings } from "@/features/business-settings/mocks/defaultBusinessSettings"
import type { BusinessSettings } from "@/features/business-settings/types/businessSettings"

const businessSettingsStorageKey = "beauty-booking:business-settings:v1"
const businessSettingsChangeEventName = "beauty-booking:business-settings-change"

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null

const mergeBusinessSettings = (settings: unknown): BusinessSettings => {
  if (!isRecord(settings) || !isRecord(settings.booking)) {
    return defaultBusinessSettings
  }

  return {
    ...defaultBusinessSettings,
    ...settings,
    booking: {
      ...defaultBusinessSettings.booking,
      ...settings.booking,
      staffMembers: Array.isArray(settings.booking.staffMembers)
        ? settings.booking.staffMembers
        : defaultBusinessSettings.booking.staffMembers,
    },
  } satisfies BusinessSettings
}

const readBusinessSettings = () => {
  if (typeof window === "undefined") {
    return defaultBusinessSettings
  }

  try {
    // TODO backend: replace localStorage reads with salon settings API query.
    const rawSettings = window.localStorage.getItem(businessSettingsStorageKey)

    if (!rawSettings) {
      return defaultBusinessSettings
    }

    return mergeBusinessSettings(JSON.parse(rawSettings))
  } catch {
    return defaultBusinessSettings
  }
}

const saveBusinessSettings = (settings: BusinessSettings) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    // TODO backend: replace localStorage writes with salon settings API mutation.
    window.localStorage.setItem(businessSettingsStorageKey, JSON.stringify(settings))
    window.dispatchEvent(new Event(businessSettingsChangeEventName))
  } catch {
    return
  }
}

export {
  businessSettingsChangeEventName,
  businessSettingsStorageKey,
  readBusinessSettings,
  saveBusinessSettings,
}
