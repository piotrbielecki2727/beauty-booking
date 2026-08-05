"use client"

import Link from "next/link"

import { AppButton } from "@/components/common/app-button"
import { BadgeCheck } from "lucide-react"
import type { AccountSession } from "@/features/account/types/accountSession"

type AccountRegistrationSuccessStateProps = {
  createdAccount: AccountSession
}

const AccountRegistrationSuccessState = ({ createdAccount }: AccountRegistrationSuccessStateProps) => (
  <div className="grid gap-4">
    <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
      <BadgeCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="grid gap-1">
        <p className="font-medium">Konto zostało utworzone</p>
        <p className="leading-6 text-muted-foreground">
          E-mail został potwierdzony. Teraz zaloguj się, żeby przejść do rezerwacji z aktywnym kontem.
        </p>
      </div>
    </div>

    <div className="flex">
      <AppButton
        nativeButton={false}
        render={<Link href={{ pathname: "/login", query: { email: createdAccount.email } }} />}
      >
        Przejdź do logowania
      </AppButton>
    </div>
  </div>
)

export { AccountRegistrationSuccessState }