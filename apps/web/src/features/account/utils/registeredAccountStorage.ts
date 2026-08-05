import { defaultAccountRole, isAccountRole } from "@/features/account/types/accountRole"
import type { RegisteredAccount } from "@/features/account/types/registeredAccount"

const registeredAccountsStorageKey = "beauty-booking:registered-accounts:v1"

const demoRegisteredAccounts: RegisteredAccount[] = [
  {
    birthDate: "1990-04-12",
    createdAt: "2026-08-01T08:00:00.000Z",
    email: "owner@beautybooking.test",
    firstName: "Anna",
    id: "demo-owner-account",
    lastName: "Kowalska",
    password: "11111111",
    phone: "785581863",
    role: "Owner",
  },
  {
    birthDate: "1988-09-20",
    createdAt: "2026-08-01T08:00:00.000Z",
    email: "admin@beautybooking.test",
    firstName: "Olga",
    id: "demo-admin-account",
    lastName: "Maj",
    password: "11111111",
    phone: "600700800",
    role: "Admin",
  },
  {
    birthDate: "1994-02-08",
    createdAt: "2026-08-01T08:00:00.000Z",
    email: "customer@beautybooking.test",
    firstName: "Katarzyna",
    id: "demo-customer-account",
    lastName: "Zielińska",
    password: "11111111",
    phone: "501502503",
    role: "Customer",
  },
]

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null

const readString = (value: unknown) => (typeof value === "string" ? value : "")

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const readRegisteredAccounts = () => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    // TODO backend: replace localStorage reads with account/auth API queries.
    const rawAccounts = window.localStorage.getItem(registeredAccountsStorageKey)

    if (!rawAccounts) {
      return demoRegisteredAccounts
    }

    const parsedAccounts: unknown = JSON.parse(rawAccounts)

    if (!Array.isArray(parsedAccounts)) {
      return []
    }

    const storedAccounts = parsedAccounts.flatMap((account): RegisteredAccount[] => {
      if (!isRecord(account)) {
        return []
      }

      const registeredAccount = {
        birthDate: readString(account.birthDate),
        createdAt: readString(account.createdAt),
        email: readString(account.email),
        firstName: readString(account.firstName),
        id: readString(account.id),
        lastName: readString(account.lastName),
        password: readString(account.password),
        phone: readString(account.phone),
        role: isAccountRole(account.role) ? account.role : defaultAccountRole,
      } satisfies RegisteredAccount

      return registeredAccount.id && registeredAccount.email && registeredAccount.password ? [registeredAccount] : []
    })

    return mergeDemoAccounts(storedAccounts)
  } catch {
    return demoRegisteredAccounts
  }
}

const mergeDemoAccounts = (accounts: RegisteredAccount[]) => [
  ...demoRegisteredAccounts.filter(
    (demoAccount) => !accounts.some((account) => normalizeEmail(account.email) === normalizeEmail(demoAccount.email))
  ),
  ...accounts,
]

const findRegisteredAccountByEmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email)

  return readRegisteredAccounts().find((account) => normalizeEmail(account.email) === normalizedEmail)
}

const saveRegisteredAccount = (account: RegisteredAccount) => {
  if (typeof window === "undefined") {
    return
  }

  const accounts = readRegisteredAccounts()
  const normalizedEmail = normalizeEmail(account.email)
  const nextAccounts = [
    ...accounts.filter((storedAccount) => normalizeEmail(storedAccount.email) !== normalizedEmail),
    account,
  ]

  try {
    // TODO backend: replace localStorage writes with account registration API mutation.
    window.localStorage.setItem(registeredAccountsStorageKey, JSON.stringify(nextAccounts))
  } catch {
    return
  }
}

export { findRegisteredAccountByEmail, readRegisteredAccounts, registeredAccountsStorageKey, saveRegisteredAccount }
