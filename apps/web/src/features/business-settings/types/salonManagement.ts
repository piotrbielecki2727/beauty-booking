import type {
  BusinessBookingSettings,
  StaffMemberAvailabilitySettings,
} from "@/features/business-settings/types/businessSettings"

type SalonManagementTab = "online-booking" | "staff-services"

type OnlineBookingDraft = Pick<
  BusinessBookingSettings,
  "bookingMonthsAhead" | "defaultStaffMemberId" | "isSoloBusiness" | "slotStepMinutes"
>

type PendingGuardedAction = {
  action: () => void
}

type StaffSettingsChangeHandler = (
  settings: StaffMemberAvailabilitySettings
) => void

export type {
  OnlineBookingDraft,
  PendingGuardedAction,
  SalonManagementTab,
  StaffSettingsChangeHandler,
}
