import type { AccountRole } from "../roles";

export type AccountSession = {
  birthDate: string;
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  role: AccountRole;
};

export type PublicAccount = Omit<AccountSession, "createdAt"> & {
  createdAt: string;
  emailVerifiedAt: string | null;
};
