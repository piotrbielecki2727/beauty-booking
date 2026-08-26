import { Card, IconBadge, ScrollArea } from "@/components/reusable";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type SalonSettingsSectionProperties = {
  children: ReactNode;
  className?: string;
  description: ReactNode;
  footer?: ReactNode;
  icon: ReactNode;
  isContentScrollable?: boolean;
  title: ReactNode;
};

export const SalonSettingsSection = ({
  children,
  className,
  description,
  footer,
  icon,
  isContentScrollable = false,
  title,
}: SalonSettingsSectionProperties) => {
  const content = <div className="grid min-w-0 gap-5">{children}</div>;

  return (
    <Card
      className={cn(
        "@container/step rounded-xl bg-card shadow-sm",
        isContentScrollable &&
          "xl:h-[clamp(32rem,calc(100dvh-12rem),38rem)]",
        className,
      )}
      contentClassName={cn(
        "min-w-0",
        isContentScrollable && "xl:min-h-0 xl:flex-1 xl:overflow-hidden",
      )}
      description={description}
      footer={footer}
      footerClassName={cn(
        "justify-end border-t border-line",
        isContentScrollable && "xl:mt-auto xl:shrink-0",
      )}
      headerClassName={cn(isContentScrollable && "xl:shrink-0")}
      title={
        <span className="flex items-center gap-3">
          <IconBadge icon={icon} size="sm" />
          <span>{title}</span>
        </span>
      }
    >
      {isContentScrollable ? (
        <ScrollArea
          className="xl:h-full"
          contentClassName="pr-0 xl:pr-4"
        >
          {content}
        </ScrollArea>
      ) : (
        content
      )}
    </Card>
  );
};

export type { SalonSettingsSectionProperties };
