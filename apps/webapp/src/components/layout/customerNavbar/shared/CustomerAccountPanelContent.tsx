"use client";

import {
  ArrowRightIcon,
  CalendarDaysIcon,
  Globe2Icon,
  HistoryIcon,
  LogOutIcon,
  PaletteIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useCustomerAccountMenu } from "@/components/layout/customerNavbar/shared/useCustomerAccountMenu";
import { Button, LoadingOverlay } from "@/components/reusable";
import { Link } from "@/i18n/navigation";

type CustomerAccountPanelContentProperties = {
  onNavigate?: () => void;
};

const accountMenuLinkClassName =
  "group flex h-10 items-center gap-3 rounded-md text-sm text-brand transition-colors hover:text-brand";

const accountMenuUnderlineClassName =
  "absolute -bottom-1 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-50";

export const CustomerAccountPanelContent = ({
  onNavigate,
}: CustomerAccountPanelContentProperties) => {
  const t = useTranslations();
  const {
    fullName,
    handleLogout,
    isLoggingOut,
    upcomingVisit,
    user,
  } = useCustomerAccountMenu();

  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <p className="font-medium">{fullName}</p>
          {user?.email ? (
            <p className="truncate text-sm text-copy-muted">
              {user.email}
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border border-line bg-surface-soft p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-brand">
            {t("accountMenu.upcomingVisit")}
          </p>
          <p className="mt-3 font-medium">{upcomingVisit.title}</p>
          <p className="mt-1 text-sm text-copy-muted">
            {upcomingVisit.date}
          </p>
          <Link
            href="/bookings"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            onClick={onNavigate}
          >
            {t("accountMenu.viewDetails")}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <nav
          className="grid gap-1 text-brand"
          aria-label={t("accountMenu.label")}
        >
          <Link
            href="/bookings"
            className={accountMenuLinkClassName}
            onClick={onNavigate}
          >
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            <span className="relative">
              {t("accountMenu.myVisits")}
              <span
                aria-hidden="true"
                className={accountMenuUnderlineClassName}
              />
            </span>
          </Link>
          <Link
            href="/bookings"
            className={accountMenuLinkClassName}
            onClick={onNavigate}
          >
            <HistoryIcon className="size-4" aria-hidden="true" />
            <span className="relative">
              {t("accountMenu.visitHistory")}
              <span
                aria-hidden="true"
                className={accountMenuUnderlineClassName}
              />
            </span>
          </Link>
          <Link
            href="/profile"
            className={accountMenuLinkClassName}
            onClick={onNavigate}
          >
            <UserRoundIcon className="size-4" aria-hidden="true" />
            <span className="relative">
              {t("accountMenu.myData")}
              <span
                aria-hidden="true"
                className={accountMenuUnderlineClassName}
              />
            </span>
          </Link>
        </nav>

        <div className="h-px bg-line" />

        <div className="grid gap-3 text-brand">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-sm">
              <Globe2Icon className="size-4" aria-hidden="true" />
              {t("accountMenu.language")}
            </span>
            <LanguageSwitcher variant="nav" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-sm">
              <PaletteIcon className="size-4" aria-hidden="true" />
              {t("accountMenu.theme")}
            </span>
            <ThemeToggle variant="nav" />
          </div>
        </div>

        <div className="h-px bg-line" />

        <Button
          type="button"
          className="h-10 justify-start gap-3 rounded-md px-3 text-left text-sm text-brand hover:bg-brand hover:text-copy-inverse"
          isDisabled={isLoggingOut}
          onClick={handleLogout}
          variant="ghost"
        >
          <LogOutIcon className="size-4" aria-hidden="true" />
          {t("accountMenu.logout")}
        </Button>
      </div>

      <LoadingOverlay isOpen={isLoggingOut} variant="bare" />
    </>
  );
};

export type { CustomerAccountPanelContentProperties };
