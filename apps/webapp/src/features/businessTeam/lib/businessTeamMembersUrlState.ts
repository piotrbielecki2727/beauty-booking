import type { BusinessTeamMemberListStatus } from "@beauty-booking/shared";

const deactivatedStatusSearchParam = "deactivated";

const getBusinessTeamMemberListStatusFromSearchParam = (
  status: string | string[] | null | undefined,
): BusinessTeamMemberListStatus =>
  status === deactivatedStatusSearchParam ? "DEACTIVATED" : "ACTIVE";

const getBusinessTeamMembersHref = (status: BusinessTeamMemberListStatus) =>
  status === "DEACTIVATED"
    ? `/management/employees?status=${deactivatedStatusSearchParam}`
    : "/management/employees";

export {
  deactivatedStatusSearchParam,
  getBusinessTeamMemberListStatusFromSearchParam,
  getBusinessTeamMembersHref,
};
