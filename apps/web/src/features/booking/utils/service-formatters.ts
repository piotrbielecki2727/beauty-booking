import type { ServiceCategory } from "@/features/booking/types/service"

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  brows: "Brwi",
  cosmetology: "Kosmetologia",
  hair: "Włosy",
  lashes: "Rzęsy",
  makeup: "Makijaż",
  massage: "Masaż",
  nails: "Paznokcie",
}

const priceFormatter = new Intl.NumberFormat("pl-PL", {
  currency: "PLN",
  maximumFractionDigits: 0,
  style: "currency",
})

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} godz.`
  }

  return `${hours} godz. ${remainingMinutes} min`
}

const formatPriceFrom = (price: number) => {
  return `od ${priceFormatter.format(price)}`
}

const getServiceCategoryLabel = (category: ServiceCategory) => {
  return serviceCategoryLabels[category]
}

export { formatDuration, formatPriceFrom, getServiceCategoryLabel }
