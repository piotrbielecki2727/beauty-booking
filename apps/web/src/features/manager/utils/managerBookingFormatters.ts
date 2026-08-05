import type { ManagerBookingStatus } from "@/features/manager/types/managerBooking"

const managerBookingStatusLabels: Record<ManagerBookingStatus, string> = {
  cancelled: "Odwołana",
  completed: "Zakończona",
  confirmed: "Potwierdzona",
  new: "Nowa",
}

const managerBookingStatusVariants: Record<ManagerBookingStatus, "destructive" | "outline" | "secondary"> = {
  cancelled: "destructive",
  completed: "outline",
  confirmed: "secondary",
  new: "secondary",
}

const formatManagerBookingDate = (date: string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`))

const formatManagerBookingPrice = (priceFrom: number) => `od ${priceFrom} zł`

const formatManagerPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "").slice(0, 9)
  const groupedNumber = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim()

  return groupedNumber ? `+48 ${groupedNumber}` : "+48"
}

const formatManagerBookingDuration = (durationMinutes: number) => {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (!hours) {
    return `${minutes} min`
  }

  if (!minutes) {
    return `${hours} godz.`
  }

  return `${hours} godz. ${minutes} min`
}

export {
  formatManagerBookingDate,
  formatManagerBookingDuration,
  formatManagerBookingPrice,
  formatManagerPhoneNumber,
  managerBookingStatusLabels,
  managerBookingStatusVariants,
}
