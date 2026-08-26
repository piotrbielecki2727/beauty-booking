"use client";

import {
  ArchiveIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/reusable";

import type { ComponentType } from "react";
import type { BusinessType } from "@beauty-booking/shared";
import type { LucideProps } from "lucide-react";

type BusinessTypeChangeDialogProperties = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  pendingBusinessType: BusinessType | null;
};

type TransitionItem = {
  descriptionKey: string;
  icon: ComponentType<LucideProps>;
  titleKey: string;
};

const businessTypeTransitionConfig = {
  SOLO: [
    {
      descriptionKey:
        "managementSettings.salon.businessType.transitions.SOLO.items.independent.description",
      icon: UserIcon,
      titleKey:
        "managementSettings.salon.businessType.transitions.SOLO.items.independent.title",
    },
    {
      descriptionKey:
        "managementSettings.salon.businessType.transitions.SOLO.items.employees.description",
      icon: EyeOffIcon,
      titleKey:
        "managementSettings.salon.businessType.transitions.SOLO.items.employees.title",
    },
    {
      descriptionKey:
        "managementSettings.salon.businessType.transitions.SOLO.items.data.description",
      icon: ArchiveIcon,
      titleKey:
        "managementSettings.salon.businessType.transitions.SOLO.items.data.title",
    },
  ],
  TEAM: [
    {
      descriptionKey:
        "managementSettings.salon.businessType.transitions.TEAM.items.employees.description",
      icon: UsersIcon,
      titleKey:
        "managementSettings.salon.businessType.transitions.TEAM.items.employees.title",
    },
    {
      descriptionKey:
        "managementSettings.salon.businessType.transitions.TEAM.items.roles.description",
      icon: UserCheckIcon,
      titleKey:
        "managementSettings.salon.businessType.transitions.TEAM.items.roles.title",
    },
    {
      descriptionKey:
        "managementSettings.salon.businessType.transitions.TEAM.items.data.description",
      icon: ShieldCheckIcon,
      titleKey:
        "managementSettings.salon.businessType.transitions.TEAM.items.data.title",
    },
  ],
} as const satisfies Record<BusinessType, readonly TransitionItem[]>;

export const BusinessTypeChangeDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  pendingBusinessType,
}: BusinessTypeChangeDialogProperties) => {
  const t = useTranslations();
  const transitionItems = pendingBusinessType
    ? businessTypeTransitionConfig[pendingBusinessType]
    : [];
  const transitionKey = pendingBusinessType
    ? `managementSettings.salon.businessType.transitions.${pendingBusinessType}`
    : null;

  return (
    <ConfirmationDialog
      cancelLabel={t("managementSettings.salon.businessType.cancel")}
      confirmLabel={transitionKey ? t(`${transitionKey}.action`) : undefined}
      contentClassName="sm:max-w-lg"
      description={
        <span className="grid gap-5">
          <span>{transitionKey ? t(`${transitionKey}.description`) : null}</span>
          <span className="grid border-t border-line pt-2" role="list">
            {transitionItems.map(({ descriptionKey, icon: Icon, titleKey }) => (
              <span
                key={titleKey}
                className="flex gap-3 border-b border-line py-3 last:border-b-0"
                role="listitem"
              >
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span className="grid gap-0.5">
                  <span className="font-semibold text-copy">{t(titleKey)}</span>
                  <span className="leading-5 text-copy-muted">
                    {t(descriptionKey)}
                  </span>
                </span>
              </span>
            ))}
          </span>
        </span>
      }
      footerClassName="-mx-6 -mb-6 border-t border-line px-6 pb-6 pt-4"
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={() => void onConfirm()}
      title={transitionKey ? t(`${transitionKey}.title`) : ""}
    />
  );
};

export type { BusinessTypeChangeDialogProperties };
