"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  type BusinessTeamMember,
  type BusinessTeamOwner,
} from "@beauty-booking/shared";

import {
  AppTable,
  AppTableBody,
  AppTableCell,
  AppTableEmptyState,
  AppTableHead,
  AppTableHeader,
  AppTableRow,
} from "@/components/reusable";

import { BusinessTeamMemberRow } from "./BusinessTeamMemberRow";
import { BusinessTeamOwnerRow } from "./BusinessTeamOwnerRow";

import type {
  BusinessTeamMemberFormInitialFocusField,
  BusinessTeamMemberListStatus,
  BusinessTeamMemberPendingIds,
} from "@/features/businessTeam/lib/businessTeamMembersTypes";

type BusinessTeamMembersTableProperties = {
  currentTimestampMs: number | null;
  isActionsDisabled: boolean;
  isBodyLoading: boolean;
  listStatus: BusinessTeamMemberListStatus;
  onCancelInvitation: (member: BusinessTeamMember) => void;
  onCopyInviteUrl: (inviteUrl: string) => void;
  onCreateInvitation: (member: BusinessTeamMember) => void;
  onDeactivateMember: (member: BusinessTeamMember) => void;
  onEditMember: (
    member: BusinessTeamMember,
    initialFocusField?: BusinessTeamMemberFormInitialFocusField,
  ) => void;
  onEditOwner: () => void;
  onReactivateMember: (member: BusinessTeamMember) => void;
  owner: BusinessTeamOwner;
  pendingTeamMemberIds: BusinessTeamMemberPendingIds;
  teamMembers: BusinessTeamMember[];
};

const skeletonRowsCount = 8;
const teamTableHeadClassName =
  "sticky top-0 z-10 bg-[var(--table-header-surface,var(--background))]";
const teamTableMinWidthClassName = "min-w-[74rem]";
const accessStatusOrder = {
  ACTIVE: 0,
  INVITED: 1,
  EXPIRED: 2,
  NO_ACCESS: 3,
} as const;

const BusinessTeamMembersTableSkeletonRows = ({
  loadingLabel,
}: {
  loadingLabel: string;
}) =>
  Array.from({ length: skeletonRowsCount }, (_, rowIndex) => (
    <AppTableRow key={rowIndex} aria-hidden={rowIndex > 0}>
      <AppTableCell>
        <div className="flex items-center gap-3">
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
        </div>
        {rowIndex === 0 ? <span className="sr-only">{loadingLabel}</span> : null}
      </AppTableCell>
      <AppTableCell>
        <div className="h-3 w-44 animate-pulse rounded-full bg-muted" />
      </AppTableCell>
      <AppTableCell>
        <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
      </AppTableCell>
      <AppTableCell>
        <div className="h-3 w-12 animate-pulse rounded-full bg-muted" />
      </AppTableCell>
      <AppTableCell>
        <div className="mx-auto h-7 w-20 animate-pulse rounded-md bg-muted" />
      </AppTableCell>
      <AppTableCell>
        <div className="mx-auto size-7 animate-pulse rounded-md bg-muted" />
      </AppTableCell>
      <AppTableCell>
        <div className="mx-auto h-7 w-36 animate-pulse rounded-md bg-muted" />
      </AppTableCell>
      <AppTableCell>
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      </AppTableCell>
    </AppTableRow>
  ));

