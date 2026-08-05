type AuthRole = "manager"

type AuthUser = {
  email: string
  firstName: string
  id: string
  lastName: string
  role: AuthRole
}

type ManagerBusiness = {
  id: string
  name: string
  slug: string
}

type AuthSession = {
  business: ManagerBusiness
  user: AuthUser
}

type AuthStatus = "authenticated" | "loading" | "unauthenticated"

export type { AuthRole, AuthSession, AuthStatus, AuthUser, ManagerBusiness }
