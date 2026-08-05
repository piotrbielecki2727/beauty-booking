"use client"

import { AppDropdown } from "@/components/common/app-dropdown"
import type { AppDropdownOption } from "@/components/common/app-dropdown"

type TimePickerProps = {
  className?: string
  disabled?: boolean
  endTime?: string
  onChange: (value: string) => void
  startTime?: string
  stepMinutes?: number
  value: string
}

const parseTimeToMinutes = (value: string) => {
  const [hours = "0", minutes = "0"] = value.split(":")

  return Number(hours) * 60 + Number(minutes)
}

const formatMinutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

const createTimePickerOptions = ({
  endTime = "22:00",
  startTime = "05:00",
  stepMinutes = 15,
}: Pick<TimePickerProps, "endTime" | "startTime" | "stepMinutes"> = {}) => {
  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)

  if (stepMinutes <= 0 || endMinutes < startMinutes) {
    return []
  }

  return Array.from(
    { length: Math.floor((endMinutes - startMinutes) / stepMinutes) + 1 },
    (_, index): AppDropdownOption => {
      const value = formatMinutesToTime(startMinutes + index * stepMinutes)

      return {
        label: value,
        value,
      }
    }
  )
}

const timePickerOptions = createTimePickerOptions()

const TimePicker = ({
  className,
  disabled = false,
  endTime,
  onChange,
  startTime,
  stepMinutes,
  value,
}: TimePickerProps) => {
  const options = createTimePickerOptions({ endTime, startTime, stepMinutes })

  return (
    <AppDropdown
      className={className}
      disabled={disabled}
      onValueChange={onChange}
      options={options}
      value={value}
    />
  )
}

export {
  TimePicker,
  createTimePickerOptions,
  formatMinutesToTime,
  parseTimeToMinutes,
  timePickerOptions,
}
export type { TimePickerProps }
