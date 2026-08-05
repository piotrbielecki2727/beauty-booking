const accountRoles = ["Owner", "Manager", "Worker", "Customer", "Admin"] as const

type AccountRole = (typeof accountRoles)[number]

const defaultAccountRole = "Customer" satisfies AccountRole

const isAccountRole = (value: unknown): value is AccountRole =>
  typeof value === "string" && accountRoles.includes(value as AccountRole)

export { accountRoles, defaultAccountRole, isAccountRole }
export type { AccountRole }
