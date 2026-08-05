import { Clock } from "lucide-react"

import { TimePicker, parseTimeToMinutes } from "@/components/common/time-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { SectionLabel } from "@/features/business-settings/components/SectionLabel"
import { weekdayLabels } from "@/features/business-settings/config/salonManagementOptions"
import type {
  StaffMemberAvailabilitySettings,
  Weekday,
} from "@/features/business-settings/types/businessSettings"
import type { StaffSettingsChangeHandler } from "@/features/business-settings/types/salonManagement"

type WeeklyScheduleEditorProps = {
  onStaffSettingsChange: StaffSettingsChangeHandler
  staffSettings: StaffMemberAvailabilitySettings
}

const WeeklyScheduleEditor = ({
  onStaffSettingsChange,
  staffSettings,
}: WeeklyScheduleEditorProps) => {
  const updateWorkingDay = (
    weekday: Weekday,
    key: "endTime" | "isWorking" | "startTime",
    value: boolean | string
  ) => {
    onStaffSettingsChange({
      ...staffSettings,
      weeklySchedule: staffSettings.weeklySchedule.map((day) =>
        day.weekday === weekday
          ? {
              ...day,
              [key]: value,
            }
          : day
      ),
    })
  }

  return (
    <div className="grid gap-3">
      <SectionLabel icon={<Clock aria-hidden="true" />} label="Grafik tygodniowy" />
      <div className="grid gap-2">
        {staffSettings.weeklySchedule.map((day) => {
          const startMinutes = parseTimeToMinutes(day.startTime)

          return (
            <div
              className="grid gap-3 rounded-lg border border-border/70 bg-card p-3 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
              key={day.weekday}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={day.isWorking}
                  onCheckedChange={(checked) =>
                    updateWorkingDay(day.weekday, "isWorking", checked === true)
                  }
                />
                <span>{weekdayLabels[day.weekday]}</span>
              </div>
              <TimePicker
                disabled={!day.isWorking}
                onChange={(value) => updateWorkingDay(day.weekday, "startTime", value)}
                startTime="05:00"
                value={day.startTime}
              />
              <TimePicker
                disabled={!day.isWorking}
                onChange={(value) => updateWorkingDay(day.weekday, "endTime", value)}
                startTime={
                  parseTimeToMinutes(day.endTime) <= startMinutes
                    ? day.startTime
                    : "05:00"
                }
                value={day.endTime}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { WeeklyScheduleEditor }
export type { WeeklyScheduleEditorProps }
