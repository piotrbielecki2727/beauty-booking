"use client";

import {
  PencilIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AppTableActions,
  AppTableCell,
  Button,
  Tooltip,
} from "@/components/reusable";

type BusinessTeamMemberActionsCellProperties = {
  isActionsDisabled: boolean;
  isDeactivatePending: boolean;
  isReactivatePending: boolean;
  isDeactivatedView: boolean;
  onDeactivate: () => void;
  onEdit: () => void;
  onReactivate: () => void;
};

export const BusinessTeamMemberActionsCell = ({
  isActionsDisabled,
  isDeactivatePending,
  isReactivatePending,
  isDeactivatedView,
  onDeactivate,
  onEdit,
  onReactivate,
}: BusinessTeamMemberActionsCellProperties) => {
  const t = useTranslations();

  return (
    <AppTableCell>
      <AppTableActions className="flex-nowrap justify-start">
        {isDeactivatedView ? (
          <Tooltip content={t("managementEmployees.team.activate")}>
            <Button
              aria-label={t("managementEmployees.team.activate")}
              size="icon-sm"
              type="button"
              variant="outline"
              className="text-brand"
              isDisabled={isActionsDisabled && !isReactivatePending}
              isLoading={isReactivatePending}
              loadingText=""
              onClick={onReactivate}
            >
              <UserCheckIcon className="size-4" aria-hidden="true" />
            </Button>
          </Tooltip>
        ) : (
          <>
            <Tooltip content={t("managementEmployees.team.edit")}>
              <Button
                aria-label={t("managementEmployees.team.edit")}
                size="icon-sm"
                type="button"
                variant="outline"
                className="text-brand"
                isDisabled={isActionsDisabled}
                onClick={onEdit}
              >
                <PencilIcon className="size-4" aria-hidden="true" />
              </Button>
            </Tooltip>

            <Tooltip content={t("managementEmployees.team.deactivate")}>
              <Button
                aria-label={t("managementEmployees.team.deactivate")}
                size="icon-sm"
                type="button"
                variant="destructive"
                isDisabled={isActionsDisabled && !isDeactivatePending}
                isLoading={isDeactivatePending}
                loadingText=""
                onClick={onDeactivate}
              >
                <UserXIcon className="size-4" aria-hidden="true" />
              </Button>
            </Tooltip>
          </>
        )}
      </AppTableActions>
    </AppTableCell>
  );
};

export type { BusinessTeamMemberActionsCellProperties };
