"use client";

import { useTranslations } from "next-intl";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { BusinessTeamMemberListStatus } from "@beauty-booking/shared";

type BusinessTeamMembersStatusTabsProperties = {
  activeCount: number | null;
  deactivatedCount: number | null;
  isDisabled?: boolean;
  onValueChange: (status: BusinessTeamMemberListStatus) => void;
  value: BusinessTeamMemberListStatus;
};

const statusTabs: readonly {
  countKey: "activeCount" | "deactivatedCount";
  labelKey: string;
  value: BusinessTeamMemberListStatus;
}[] = [
  {
    countKey: "activeCount",
    labelKey: "managementEmployees.team.activeTitle",
    value: "ACTIVE",
  },
  {
    countKey: "deactivatedCount",
    labelKey: "managementEmployees.team.inactiveTitle",
    value: "DEACTIVATED",
  },
];

export const BusinessTeamMembersStatusTabs = ({
  activeCount,
  deactivatedCount,
  isDisabled = false,
  onValueChange,
  value,
}: BusinessTeamMembersStatusTabsProperties) => {
  const t = useTranslations();
  const counts = {
    activeCount,
    deactivatedCount,
  };

  return (
    <Tabs
      className="shrink-0 gap-0"
      value={value}
      onValueChange={(nextValue) =>
        onValueChange(nextValue as BusinessTeamMemberListStatus)
      }
    >
      <div className="min-w-0 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList
          aria-label={t("managementEmployees.team.tabsLabel")}
          className="-mb-px grid w-full min-w-[20rem] max-w-[32rem] grid-cols-2 gap-0 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-12"
        >
          {statusTabs.map(({ countKey, labelKey, value: tabValue }, index) => {
            const count = counts[countKey];

            return (
              <TabsTrigger
                key={tabValue}
                className={cn(
                  "relative h-12 rounded-t-lg rounded-b-none border border-line bg-[var(--table-header-surface,var(--surface))] px-4 font-brand text-base font-medium text-copy-muted shadow-xs hover:bg-surface hover:text-copy-muted data-active:z-10 data-active:border-line-strong data-active:bg-surface-raised data-active:font-semibold data-active:text-brand data-active:shadow-sm data-active:hover:bg-surface-raised data-active:hover:text-brand",
                  "after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.75 after:rounded-t-full after:bg-transparent group-data-horizontal/tabs:after:bottom-[-1px] group-data-horizontal/tabs:after:h-0.75 data-active:after:bg-brand data-active:after:opacity-100",
                  index > 0 && "-ml-px",
                )}
                disabled={isDisabled}
                value={tabValue}
              >
                <span>{t(labelKey)}</span>
                <span className="min-w-[3ch] text-left">
                  {count === null ? "" : `(${count})`}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </Tabs>
  );
};

export type { BusinessTeamMembersStatusTabsProperties };
