import { CalendarClock } from "lucide-react"

import { AppNumberInput } from "@/components/common/app-number-input"
import { FormField } from "@/components/common/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { SectionLabel } from "@/features/business-settings/components/SectionLabel"
import type { StaffMemberAvailabilitySettings } from "@/features/business-settings/types/businessSettings"
import type { StaffSettingsChangeHandler } from "@/features/business-settings/types/salonManagement"
import { mockBeautyServices } from "@/features/booking/mocks/services"
import { formatDuration } from "@/features/booking/utils/serviceFormatters"

type ServiceSettingsEditorProps = {
  onStaffSettingsChange: StaffSettingsChangeHandler
  staffSettings: StaffMemberAvailabilitySettings
}

const ServiceSettingsEditor = ({
  onStaffSettingsChange,
  staffSettings,
}: ServiceSettingsEditorProps) => {
  const updateService = (
    serviceId: string,
    key: "durationMinutes" | "isEnabled" | "priceFrom",
    value: boolean | number
  ) => {
    onStaffSettingsChange({
      ...staffSettings,
      serviceSettings: staffSettings.serviceSettings.map((serviceSettings) =>
        serviceSettings.serviceId === serviceId
          ? {
              ...serviceSettings,
              [key]: value,
            }
          : serviceSettings
      ),
    })
  }

  return (
    <div className="grid gap-3">
      <SectionLabel icon={<CalendarClock aria-hidden="true" />} label="Usługi, czas i cena" />
      <div className="grid gap-2">
        {staffSettings.serviceSettings.map((serviceSettings) => {
          // TODO backend: replace mockBeautyServices with services loaded for the current salon.
          const service = mockBeautyServices.find(
            (currentService) => currentService.id === serviceSettings.serviceId
          )

          if (!service) {
            return null
          }

          return (
            <div
              className="grid gap-3 rounded-lg border border-border/70 bg-card p-3 lg:grid-cols-[minmax(0,1fr)_8.5rem_8.5rem]"
              key={serviceSettings.serviceId}
            >
              <div className="flex min-w-0 items-start gap-3 text-sm">
                <Checkbox
                  checked={serviceSettings.isEnabled}
                  onCheckedChange={(checked) =>
                    updateService(serviceSettings.serviceId, "isEnabled", checked === true)
                  }
                />
                <span className="grid min-w-0 gap-1">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Domyślnie: {formatDuration(service.durationMinutes)} / {service.priceFrom} zł
                  </span>
                </span>
              </div>
              <FormField label="Czas (w min.)">
                <AppNumberInput
                  disabled={!serviceSettings.isEnabled}
                  min={15}
                  onChange={(value) =>
                    updateService(serviceSettings.serviceId, "durationMinutes", value)
                  }
                  step={15}
                  value={serviceSettings.durationMinutes}
                />
              </FormField>
              <FormField label="Cena (zł)">
                <AppNumberInput
                  disabled={!serviceSettings.isEnabled}
                  min={0}
                  onChange={(value) =>
                    updateService(serviceSettings.serviceId, "priceFrom", value)
                  }
                  step={5}
                  value={serviceSettings.priceFrom}
                />
              </FormField>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ServiceSettingsEditor }
export type { ServiceSettingsEditorProps }
