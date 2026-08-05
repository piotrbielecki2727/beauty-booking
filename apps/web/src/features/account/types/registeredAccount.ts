import type { AccountRole } from "@/features/account/types/accountRole"

type RegisteredAccount = {
  birthDate: string
  createdAt: string
  email: string
  firstName: string
  id: string
  lastName: string
  password: string
  phone: string
  role: AccountRole
}

export type { RegisteredAccount }
