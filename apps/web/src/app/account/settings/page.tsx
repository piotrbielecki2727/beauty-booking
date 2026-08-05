import type { Metadata } from "next"

import { BusinessSettingsPage } from "@/features/business-settings/components/BusinessSettingsPage"

export const metadata: Metadata = {
  description: "Zarządzanie rezerwacjami online, godzinami pracy, usługami i cenami salonu.",
  title: "Zarządzanie salonem | Beauty Booking",
}

const SettingsPage = () => <BusinessSettingsPage />

export default SettingsPage
