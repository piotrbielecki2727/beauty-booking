"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { useBusinessSettings } from "@/features/business-settings/hooks/useBusinessSettings"
import type { StaffMemberAvailabilitySettings } from "@/features/business-settings/types/businessSettings"
import type {
  OnlineBookingDraft,
  PendingGuardedAction,
  SalonManagementTab,
} from "@/features/business-settings/types/salonManagement"
import {
  areDraftsEqual,
  cloneStaffMembersSettings,
  createSavedSettings,
  getOnlineBookingDraft,
} from "@/features/business-settings/utils/businessSettingsDrafts"
import { saveBusinessSettings } from "@/features/business-settings/utils/businessSettingsStorage"

const savedSettingsMessage = "Ustawienia zostały zapisane."

const useSalonManagementSettings = () => {
  const settings = useBusinessSettings()
  const currentOnlineSettings = useMemo(
    () => getOnlineBookingDraft(settings.booking),
    [settings.booking]
  )
  const currentStaffSettings = useMemo(
    () => cloneStaffMembersSettings(settings.booking.staffMembers),
    [settings.booking.staffMembers]
  )
  const [activeTab, setActiveTab] =
    useState<SalonManagementTab>("online-booking")
  const [onlineDraft, setOnlineDraft] =
    useState<OnlineBookingDraft>(currentOnlineSettings)
  const [staffDrafts, setStaffDrafts] =
    useState<StaffMemberAvailabilitySettings[]>(currentStaffSettings)
  const [selectedStaffMemberId, setSelectedStaffMemberId] = useState(
    settings.booking.defaultStaffMemberId
  )
  const [pendingGuardedAction, setPendingGuardedAction] =
    useState<PendingGuardedAction | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const onlineDraftIsDirty = !areDraftsEqual(
    onlineDraft,
    currentOnlineSettings
  )
  const staffDraftsAreDirty = !areDraftsEqual(
    staffDrafts,
    currentStaffSettings
  )
  const hasUnsavedChanges = onlineDraftIsDirty || staffDraftsAreDirty

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return undefined
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const updateOnlineDraft = (changes: Partial<OnlineBookingDraft>) => {
    setOnlineDraft((currentDraft) => ({
      ...currentDraft,
      ...changes,
    }))
    setSavedMessage(null)
  }

  const updateSelectedStaffSettings = (
    nextStaffSettings: StaffMemberAvailabilitySettings
  ) => {
    setStaffDrafts((currentDrafts) =>
      currentDrafts.map((staffSettings) =>
        staffSettings.staffMemberId === nextStaffSettings.staffMemberId
          ? nextStaffSettings
          : staffSettings
      )
    )
    setSavedMessage(null)
  }

  const runWithUnsavedChangesGuard = useCallback(
    (action: () => void) => {
      if (!hasUnsavedChanges) {
        action()

        return true
      }

      setPendingGuardedAction({ action })

      return false
    },
    [hasUnsavedChanges]
  )

  const handleTabChange = (nextTab: SalonManagementTab) => {
    if (nextTab === activeTab) {
      return
    }

    runWithUnsavedChangesGuard(() => setActiveTab(nextTab))
  }

  const closeGuardDialog = () => setPendingGuardedAction(null)

  const confirmGuardedAction = () => {
    const action = pendingGuardedAction?.action

    setOnlineDraft(currentOnlineSettings)
    setStaffDrafts(currentStaffSettings)
    setSavedMessage(null)
    setPendingGuardedAction(null)
    action?.()
  }

  const saveAllDrafts = () => {
    // TODO backend: replace this localStorage save with a salon settings API mutation.
    saveBusinessSettings(createSavedSettings({ onlineDraft, settings, staffDrafts }))
    setSavedMessage(savedSettingsMessage)
  }

  const saveDraftsAndRunGuardedAction = () => {
    const action = pendingGuardedAction?.action

    saveAllDrafts()
    setPendingGuardedAction(null)
    action?.()
  }

  const saveOnlineBookingSettings = () => {
    // TODO backend: replace this localStorage save with an online-booking settings API mutation.
    saveBusinessSettings({
      ...settings,
      booking: {
        ...settings.booking,
        ...onlineDraft,
      },
    })
    setSavedMessage(savedSettingsMessage)
  }

  const saveStaffSettings = () => {
    // TODO backend: replace this localStorage save with a staff availability/services API mutation.
    saveBusinessSettings({
      ...settings,
      booking: {
        ...settings.booking,
        staffMembers: cloneStaffMembersSettings(staffDrafts),
      },
    })
    setSavedMessage(savedSettingsMessage)
  }

  return {
    activeTab,
    closeGuardDialog,
    confirmGuardedAction,
    handleTabChange,
    hasUnsavedChanges,
    onlineDraft,
    onlineDraftIsDirty,
    pendingGuardedAction,
    runWithUnsavedChangesGuard,
    saveDraftsAndRunGuardedAction,
    saveOnlineBookingSettings,
    saveStaffSettings,
    savedMessage,
    selectedStaffMemberId,
    setSelectedStaffMemberId,
    settings,
    staffDrafts,
    staffDraftsAreDirty,
    updateOnlineDraft,
    updateSelectedStaffSettings,
  }
}

export { savedSettingsMessage, useSalonManagementSettings }
