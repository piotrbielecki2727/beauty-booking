"use client";

import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AppTableActions,
  AppTableCell,
  AppTableRow,
  BooleanStatusBadge,
  Button,
  Tooltip,
  TruncatedTextTooltip,
} from "@/components/reusable";

import {
  getBirthdayLabel,
  getRoleBadgeClassNames,
} from "./businessTeamMembersTableHelpers";
import { TeamMemberAvatar } from "./TeamMemberAvatar";

import type { BusinessTeamOwner } from "@beauty-booking/shared";

type BusinessTeamOwnerRowProperties = {
  isActionsDisabled: boolean;
  onEditOwner: () => void;
  owner: BusinessTeamOwner;
};

export const BusinessTeamOwnerRow = ({
  isActionsDisabled,
  onEditOwner,
  owner,
}: BusinessTeamOwnerRowProperties) => {
  const t = useTranslations();

  return (
    <AppTableRow>
      <AppTableCell>
        <div className="flex min-w-0 items-center gap-3">
          <TeamMemberAvatar className="bg-surface" imageSrc="/womanExample.png" />
          <TruncatedTextTooltip className="text-sm font-medium text-copy">
            {owner.fullName}
          </TruncatedTextTooltip>
        </div>
      </AppTableCell>

      <AppTableCell className="text-sm text-copy-muted">
        <TruncatedTextTooltip>{owner.email}</TruncatedTextTooltip>
      </AppTableCell>

      <AppTableCell className="text-sm text-copy-muted">
        <TruncatedTextTooltip>
          {owner.phoneNumber || t("managementEmployees.team.notProvided")}
        </TruncatedTextTooltip>
      </AppTableCell>

      <AppTableCell className="text-sm text-copy-muted">
        <TruncatedTextTooltip>
          {getBirthdayLabel(owner.birthdayMonth, owner.birthdayDay)}
        </TruncatedTextTooltip>
      </AppTableCell>

      <AppTableCell className="text-center">
        <span className={getRoleBadgeClassNames("Owner")}>
          {t("businessSetup.team.roles.Owner")}
        </span>
      </AppTableCell>

      <AppTableCell className="text-center">
        <BooleanStatusBadge
          falseLabel={t("managementEmployees.team.no")}
          trueLabel={t("managementEmployees.team.yes")}
          value={owner.providesServices}
        />
      </AppTableCell>

      <AppTableCell className="text-center">
        <span className="text-sm text-copy-muted">-</span>
      </AppTableCell>

      <AppTableCell>
        <AppTableActions className="flex-nowrap justify-start">
          <Tooltip content={t("managementEmployees.team.edit")}>
            <Button
              aria-label={t("managementEmployees.team.edit")}
              size="icon-sm"
              type="button"
              variant="outline"
              className="text-brand"
              isDisabled={isActionsDisabled}
              onClick={onEditOwner}
            >
              <PencilIcon className="size-4" aria-hidden="true" />
            </Button>
          </Tooltip>
        </AppTableActions>
      </AppTableCell>
    </AppTableRow>
  );
};

export type { BusinessTeamOwnerRowProperties };
