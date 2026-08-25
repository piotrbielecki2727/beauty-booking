"use client";

import {
  ArrowRightIcon,
  BellIcon,
  CalendarDaysIcon,
  InfoIcon,
  ScissorsIcon,
  Settings2Icon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button, Card, IconBadge } from "@/components/reusable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const welcomeFeatures = [
  { icon: CalendarDaysIcon, key: "calendar" },
  { icon: ScissorsIcon, key: "services" },
  { icon: UsersIcon, key: "team" },
  { icon: StoreIcon, key: "customerPage" },
  { icon: Settings2Icon, key: "organization" },
  { icon: BellIcon, key: "notifications" },
] as const;

type BusinessSetupWelcomeDialogProperties = {
  isOpen: boolean;
  isStarting: boolean;
  onStart: () => void;
};

export const BusinessSetupWelcomeDialog = ({
  isOpen,
  isStarting,
  onStart,
}: BusinessSetupWelcomeDialogProperties) => {
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={() => undefined}>
      <DialogContent
        className="max-h-[calc(100dvh-1.5rem)] grid-rows-[minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl border border-line bg-surface-raised p-0 shadow-[0_24px_70px_var(--brand-shadow)] sm:max-w-[56rem]"
        overlayVariant="strong"
        showCloseButton={false}
      >
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
          <DialogHeader className="items-center gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("businessSetup.welcome.eyebrow")}
            </p>
            <DialogTitle className="max-w-2xl font-brand text-3xl font-semibold leading-tight text-brand sm:text-4xl">
              {t("businessSetup.welcome.title")}
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-6 text-copy-muted sm:text-base sm:leading-7">
              {t("businessSetup.welcome.description")}
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {welcomeFeatures.map(({ icon: Icon, key }) => (
              <li key={key}>
                <Card
                  className="h-full rounded-xl bg-background py-0 shadow-none"
                  contentClassName="flex h-full items-start gap-3 p-4"
                >
                  <IconBadge icon={<Icon />} size="sm" />
                  <span className="grid min-w-0 gap-1">
                    <span className="font-brand text-base font-semibold text-copy">
                      {t(`businessSetup.welcome.features.${key}.title`)}
                    </span>
                    <span className="text-sm leading-5 text-copy-muted">
                      {t(`businessSetup.welcome.features.${key}.description`)}
                    </span>
                  </span>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-3 rounded-xl border border-line bg-surface-soft p-4">
            <IconBadge
              icon={<InfoIcon />}
              size="sm"
              variant="neutral"
            />
            <p className="self-center whitespace-pre-line text-sm leading-6 text-copy-muted">
              {t("businessSetup.welcome.callout")}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-line bg-surface-raised px-5 py-4 sm:px-8 sm:py-5">
          <Button
            className="min-h-11 w-full sm:w-80"
            isLoading={isStarting}
            loadingText={t("businessSetup.welcome.starting")}
            onClick={onStart}
            type="button"
          >
            {t("businessSetup.welcome.start")}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export type { BusinessSetupWelcomeDialogProperties };
