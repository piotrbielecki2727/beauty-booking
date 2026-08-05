import type { AccountRole } from "@/features/account/types/accountRole"
import { privilegedBusinessSettingsRoles } from "@/features/business-settings/types/businessSettings"

const canEditBusinessAvailability = (role: AccountRole) =>
  privilegedBusinessSettingsRoles.some((privilegedRole) => privilegedRole === role)

export { canEditBusinessAvailability }
