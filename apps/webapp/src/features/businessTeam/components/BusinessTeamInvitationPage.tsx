"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  HomeIcon,
  LogInIcon,
  MailWarningIcon,
  RefreshCwIcon,
  UserRoundCheckIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { Button, Card, IconBadge, LoadingOverlay } from "@/components/reusable";
import { endAccountSession } from "@/features/account/lib";
import {
  acceptBusinessTeamInvitation,
  businessTeamInvitationPreviewQueryOptions,
  businessTeamMutationKeys,
  businessTeamMutationScope,
} from "@/features/businessTeam/api";
import { getBusinessTeamErrorMessageKey } from "@/features/businessTeam/lib/businessTeamErrorMessages";
import { Link, useRouter } from "@/i18n/navigation";

import { BusinessTeamInvitationDetails } from "./BusinessTeamInvitationDetails";

import type { BusinessTeamInvitationPreview } from "@beauty-booking/shared";
import type { ReactNode } from "react";

type BusinessTeamInvitationPageProperties = {
  token: string;
};

type InvitationStateContent = {
  description: string;
  icon: ReactNode;
  title: string;
};

const normalizeEmail = (email: string | null | undefined) =>
  email?.trim().toLowerCase() ?? "";

const getLoginHref = (token: string) =>
  `/login?next=${encodeURIComponent(`/team-invitations/${token}`)}`;

const getRegisterHref = (token: string) =>
  `/register?next=${encodeURIComponent(`/team-invitations/${token}`)}`;

const assertNever = (value: never): never => {
  throw new Error(`Unsupported business team invitation status: ${value}`);
};

const getStatusContent = ({
  status,
  t,
}: {
  status: BusinessTeamInvitationPreview["status"];
  t: ReturnType<typeof useTranslations>;
}): InvitationStateContent => {
  switch (status) {
    case "ACCEPTED":
      return {
        description: t("businessTeamInvitation.states.accepted.description"),
        icon: <CheckCircle2Icon aria-hidden="true" />,
        title: t("businessTeamInvitation.states.accepted.title"),
      };
    case "CANCELLED":
      return {
        description: t("businessTeamInvitation.states.cancelled.description"),
        icon: <XCircleIcon aria-hidden="true" />,
        title: t("businessTeamInvitation.states.cancelled.title"),
      };
    case "EXPIRED":
      return {
        description: t("businessTeamInvitation.states.expired.description"),
        icon: <AlertTriangleIcon aria-hidden="true" />,
        title: t("businessTeamInvitation.states.expired.title"),
      };
    case "PENDING":
      return {
        description: t("businessTeamInvitation.states.pending.description"),
        icon: <UserRoundCheckIcon aria-hidden="true" />,
        title: t("businessTeamInvitation.states.pending.title"),
      };
    default:
      return assertNever(status);
  }
};

