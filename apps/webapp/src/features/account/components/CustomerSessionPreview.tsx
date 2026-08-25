"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export const CustomerSessionPreview = () => {
  const { data: session, status } = useSession();
  const t = useTranslations();

  if (status === "loading") {
    return (
      <p className="text-sm text-muted-foreground">
        {t("customerHome.session.loading")}
      </p>
    );
  }

  if (!session?.user) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("customerHome.session.notLoggedIn")}
      </p>
    );
  }

  return (
    <div className="grid gap-2 rounded-xl border border-border bg-card p-5 text-card-foreground">
      <p className="text-sm text-muted-foreground">
        {t("customerHome.session.email")}
      </p>
      <p className="font-medium">{session.user.email}</p>

      <p className="mt-2 text-sm text-muted-foreground">
        {t("customerHome.session.userId")}
      </p>
      <p className="break-all font-mono text-sm">{session.user.id}</p>
    </div>
  );
};
