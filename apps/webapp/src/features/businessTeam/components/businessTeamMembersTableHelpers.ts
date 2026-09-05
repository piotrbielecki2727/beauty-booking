import {
  businessTeamMemberRoles,
  type BusinessTeamMember,
  type BusinessTeamMemberRole,
} from "@beauty-booking/shared";

import { cn } from "@/lib/utils";

const temporaryTeamMemberImageSources = [
  "/woman1.png",
  "/woman2.png",
  "/woman3.png",
  "/woman4.png",
];

const getTemporaryTeamMemberImageSrc = (memberId: string) => {
  const imageIndex =
    Array.from(memberId).reduce(
      (sum, character, index) => sum + character.charCodeAt(0) * (index + 1),
      0,
    ) % temporaryTeamMemberImageSources.length;

  return temporaryTeamMemberImageSources[imageIndex];
};

const getRoleBadgeClassNames = (role: BusinessTeamMemberRole | "Owner") =>
  cn(
    "inline-flex h-7 w-fit items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium",
    role === "Owner" &&
      "border-transparent bg-[var(--role-badge-owner-surface)] text-[var(--role-badge-owner-text)]",
    role === "Manager" &&
      "border-transparent bg-[var(--role-badge-manager-surface)] text-[var(--role-badge-manager-text)]",
    role === "Employee" &&
      "border-transparent bg-[var(--role-badge-employee-surface)] text-[var(--role-badge-employee-text)]",
    role === "Intern" &&
      "border-transparent bg-[var(--role-badge-intern-surface)] text-[var(--role-badge-intern-text)]",
  );

const getAccessBadgeClassNames = (
  status: BusinessTeamMember["access"]["status"] | "OWNER",
) =>
  cn(
    "inline-flex h-7 w-fit items-center rounded-md border px-2.5 text-xs font-medium",
    status === "OWNER" && "border-brand bg-brand-soft text-brand",
    status === "ACTIVE" &&
      "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success",
    status === "INVITED" &&
      "border-[var(--status-warning-border,var(--border))] bg-[var(--status-warning-surface,var(--background))] text-warning",
    status === "EXPIRED" && "border-line-strong bg-surface text-copy-muted",
    status === "NO_ACCESS" && "border-line-strong bg-surface text-copy-muted",
  );

const getBirthdayLabel = (month: number | null, day: number | null) => {
  if (!month || !day) {
    return "-";
  }

  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}`;
};

const isBusinessTeamMemberRole = (
  value: string,
): value is BusinessTeamMemberRole =>
  businessTeamMemberRoles.includes(value as BusinessTeamMemberRole);

export {
  getAccessBadgeClassNames,
  getBirthdayLabel,
  getRoleBadgeClassNames,
  getTemporaryTeamMemberImageSrc,
  isBusinessTeamMemberRole,
};
