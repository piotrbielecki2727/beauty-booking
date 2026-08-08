import { z } from "zod";

export const accountRoles = [
  "Owner",
  "Manager",
  "Employee",
  "Customer",
  "Admin",
] as const;

export type AccountRole = (typeof accountRoles)[number];

export const accountRoleSchema = z.enum(accountRoles);

export const defaultAccountRole = "Customer" satisfies AccountRole;

export const isAccountRole = (value: unknown): value is AccountRole =>
  typeof value === "string" && accountRoles.includes(value as AccountRole);

export const salonTeamRoles = [
  "Owner",
  "Manager",
  "Employee",
  "Admin",
] satisfies AccountRole[];
export const salonManagementRoles = ["Owner", "Admin"] satisfies AccountRole[];

export const isSalonTeamRole = (role: AccountRole) =>
  salonTeamRoles.some((salonTeamRole) => salonTeamRole === role);

export const canCreateStaffReservation = (role: AccountRole) =>
  isSalonTeamRole(role);

export const canManageSalonSettings = (role: AccountRole) =>
  salonManagementRoles.some((managementRole) => managementRole === role);
