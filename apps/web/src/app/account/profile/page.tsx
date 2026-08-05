import type { Metadata } from "next"

import { CustomerProfilePage } from "@/features/account/components/CustomerProfilePage"

export const metadata: Metadata = {
  title: "Dane konta | Beauty Booking",
  description: "Podgląd danych konta klientki.",
}

const AccountProfilePage = () => <CustomerProfilePage />

export default AccountProfilePage
