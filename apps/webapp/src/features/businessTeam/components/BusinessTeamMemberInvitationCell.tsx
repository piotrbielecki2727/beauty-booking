"use client";

import { differenceInCalendarDays } from "date-fns";
import { CopyIcon, MailPlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { BusinessTeamMember } from "@beauty-booking/shared";

import { AppTableCell, Button, Tooltip } from "@/components/reusable";
import { cn } from "@/lib/utils";

import { getAccessBadgeClassNames } from "./businessTeamMembersTableHelpers";

type BusinessTeamMemberInvitationCellProperties = {
  access: BusinessTeamMember["access"];
  canInvite: boolean;
  currentTimestampMs: number | null;
  isActionDisabled: boolean;
  isDeactivatedView: boolean;
  isInvitePending: boolean;
  onAddEmail: () => void;
  onCancelInvitation: () => void;
  onCopyInviteUrl: () => void;
  onCreateInvitation: () => void;
};

const assertNever = (value: never): never => {
  throw new Error(`Unsupported business team access status: ${value}`);
};

const getInvitationAgeLabel = ({
  currentTimestampMs,
  sentAt,
  t,
}: {
  currentTimestampMs: number | null;
  sentAt: string | null;
  t: ReturnType<typeof useTranslations>;
}) => {
  if (!sentAt || currentTimestampMs === null) {
    return t("managementEmployees.team.statuses.INVITED");
  }

  const sentAtDate = new Date(sentAt);

  if (Number.isNaN(sentAtDate.getTime())) {
    return t("managementEmployees.team.statuses.INVITED");
  }

  const daysSinceSent = Math.max(
    0,
    differenceInCalendarDays(new Date(currentTimestampMs), sentAtDate),
  );

  if (daysSinceSent === 0) {
    return t("managementEmployees.team.statuses.INVITED_TODAY");
  }

  if (daysSinceSent === 1) {
    return t("managementEmployees.team.statuses.INVITED_YESTERDAY");
  }

  return t("managementEmployees.team.statuses.INVITED_DAYS_AGO", {
    count: daysSinceSent,
  });
};

const getInvitationStatusLabel = ({
  access,
  currentTimestampMs,
  t,
}: {
  access: BusinessTeamMember["access"];
  currentTimestampMs: number | null;
  t: ReturnType<typeof useTranslations>;
}) => {
  switch (access.status) {
    case "ACTIVE":
    case "EXPIRED":
    case "NO_ACCESS":
      return t(`managementEmployees.team.statuses.${access.status}`);
    case "INVITED":
      return getInvitationAgeLabel({
        currentTimestampMs,
        sentAt: access.sentAt,
        t,
      });
    default:
      return assertNever(access);
  }
};

export const BusinessTeamMemberInvitationCell = ({
  access,
  canInvite,
  currentTimestampMs,
  isActionDisabled,
  isDeactivatedView,
  isInvitePending,
  onAddEmail,
  onCancelInvitation,
  onCopyInviteUrl,
  onCreateInvitation,
}: BusinessTeamMemberInvitationCellProperties) => {
  const t = useTranslations();
  const invitationStatusLabel = getInvitationStatusLabel({
    access,
    currentTimestampMs,
    t,
  });
  const renderInvitationContent = () => {
    switch (access.status) {
      case "NO_ACCESS":
      case "EXPIRED":
        return (
          <Button
            className={cn(
              "min-w-[6.75rem] gap-1.5",
              canInvite
                ? "text-brand"
                : "border-[var(--status-success-border,var(--border))] bg-surface-raised text-success hover:bg-[var(--status-success-surface,var(--background))] hover:text-success",
            )}
            size="sm"
            type="button"
            variant="outline"
            isDisabled={isActionDisabled && !isInvitePending}
            isLoading={canInvite ? isInvitePending : false}
            loadingText={t("managementEmployees.team.invite")}
            onClick={canInvite ? onCreateInvitation : onAddEmail}
          >
            <MailPlusIcon className="size-4" aria-hidden="true" />
            {t(
              canInvite
                ? "managementEmployees.team.invite"
                : "managementEmployees.team.addEmail",
            )}
          </Button>
        );

      case "INVITED":
        return (
          <div className="flex items-center justify-center">
            <span
              className={cn(
                getAccessBadgeClassNames(access.status),
                "inline-flex h-8 min-w-max items-center overflow-hidden py-0 pr-0 pl-0",
              )}
            >
              <span className="flex h-full items-center px-3">
                {invitationStatusLabel}
              </span>
              <Tooltip content={t("managementEmployees.invitation.copy")}>
                <Button
                  aria-label={t("managementEmployees.invitation.copy")}
                  className="size-8 shrink-0 rounded-none border-0 border-l border-[var(--status-warning-border,var(--border))] bg-transparent p-0 text-warning hover:bg-[var(--status-warning-surface,var(--background))] hover:text-copy"
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                  isDisabled={isActionDisabled}
                  onClick={onCopyInviteUrl}
                >
                  <CopyIcon className="size-3.5" aria-hidden="true" />
                </Button>
              </Tooltip>
              <Tooltip content={t("managementEmployees.invitation.cancel")}>
                <Button
                  aria-label={t("managementEmployees.invitation.cancel")}
                  className="size-8 shrink-0 rounded-none border-0 border-l border-[var(--status-warning-border,var(--border))] bg-transparent p-0 text-warning hover:bg-[var(--status-warning-surface,var(--background))] hover:text-destructive"
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                  isDisabled={isActionDisabled}
                  onClick={onCancelInvitation}
                >
                  <XIcon className="size-3.5" aria-hidden="true" />
                </Button>
              </Tooltip>
            </span>
          </div>
        );

      case "ACTIVE":
        return (
          <span className={getAccessBadgeClassNames(access.status)}>
            {invitationStatusLabel}
          </span>
        );
      default:
        return assertNever(access);
    }
  };

  return (
    <AppTableCell className="text-center">
      {isDeactivatedView ? (
        <span className="text-sm text-copy-muted">
          {t("managementEmployees.team.notProvided")}
        </span>
      ) : (
        renderInvitationContent()
      )}
    </AppTableCell>
  );
};

export type { BusinessTeamMemberInvitationCellProperties };
