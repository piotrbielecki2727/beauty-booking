"use client"

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

import { AppTabs, type AppTabItem } from "@/components/common/app-tabs"
import { ConfirmationDialog } from "@/components/common/confirmation-dialog"
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell"
import type { CustomerNavigationIntent } from "@/features/account/components/CustomerSidebar"
import { useAccountSession } from "@/features/account/hooks/useAccountSession"
import {
  BusinessSettingsLoading,
  BusinessSettingsLoginRequired,
  BusinessSettingsNoAccess,
} from "@/features/business-settings/components/BusinessSettingsAccessStates"
import { OnlineBookingTab } from "@/features/business-settings/components/OnlineBookingTab"
import { StaffServicesTab } from "@/features/business-settings/components/StaffServicesTab"
import { salonManagementTabLabels } from "@/features/business-settings/config/salonManagementOptions"
import {
  savedSettingsMessage,
  useSalonManagementSettings,
} from "@/features/business-settings/hooks/useSalonManagementSettings"
import type { SalonManagementTab } from "@/features/business-settings/types/salonManagement"
import { canEditBusinessAvailability } from "@/features/business-settings/utils/businessSettingsPermissions"
import { mockStaffMembers } from "@/features/booking/mocks/staff"
import { useClientHydrated } from "@/hooks/use-client-hydrated"

const BusinessSettingsPage = () => {
  const isHydrated = useClientHydrated()

  if (!isHydrated) {
    return <BusinessSettingsLoading />
  }

  return <BusinessSettingsContent />
}

const BusinessSettingsContent = () => {
  const accountSession = useAccountSession()
  const router = useRouter()
  const salonSettings = useSalonManagementSettings()
  const staffById = useMemo(
    () => new Map(mockStaffMembers.map((staffMember) => [staffMember.id, staffMember])),
    []
  )
  const canEdit = accountSession
    ? canEditBusinessAvailability(accountSession.role)
    : false

  const handleNavigationRequest = useCallback(
    (intent: CustomerNavigationIntent) =>
      salonSettings.runWithUnsavedChangesGuard(
        intent.onConfirm ?? (() => router.push(intent.href))
      ),
    [router, salonSettings]
  )

  if (!accountSession) {
    return <BusinessSettingsLoginRequired />
  }

  const tabItems: AppTabItem<SalonManagementTab>[] = [
    {
      content: (
        <OnlineBookingTab
          draft={salonSettings.onlineDraft}
          isDirty={salonSettings.onlineDraftIsDirty}
          onChange={salonSettings.updateOnlineDraft}
          onSave={salonSettings.saveOnlineBookingSettings}
          savedMessage={
            salonSettings.savedMessage === savedSettingsMessage
              ? salonSettings.savedMessage
              : null
          }
          staffMembers={salonSettings.staffDrafts}
          staffNameById={staffById}
        />
      ),
      label: salonManagementTabLabels["online-booking"],
      value: "online-booking",
    },
    {
      content: (
        <StaffServicesTab
          isDirty={salonSettings.staffDraftsAreDirty}
          isSoloBusiness={salonSettings.onlineDraft.isSoloBusiness}
          onSave={salonSettings.saveStaffSettings}
          onSelectedStaffMemberChange={salonSettings.setSelectedStaffMemberId}
          onStaffSettingsChange={salonSettings.updateSelectedStaffSettings}
          savedMessage={
            salonSettings.savedMessage === savedSettingsMessage
              ? salonSettings.savedMessage
              : null
          }
          selectedStaffMemberId={salonSettings.selectedStaffMemberId}
          soloStaffMemberId={salonSettings.onlineDraft.defaultStaffMemberId}
          staffMembers={salonSettings.staffDrafts}
          staffNameById={staffById}
        />
      ),
      label: salonManagementTabLabels["staff-services"],
      value: "staff-services",
    },
  ]

  return (
    <>
      <CustomerAppShell
        accountSession={accountSession}
        description="Konfiguruj rezerwacje online, grafiki, usługi i ceny widoczne dla klientek."
        onNavigateRequest={handleNavigationRequest}
        title="Zarządzanie salonem"
      >
        <div className="grid gap-6">
          {!canEdit ? (
            <BusinessSettingsNoAccess />
          ) : (
            <AppTabs
              items={tabItems}
              onValueChange={salonSettings.handleTabChange}
              value={salonSettings.activeTab}
            />
          )}
        </div>
      </CustomerAppShell>

      <ConfirmationDialog
        confirmLabel="Opuść bez zapisu"
        description="Masz niezapisane zmiany w zarządzaniu salonem. Jeśli opuścisz tę sekcję, aktualne poprawki zostaną utracone."
        extraActionLabel="Zapisz i opuść"
        isOpen={Boolean(salonSettings.pendingGuardedAction)}
        onCancel={salonSettings.closeGuardDialog}
        onConfirm={salonSettings.confirmGuardedAction}
        onExtraAction={salonSettings.saveDraftsAndRunGuardedAction}
        title="Opuścić bez zapisywania?"
      />
    </>
  )
}

export { BusinessSettingsPage }
