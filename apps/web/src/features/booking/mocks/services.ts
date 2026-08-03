import type { BeautyService } from "@/features/booking/types/service"

const mockBeautyServices: BeautyService[] = [
  {
    category: "nails",
    description: "Klasyczna stylizacja z opracowaniem skórek i trwałym kolorem.",
    durationMinutes: 90,
    id: "manicure-hybrid",
    name: "Manicure hybrydowy",
    priceFrom: 140,
  },
  {
    category: "lashes",
    description: "Naturalne podkreślenie oka z lekkim efektem wydłużenia.",
    durationMinutes: 120,
    id: "lashes-light-volume",
    name: "Rzęsy light volume",
    priceFrom: 220,
  },
  {
    category: "brows",
    description: "Geometria, regulacja i koloryzacja dopasowana do urody.",
    durationMinutes: 45,
    id: "brow-styling",
    name: "Stylizacja brwi",
    priceFrom: 90,
  },
  {
    category: "makeup",
    description: "Makijaż okolicznościowy z przygotowaniem skóry i utrwaleniem.",
    durationMinutes: 75,
    id: "occasion-makeup",
    name: "Makijaż wieczorowy",
    priceFrom: 260,
  },
  {
    category: "hair",
    description: "Modelowanie i lekkie fale do sesji, eventu albo wyjścia.",
    durationMinutes: 60,
    id: "soft-waves",
    name: "Fale i modelowanie",
    priceFrom: 160,
  },
]

export { mockBeautyServices }
