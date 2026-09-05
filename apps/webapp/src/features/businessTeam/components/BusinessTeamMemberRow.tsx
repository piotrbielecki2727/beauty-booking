"use client";

import { useTranslations } from "next-intl";

import { type BusinessTeamMember } from "@beauty-booking/shared";

import {
  AppTableCell,
  AppTableRow,
  BooleanStatusBadge,
  TruncatedTextTooltip,
} from "@/components/reusable";

import {
  getBirthdayLabel,
  getRoleBadgeClassNames,
  getTemporaryTeamMemberImageSrc,
} from "./businessTeamMembersTableHelpers";
import { BusinessTeamMemberActionsCell } from "./BusinessTeamMemberActionsCell";
import { BusinessTeamMemberInvitationCell } from "./BusinessTeamMemberInvitationCell";
import { TeamMemberAvatar } from "./TeamMemberAvatar";

type BusinessTeamMemberRowProperties = {
  currentTimestampMs: number | null;
  isActionsDisabled: boolean;
  isDeactivatePending: boolean;
  isDeactivatedView: boolean;
  isInvitePending: boolean;
  isReactivatePending: boolean;
  member: BusinessTeamMember;
  onAddEmail: () => void;
  onCancelInvitation: () => void;
  onCopyInviteUrl: () => void;
  onCreateInvitation: () => void;
  onDeactivateMember: () => void;
  onEditMember: () => void;
  onReactivateMember: () => void;
};

export const BusinessTeamMemberRow = ({
  currentTimestampMs,
  isActionsDisabled,
  isDeactivatePending,
  isDeactivatedView,
  isInvitePending,
  isReactivatePending,
  member,
  onAddEmail,
  onCancelInvitation,
  onCopyInviteUrl,
  onCreateInvitation,
  onDeactivateMember,
  onEditMember,
  onReactivateMember,
}: BusinessTeamMemberRowProperties) => {
  const t = useTranslations();

  return (
    <AppTableRow>
      <AppTableCell>
        <div className="flex min-w-0 items-center gap-3">
          <TeamMemberAvatar imageSrc={getTemporaryTeamMemberImageSrc(member.id)} />
          <TruncatedTextTooltip className="text-sm font-medium text-copy">
            {member.fullName}
          </TruncatedTextTooltip>
        </div>
      </AppTableCell>

      <AppTableCell className="text-sm text-copy-muted">
        <TruncatedTextTooltip>
          {member.email || t("managementEmployees.team.noEmail")}
        </TruncatedTextTooltip>
      </AppTableCell>

      <AppTableCell className="text-sm text-copy-muted">
        <TruncatedTextTooltip>
          {member.phoneNumber || t("managementEmployees.team.notProvided")}
        </TruncatedTextTooltip>
      </AppTableCell>

      <AppTableCell className="text-sm text-copy-muted">
        <TruncatedTextTooltip>
          {getBirthdayLabel(member.birthdayMonth, member.birthdayDay)}
        </TruncatedTextTooltip>
      </AppTableCell>

      <AppTableCell className="text-center">
        <span className={getRoleBadgeClassNames(member.role)}>
          {t(`businessSetup.team.roles.${member.role}`)}
        </span>
      </AppTableCell>

      <AppTableCell className="text-center">
        <BooleanStatusBadge
          falseLabel={t("managementEmployees.team.no")}
          trueLabel={t("managementEmployees.team.yes")}
          value={member.providesServices}
        />
      </AppTableCell>

      <BusinessTeamMemberInvitationCell
        access={member.access}
        canInvite={Boolean(member.email)}
        currentTimestampMs={currentTimestampMs}
        isActionDisabled={isActionsDisabled}
        isDeactivatedView={isDeactivatedView}
        isInvitePending={isInvitePending}
        onAddEmail={onAddEmail}
        onCancelInvitation={onCancelInvitation}
        onCopyInviteUrl={onCopyInviteUrl}
        onCreateInvitation={onCreateInvitation}
      />

      <BusinessTeamMemberActionsCell
        isActionsDisabled={isActionsDisabled}
        isDeactivatePending={isDeactivatePending}
        isDeactivatedView={isDeactivatedView}
        isReactivatePending={isReactivatePending}
        onDeactivate={onDeactivateMember}
        onEdit={onEditMember}
        onReactivate={onReactivateMember}
      />
    </AppTableRow>
  );
};

export type { BusinessTeamMemberRowProperties };
