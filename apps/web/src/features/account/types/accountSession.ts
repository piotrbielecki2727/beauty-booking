import type { AccountRole } from "@/features/account/types/accountRole"

type AccountSession = {
  birthDate: string
  createdAt: string
  email: string
  firstName: string
  id: string
  lastName: string
  phone: string
  role: AccountRole
}

export type { AccountSession }
