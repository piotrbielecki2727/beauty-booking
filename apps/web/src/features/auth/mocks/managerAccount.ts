import type { AuthSession } from "@/features/auth/types/authSession"

type MockManagerCredentials = {
  email: string
  password: string
}

const mockManagerCredentials: MockManagerCredentials = {
  email: "manager@beautybooking.test",
  password: "manager123",
}

const mockManagerSession: AuthSession = {
  business: {
    id: "business_001",
    name: "Atelier Beauty",
    slug: "atelier-beauty",
  },
  user: {
    email: mockManagerCredentials.email,
    firstName: "Anna",
    id: "manager_001",
    lastName: "Nowak",
    role: "manager",
  },
}

export { mockManagerCredentials, mockManagerSession }
export type { MockManagerCredentials }
