import type { Metadata } from "next"

import { ManagerDashboard } from "@/features/manager/components/ManagerDashboard"

export const metadata: Metadata = {
  title: "Panel managera | Beauty Booking",
  description: "Zarządzaj rezerwacjami i dzisiejszym grafikiem salonu.",
}

const ManagerPage = () => (
  <ManagerDashboard />
)

export default ManagerPage
