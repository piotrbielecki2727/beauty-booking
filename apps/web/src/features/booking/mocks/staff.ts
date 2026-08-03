import type { BookingStaffMember } from "@/features/booking/types/staff"

const mockStaffMembers: BookingStaffMember[] = [
  {
    bio: "Specjalizuje się w naturalnych stylizacjach paznokci i precyzyjnym opracowaniu skórek.",
    id: "staff-amelia",
    name: "Amelia Nowak",
    role: "Stylistka paznokci",
    serviceIds: ["manicure-hybrid"],
  },
  {
    bio: "Pracuje z lekkimi objętościami i efektami dopasowanymi do kształtu oka.",
    id: "staff-julia",
    name: "Julia Wolska",
    role: "Stylistka rzęs i brwi",
    serviceIds: ["lashes-light-volume", "brow-styling"],
  },
  {
    bio: "Tworzy miękkie makijaże wieczorowe oraz szybkie stylizacje włosów na wyjścia.",
    id: "staff-lena",
    name: "Lena Zielińska",
    role: "Make-up artist",
    serviceIds: ["occasion-makeup", "soft-waves"],
  },
  {
    bio: "Łączy stylizację brwi, makijaż i delikatne fale przy przygotowaniach eventowych.",
    id: "staff-marta",
    name: "Marta Sokołowska",
    role: "Stylistka beauty",
    serviceIds: ["brow-styling", "occasion-makeup", "soft-waves"],
  },
]

export { mockStaffMembers }
