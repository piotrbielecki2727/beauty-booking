import type { AccountRole } from "@/features/account/types/accountRole";

const isSalonTeamRole = (role: AccountRole) =>
  role === "Owner" ||
  role === "Manager" ||
  role === "Worker" ||
  role === "Admin";

const canCreateStaffReservation = (role: AccountRole) => isSalonTeamRole(role);

export { canCreateStaffReservation, isSalonTeamRole };