export const BusinessTeamInvitationPage = ({
  token,
}: BusinessTeamInvitationPageProperties) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();
  const { data: session, status, update } = useSession();
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const invitationQuery = useQuery(
    businessTeamInvitationPreviewQueryOptions(token),
  );
  const invitation = invitationQuery.data ?? null;
  const isSessionLoading = status === "loading";
  const accessToken = session?.accessToken;
  const accountEmail = normalizeEmail(session?.user.email);
  const invitationEmail = normalizeEmail(invitation?.email);
  const isPendingInvitation = invitation?.status === "PENDING";
  const isAuthenticated = status === "authenticated" && Boolean(accessToken);
  const isEmailMismatch =
    isPendingInvitation &&
    isAuthenticated &&
    Boolean(accountEmail) &&
    accountEmail !== invitationEmail;
  const stateContent = useMemo(
    () =>
      invitation
        ? getStatusContent({ status: invitation.status, t })
        : {
            description: t("businessTeamInvitation.states.unavailable.description"),
            icon: <AlertTriangleIcon aria-hidden="true" />,
            title: t("businessTeamInvitation.states.unavailable.title"),
          },
    [invitation, t],
  );
  const getBusinessTeamErrorMessage = (
    error: unknown,
    fallbackKey: Parameters<typeof getBusinessTeamErrorMessageKey>[1],
  ) => t(getBusinessTeamErrorMessageKey(error, fallbackKey));

  const acceptInvitationMutation = useMutation({
    mutationFn: ({
      accessToken,
      token,
    }: {
      accessToken: string;
      token: string;
    }) =>
      acceptBusinessTeamInvitation({
        accessToken,
        token,
      }),
    mutationKey: businessTeamMutationKeys.acceptInvitation(),
    onSuccess: async (result) => {
      await update({
        user: {
          role: result.role,
        },
      });
      router.replace("/management");
      router.refresh();
    },
    scope: businessTeamMutationScope,
  });
  const loadError = invitationQuery.isError
    ? getBusinessTeamErrorMessage(
        invitationQuery.error,
        "businessTeamInvitation.feedback.loadFailed",
      )
    : null;
  const acceptError = acceptInvitationMutation.isError
    ? getBusinessTeamErrorMessage(
        acceptInvitationMutation.error,
        "businessTeamInvitation.feedback.acceptFailed",
      )
    : null;
  const isAccepting = acceptInvitationMutation.isPending;

  const handleAcceptInvitation = () => {
    if (
      !accessToken ||
      !invitation ||
      !isPendingInvitation ||
      !isAuthenticated ||
      isEmailMismatch ||
      isAccepting
    ) {
      return;
    }

    acceptInvitationMutation.mutate({
      accessToken,
      token,
    });
  };

  const handleSwitchAccount = async () => {
    setIsSwitchingAccount(true);
    await endAccountSession(`/${locale}${getLoginHref(token)}`);
  };

  if (invitationQuery.isPending) {
    return (
      <div className="relative min-h-80 w-full max-w-2xl">
        <LoadingOverlay scope="container" variant="bare" />
      </div>
    );
  }

  return (
    <Card
      className="w-full max-w-2xl bg-card/90 shadow-lg shadow-brand-shadow backdrop-blur-sm"
      contentClassName="grid gap-6"
    >
      <header className="grid justify-items-center gap-4 text-center">
        <IconBadge icon={stateContent.icon} size="lg" />
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase text-brand">
            {t("businessTeamInvitation.eyebrow")}
          </p>
          <h1 className="font-brand text-3xl font-semibold leading-tight text-brand sm:text-4xl">
            {stateContent.title}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-6 text-copy-muted sm:text-base">
            {loadError ?? stateContent.description}
          </p>
        </div>
      </header>

      {invitation ? (
        <BusinessTeamInvitationDetails invitation={invitation} />
      ) : null}

      {isPendingInvitation && !isSessionLoading && !isAuthenticated ? (
        <div className="grid gap-3 rounded-lg border border-line bg-surface p-4">
          <p className="text-sm leading-6 text-copy-muted">
            {t("businessTeamInvitation.actions.loginHint")}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button isFullWidth render={<Link href={getLoginHref(token)} />}>
              <LogInIcon className="size-4" aria-hidden="true" />
              {t("businessTeamInvitation.actions.login")}
            </Button>
            <Button
              isFullWidth
              render={<Link href={getRegisterHref(token)} />}
              variant="outline"
            >
              <ArrowRightIcon className="size-4" aria-hidden="true" />
              {t("businessTeamInvitation.actions.register")}
            </Button>
          </div>
        </div>
      ) : null}

      {isPendingInvitation && isSessionLoading ? (
        <div className="relative min-h-24 rounded-lg border border-line bg-surface">
          <LoadingOverlay scope="container" variant="bare" />
        </div>
      ) : null}

      {isEmailMismatch ? (
        <div className="grid gap-3 rounded-lg border border-line bg-surface p-4">
          <div className="flex gap-3">
            <MailWarningIcon
              className="mt-0.5 size-5 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div className="grid gap-1">
              <p className="font-medium text-copy">
                {t("businessTeamInvitation.mismatch.title")}
              </p>
              <p className="text-sm leading-6 text-copy-muted">
                {t("businessTeamInvitation.mismatch.description", {
                  accountEmail: session?.user.email ?? "",
                  invitationEmail: invitation?.email ?? "",
                })}
              </p>
            </div>
          </div>
          <Button
            isFullWidth
            isLoading={isSwitchingAccount}
            loadingText={t("businessTeamInvitation.actions.signingOut")}
            onClick={handleSwitchAccount}
            type="button"
            variant="outline"
          >
            <RefreshCwIcon className="size-4" aria-hidden="true" />
            {t("businessTeamInvitation.actions.switchAccount")}
          </Button>
        </div>
      ) : null}

      {isPendingInvitation &&
      isAuthenticated &&
      !isEmailMismatch &&
      !isSessionLoading ? (
        <div className="grid gap-3">
          {acceptError ? (
            <p className="rounded-lg border border-[var(--destructive-border,var(--border))] bg-[var(--destructive-surface,var(--background))] p-3 text-sm text-destructive">
              {acceptError}
            </p>
          ) : null}
          <Button
            isFullWidth
            isLoading={isAccepting}
            loadingText={t("businessTeamInvitation.actions.accepting")}
            onClick={handleAcceptInvitation}
            size="lg"
            type="button"
          >
            <CheckCircle2Icon className="size-4" aria-hidden="true" />
            {t("businessTeamInvitation.actions.accept")}
          </Button>
        </div>
      ) : null}

      {!isPendingInvitation || loadError ? (
        <Button isFullWidth render={<Link href="/" />} variant="outline">
          <HomeIcon className="size-4" aria-hidden="true" />
          {t("businessTeamInvitation.actions.home")}
        </Button>
      ) : null}
    </Card>
  );
};

export type { BusinessTeamInvitationPageProperties };
