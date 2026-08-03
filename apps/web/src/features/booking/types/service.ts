type ServiceCategory =
  | "brows"
  | "cosmetology"
  | "hair"
  | "lashes"
  | "makeup"
  | "massage"
  | "nails"

type BeautyService = {
  category: ServiceCategory
  description: string
  durationMinutes: number
  id: string
  name: string
  priceFrom: number
}

export type { BeautyService, ServiceCategory }