export const BusinessTeamMembersTable = ({
  currentTimestampMs,
  isActionsDisabled,
  isBodyLoading,
  listStatus,
  onCancelInvitation,
  onCopyInviteUrl,
  onCreateInvitation,
  onDeactivateMember,
  onEditMember,
  onEditOwner,
  onReactivateMember,
  owner,
  pendingTeamMemberIds,
  teamMembers,
}: BusinessTeamMembersTableProperties) => {
  const t = useTranslations();
  const sortedTeamMembers = useMemo(
    () =>
      [...teamMembers].sort(
        (firstMember, secondMember) => {
          if (listStatus === "DEACTIVATED") {
            return (
              new Date(secondMember.deactivatedAt ?? 0).getTime() -
              new Date(firstMember.deactivatedAt ?? 0).getTime()
            );
          }

          const statusDifference =
            accessStatusOrder[firstMember.access.status] -
            accessStatusOrder[secondMember.access.status];

          if (statusDifference !== 0) {
            return statusDifference;
          }

          return (
            new Date(secondMember.createdAt).getTime() -
            new Date(firstMember.createdAt).getTime()
          );
        },
      ),
    [listStatus, teamMembers],
  );
  return (
    <section className="-mt-px min-h-0 min-w-0 flex-1">
      <AppTable
        className="table-fixed"
        containerClassName="flex h-full min-h-0 min-w-0 flex-col"
        minWidthClassName={teamTableMinWidthClassName}
        tableContainerClassName="min-h-0 min-w-0 flex-1 overflow-auto"
      >
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[24%]" />
          <col className="w-[8%]" />
          <col className="w-[6%]" />
          <col className="w-[8%]" />
          <col className="w-[9%]" />
          <col className="w-[16%]" />
          <col className="w-[9%]" />
        </colgroup>
        <AppTableHeader>
          <AppTableRow>
            <AppTableHead className={teamTableHeadClassName}>
              {t("managementEmployees.team.columns.employee")}
            </AppTableHead>
            <AppTableHead className={teamTableHeadClassName}>
              {t("managementEmployees.team.columns.email")}
            </AppTableHead>
            <AppTableHead className={teamTableHeadClassName}>
              {t("managementEmployees.team.columns.phoneNumber")}
            </AppTableHead>
            <AppTableHead className={teamTableHeadClassName}>
              {t("managementEmployees.team.columns.birthday")}
            </AppTableHead>
            <AppTableHead className={`text-center ${teamTableHeadClassName}`}>
              {t("managementEmployees.team.columns.role")}
            </AppTableHead>
            <AppTableHead className={`text-center ${teamTableHeadClassName}`}>
              {t("managementEmployees.team.columns.providesServices")}
            </AppTableHead>
            <AppTableHead className={`text-center ${teamTableHeadClassName}`}>
              {t("managementEmployees.team.columns.status")}
            </AppTableHead>
            <AppTableHead className={teamTableHeadClassName}>
              {t("managementEmployees.team.columns.actions")}
            </AppTableHead>
          </AppTableRow>
        </AppTableHeader>
        <AppTableBody>
          {isBodyLoading ? (
            <BusinessTeamMembersTableSkeletonRows
              loadingLabel={t("managementEmployees.team.loading")}
            />
          ) : (
            <>
              {listStatus === "ACTIVE" ? (
                <BusinessTeamOwnerRow
                  owner={owner}
                  isActionsDisabled={isActionsDisabled}
                  onEditOwner={onEditOwner}
                />
              ) : null}

              {sortedTeamMembers.length > 0 ? (
                sortedTeamMembers.map((member) => (
                  <BusinessTeamMemberRow
                    key={member.id}
                    currentTimestampMs={currentTimestampMs}
                    isActionsDisabled={isActionsDisabled}
                    isDeactivatePending={pendingTeamMemberIds.deactivate === member.id}
                    isDeactivatedView={listStatus === "DEACTIVATED"}
                    isInvitePending={pendingTeamMemberIds.invite === member.id}
                    isReactivatePending={pendingTeamMemberIds.reactivate === member.id}
                    member={member}
                    onAddEmail={() => onEditMember(member, "email")}
                    onCancelInvitation={() => onCancelInvitation(member)}
                    onCopyInviteUrl={() => {
                      if (member.access.status === "INVITED") {
                        onCopyInviteUrl(member.access.inviteUrl);
                      }
                    }}
                    onCreateInvitation={() => onCreateInvitation(member)}
                    onDeactivateMember={() => onDeactivateMember(member)}
                    onEditMember={() => onEditMember(member)}
                    onReactivateMember={() => onReactivateMember(member)}
                  />
                ))
              ) : (
                <AppTableEmptyState colSpan={8}>
                  {t(
                    listStatus === "ACTIVE"
                      ? "managementEmployees.team.empty"
                      : "managementEmployees.team.emptyInactive",
                  )}
                </AppTableEmptyState>
              )}
            </>
          )}
        </AppTableBody>
      </AppTable>
    </section>
  );
};

export type { BusinessTeamMembersTableProperties };
