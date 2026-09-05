"use client";

import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarClockIcon,
  MailIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { BusinessTeamInvitationPreview } from "@beauty-booking/shared";
import type { ReactNode } from "react";

type BusinessTeamInvitationDetailsProperties = {
  invitation: BusinessTeamInvitationPreview;
};

type InvitationDetailItemProperties = {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
};

const formatExpirationDate = (value: string, locale: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const InvitationDetailItem = ({
  icon,
  label,
  value,
}: InvitationDetailItemProperties) => (
  <div className="flex min-w-0 gap-3 rounded-lg border border-line bg-surface-soft p-3">
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand [&_svg]:size-4">
      {icon}
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase text-copy-muted">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium text-copy">{value}</dd>
    </div>
  </div>
);

export const BusinessTeamInvitationDetails = ({
  invitation,
}: BusinessTeamInvitationDetailsProperties) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <dl className={cn("grid gap-3 sm:grid-cols-2")}>
      <InvitationDetailItem
        icon={<Building2Icon aria-hidden="true" />}
        label={t("businessTeamInvitation.details.businessName")}
        value={invitation.businessName}
      />
      <InvitationDetailItem
        icon={<UserRoundIcon aria-hidden="true" />}
        label={t("businessTeamInvitation.details.fullName")}
        value={invitation.fullName}
      />
      <InvitationDetailItem
        icon={<MailIcon aria-hidden="true" />}
        label={t("businessTeamInvitation.details.email")}
        value={invitation.email}
      />
      <InvitationDetailItem
        icon={<BriefcaseBusinessIcon aria-hidden="true" />}
        label={t("businessTeamInvitation.details.role")}
        value={t(`businessSetup.team.roles.${invitation.role}`)}
      />
      <InvitationDetailItem
        icon={<CalendarClockIcon aria-hidden="true" />}
        label={t("businessTeamInvitation.details.expiresAt")}
        value={formatExpirationDate(invitation.expiresAt, locale)}
      />
      <InvitationDetailItem
        icon={<ShieldCheckIcon aria-hidden="true" />}
        label={t("businessTeamInvitation.details.status")}
        value={t(`businessTeamInvitation.statuses.${invitation.status}`)}
      />
    </dl>
  );
};

export type { BusinessTeamInvitationDetailsProperties };
