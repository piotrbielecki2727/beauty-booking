import type { Metadata } from "next"

import { CustomerVisitsPage } from "@/features/account/components/CustomerVisitsPage"

export const metadata: Metadata = {
  title: "Moje wizyty | Beauty Booking",
  description: "Lista aktualnych rezerwacji klientki.",
}

const VisitsPage = () => <CustomerVisitsPage />

export default VisitsPage
