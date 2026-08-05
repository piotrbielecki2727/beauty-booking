import type { SalonManagementTab } from "@/features/business-settings/types/salonManagement"
import type { Weekday } from "@/features/business-settings/types/businessSettings"

const weekdayLabels: Record<Weekday, string> = {
  0: "Nd",
  1: "Pon",
  2: "Wt",
  3: "Śr",
  4: "Czw",
  5: "Pt",
  6: "Sob",
}

const bookingMonthsAheadOptions = [1, 2, 3, 6]
const slotStepOptions = [15, 30, 45, 60]

const salonManagementTabLabels: Record<SalonManagementTab, string> = {
  "online-booking": "Rezerwacje online",
  "staff-services": "Wykonawcy, grafiki i usługi",
}

export {
  bookingMonthsAheadOptions,
  salonManagementTabLabels,
  slotStepOptions,
  weekdayLabels,
}
