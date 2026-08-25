"use client";

import {
  BanIcon,
  CheckCircleIcon,
  CopyIcon,
  Loader2Icon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button, Input } from "@/components/reusable";
import {
  acceptBusinessTeamInvitation,
  cancelBusinessTeamInvitation,
  createBusinessTeamInvitation,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
} from "@/features/businessTeam/api";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

import type {
  BusinessTeamInvitationPreview,
  BusinessTeamMember,
  BusinessTeamResponse,
} from "@beauty-booking/shared";

type GeneratedInvitation = {
  inviteUrl: string;
  preview?: BusinessTeamInvitationPreview;
  teamMemberId: string;
  token: string;
};

const getAccessBadgeClassNames = (status: BusinessTeamMember["access"]["status"]) =>
  cn(
    "inline-flex h-8 w-fit items-center rounded-md border px-3 text-xs font-medium",
    status === "ACTIVE" &&
      "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success",
    status === "INVITED" &&
      "border-[var(--status-warning-border,var(--border))] bg-[var(--status-warning-surface,var(--background))] text-warning",
    status === "NO_ACCESS" && "border-line bg-surface text-copy-muted",
  );

export const BusinessTeamInvitationTestPanel = () => {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [teamMembers, setTeamMembers] = useState<BusinessTeamMember[]>([]);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});
  const [generatedInvitation, setGeneratedInvitation] =
    useState<GeneratedInvitation | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const accessToken = session?.accessToken;
  const isSessionLoading = status === "loading";

  const updateTeam = useCallback((response: BusinessTeamResponse) => {
    setTeamMembers(response.teamMembers);
    setEmailDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };

      response.teamMembers.forEach((member) => {
        if (member.email) {
          delete nextDrafts[member.id];
        }
      });

      return nextDrafts;
    });
  }, []);

  const loadTeam = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      updateTeam(await getBusinessTeam(accessToken));
    } catch (error: unknown) {
      appToast.error({
        title:
          error instanceof Error
            ? error.message
            : t("managementEmployees.teamAccess.loadFailed"),
      });
    }
  }, [accessToken, t, updateTeam]);

  useEffect(() => {
    if (isSessionLoading) {
      return;
    }

    if (!accessToken) {
      return;
    }

    void getBusinessTeam(accessToken)
      .then(updateTeam)
      .catch((error: unknown) => {
        appToast.error({
          title:
            error instanceof Error
              ? error.message
              : t("managementEmployees.teamAccess.loadFailed"),
        });
      });
  }, [accessToken, isSessionLoading, t, updateTeam]);

  const handleCreateInvitation = async (member: BusinessTeamMember) => {
    if (!accessToken) {
      return;
    }

    setPendingActionId(member.id);

    try {
      const result = await createBusinessTeamInvitation({
        accessToken,
        email: emailDrafts[member.id],
        teamMemberId: member.id,
      });

      updateTeam({
        teamMembers: result.teamMembers,
      });
      setGeneratedInvitation({
        inviteUrl: result.invitation.inviteUrl,
        teamMemberId: member.id,
        token: result.invitation.token,
      });
      appToast.success({
        title: t("managementEmployees.teamAccess.inviteCreated"),
      });
    } catch (error: unknown) {
      appToast.error({
        title:
          error instanceof Error
            ? error.message
            : t("managementEmployees.teamAccess.inviteFailed"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const handleCancelInvitation = async (member: BusinessTeamMember) => {
    if (!accessToken || !member.access.invitationId) {
      return;
    }

    setPendingActionId(member.access.invitationId);

    try {
      updateTeam(
        await cancelBusinessTeamInvitation({
          accessToken,
          invitationId: member.access.invitationId,
        }),
      );
      setGeneratedInvitation((currentInvitation) =>
        currentInvitation?.teamMemberId === member.id ? null : currentInvitation,
      );
    } catch (error: unknown) {
      appToast.error({
        title:
          error instanceof Error
            ? error.message
            : t("managementEmployees.teamAccess.cancelFailed"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const handleCopyInviteUrl = async () => {
    if (!generatedInvitation) {
      return;
    }

    await navigator.clipboard.writeText(generatedInvitation.inviteUrl);
    appToast.success({
      title: t("managementEmployees.teamAccess.copied"),
    });
  };

  const handlePreviewInvitation = async () => {
    if (!generatedInvitation) {
      return;
    }

    setPendingActionId(generatedInvitation.token);

    try {
      const preview = await getBusinessTeamInvitationPreview(
        generatedInvitation.token,
      );

      setGeneratedInvitation({
        ...generatedInvitation,
        preview,
      });
    } catch (error: unknown) {
      appToast.error({
        title:
          error instanceof Error
            ? error.message
            : t("managementEmployees.teamAccess.previewFailed"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!accessToken || !generatedInvitation) {
      return;
    }

    setPendingActionId(generatedInvitation.token);

    try {
      await acceptBusinessTeamInvitation({
        accessToken,
        token: generatedInvitation.token,
      });
      await loadTeam();
      appToast.success({
        title: t("managementEmployees.teamAccess.accepted"),
      });
    } catch (error: unknown) {
      appToast.error({
        title:
          error instanceof Error
            ? error.message
            : t("managementEmployees.teamAccess.acceptFailed"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const hasTeamMembers = teamMembers.length > 0;
  const generatedMember = useMemo(
    () =>
      generatedInvitation
        ? teamMembers.find((member) => member.id === generatedInvitation.teamMemberId)
        : undefined,
    [generatedInvitation, teamMembers],
  );

  const isPanelLoading = isSessionLoading;

  return (
    <section className="grid gap-5 rounded-lg border border-line bg-surface p-5">
      <div className="grid gap-1">
        <h2 className="font-brand text-xl font-semibold text-brand">
          {t("managementEmployees.teamAccess.title")}
        </h2>
        <p className="text-sm leading-6 text-copy-muted">
          {t("managementEmployees.teamAccess.description")}
        </p>
      </div>

      {isPanelLoading ? (
        <div className="flex items-center gap-2 text-sm text-copy-muted">
          <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          {t("managementEmployees.teamAccess.loading")}
        </div>
      ) : null}

      {!isPanelLoading && !hasTeamMembers ? (
        <p className="rounded-lg border border-line bg-background p-4 text-sm text-copy-muted">
          {t("managementEmployees.teamAccess.empty")}
        </p>
      ) : null}

      <div className="grid gap-3">
        {teamMembers.map((member) => {
          const isActionPending =
            pendingActionId === member.id ||
            pendingActionId === member.access.invitationId;

          return (
            <article
              className="grid gap-4 rounded-lg border border-line bg-background p-4 @min-[52rem]/page:grid-cols-[minmax(0,1fr)_12rem_18rem] @min-[52rem]/page:items-center"
              key={member.id}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-copy">
                  {member.fullName}
                </p>
                <p className="truncate text-sm text-copy-muted">
                  {t(`businessSetup.team.roles.${member.role}`)}
                  {" · "}
                  {t(
                    member.providesServices
                      ? "managementEmployees.teamAccess.providesServices"
                      : "managementEmployees.teamAccess.noServices",
                  )}
                </p>
                {member.email ? (
                  <p className="truncate text-sm text-copy-muted">
                    {member.email}
                  </p>
                ) : null}
              </div>

              <span className={getAccessBadgeClassNames(member.access.status)}>
                {t(
                  `managementEmployees.teamAccess.statuses.${member.access.status}`,
                )}
              </span>

              <div className="grid gap-2">
                {!member.email && member.access.status === "NO_ACCESS" ? (
                  <Input
                    inputMode="email"
                    label={t("managementEmployees.teamAccess.email")}
                    onChange={(event) =>
                      setEmailDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [member.id]: event.target.value,
                      }))
                    }
                    placeholder={t(
                      "managementEmployees.teamAccess.emailPlaceholder",
                    )}
                    value={emailDrafts[member.id] ?? ""}
                  />
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  {member.access.status === "INVITED" ? (
                    <Button
                      type="button"
                      variant="outline"
                      isDisabled={isActionPending}
                      onClick={() => handleCancelInvitation(member)}
                    >
                      <BanIcon className="size-4" aria-hidden="true" />
                      {t("managementEmployees.teamAccess.cancel")}
                    </Button>
                  ) : null}

                  {member.access.status !== "ACTIVE" ? (
                    <Button
                      type="button"
                      isDisabled={isActionPending}
                      onClick={() => handleCreateInvitation(member)}
                    >
                      {member.access.status === "INVITED" ? (
                        <RefreshCwIcon className="size-4" aria-hidden="true" />
                      ) : (
                        <SendIcon className="size-4" aria-hidden="true" />
                      )}
                      {t(
                        member.access.status === "INVITED"
                          ? "managementEmployees.teamAccess.resend"
                          : "managementEmployees.teamAccess.invite",
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {generatedInvitation ? (
        <div className="grid gap-3 rounded-lg border border-line bg-background p-4">
          <div className="grid gap-1">
            <h3 className="font-brand text-lg font-semibold text-brand">
              {t("managementEmployees.teamAccess.generatedTitle")}
            </h3>
            <p className="text-sm text-copy-muted">
              {generatedMember?.fullName}
            </p>
          </div>
          <div className="break-all rounded-md border border-line bg-surface px-3 py-2 text-sm text-copy">
            {generatedInvitation.inviteUrl}
          </div>
          {generatedInvitation.preview ? (
            <p className="text-sm text-copy-muted">
              {t("managementEmployees.teamAccess.preview", {
                businessName: generatedInvitation.preview.businessName,
                status: t(
                  `managementEmployees.teamAccess.invitationStatuses.${generatedInvitation.preview.status}`,
                ),
              })}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleCopyInviteUrl}>
              <CopyIcon className="size-4" aria-hidden="true" />
              {t("managementEmployees.teamAccess.copy")}
            </Button>
            <Button
              type="button"
              variant="outline"
              isDisabled={pendingActionId === generatedInvitation.token}
              onClick={handlePreviewInvitation}
            >
              <CheckCircleIcon className="size-4" aria-hidden="true" />
              {t("managementEmployees.teamAccess.checkPreview")}
            </Button>
            <Button
              type="button"
              isDisabled={pendingActionId === generatedInvitation.token}
              onClick={handleAcceptInvitation}
            >
              <CheckCircleIcon className="size-4" aria-hidden="true" />
              {t("managementEmployees.teamAccess.acceptAsCurrent")}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
};
