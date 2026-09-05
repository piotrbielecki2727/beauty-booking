"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import type {
  BusinessTeamMember,
  BusinessTeamMemberListStatus,
  BusinessTeamOwner,
} from "@beauty-booking/shared";

import { ManagementPageLayout } from "@/components/layout/ManagementPageLayout";
import {
  Button,
  ConfirmationDialog,
  LoadingOverlay,
} from "@/components/reusable";
import { businessTeamQueryOptions } from "@/features/businessTeam/api";
import { useBusinessTeamMemberFormDialog } from "@/features/businessTeam/hooks/useBusinessTeamMemberFormDialog";
import { useBusinessTeamMutations } from "@/features/businessTeam/hooks/useBusinessTeamMutations";
import {
  getBusinessTeamMemberListStatusFromSearchParam,
  getBusinessTeamMembersHref,
} from "@/features/businessTeam/lib/businessTeamMembersUrlState";
import { appToast } from "@/features/notifications";
import { useRouter } from "@/i18n/navigation";

import type { BusinessTeamMemberFormSubmitPayload } from "@/features/businessTeam/lib/businessTeamMemberForm";
import type { BusinessTeamOwnerDetails } from "@/features/businessTeam/lib/businessTeamMembersTypes";

import { BusinessTeamMemberFormDialog } from "./BusinessTeamMemberFormDialog";
import { BusinessTeamMembersTable } from "./BusinessTeamMembersTable";
import { BusinessTeamMembersStatusTabs } from "./BusinessTeamMembersStatusTabs";

type BusinessTeamMembersPanelProperties = {
  initialBusinessId: string | null;
};

type BusinessTeamMembersPanelContentProperties = {
  businessId: string;
};

type BusinessTeamConfirmationState =
  | {
      member: BusinessTeamMember;
      type: "cancelInvitation";
    }
  | {
      member: BusinessTeamMember;
      type: "deactivateMember";
    }
  | null;

const defaultOwnerDetails: BusinessTeamOwnerDetails = {
  birthdayDay: null,
  birthdayMonth: null,
  phoneNumber: null,
  providesServices: false,
};

const getMillisecondsUntilNextDay = () => {
  const now = new Date();
  const nextDay = new Date(now);

  nextDay.setHours(24, 0, 0, 0);

  return nextDay.getTime() - now.getTime() + 1000;
};

const BusinessTeamMembersPanelLoadingState = () => {
  const t = useTranslations();

  return (
    <ManagementPageLayout
      action={
        <Button type="button" isDisabled>
          <PlusIcon className="size-4" aria-hidden="true" />
          {t("managementEmployees.team.add")}
        </Button>
      }
      className="h-[calc(100dvh-4rem)] md:h-dvh"
      contentClassName="@container/page overflow-hidden"
      description={t("managementEmployees.description")}
      title={t("managementEmployees.title")}
    >
      <div className="relative min-h-80 flex-1">
        <LoadingOverlay scope="container" variant="bare" />
      </div>
    </ManagementPageLayout>
  );
};

const BusinessTeamMembersPanelContent = ({
  businessId,
}: BusinessTeamMembersPanelContentProperties) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [confirmationState, setConfirmationState] =
    useState<BusinessTeamConfirmationState>(null);
  const [currentTimestampMs, setCurrentTimestampMs] = useState(() => Date.now());
  const accessToken = session?.accessToken;
  const teamListStatus =
    getBusinessTeamMemberListStatusFromSearchParam(searchParams.get("status"));
  const activeTeamQuery = useQuery({
    ...businessTeamQueryOptions({
      accessToken,
      businessId,
      status: "ACTIVE",
    }),
    enabled: Boolean(accessToken),
  });
  const deactivatedTeamQuery = useQuery({
    ...businessTeamQueryOptions({
      accessToken,
      businessId,
      status: "DEACTIVATED",
    }),
    enabled: Boolean(accessToken),
  });
  const teamQuery =
    teamListStatus === "DEACTIVATED" ? deactivatedTeamQuery : activeTeamQuery;
  const teamResponse = teamQuery.data;
  const activeCount = activeTeamQuery.data
    ? activeTeamQuery.data.teamMembers.length + 1
    : null;
  const deactivatedCount = deactivatedTeamQuery.data
    ? deactivatedTeamQuery.data.teamMembers.length
    : null;
  const fallbackOwner: BusinessTeamOwner = useMemo(
    () => ({
      ...defaultOwnerDetails,
      email: session?.user.email ?? "",
      fullName:
        session?.user.firstName && session.user.lastName
          ? `${session.user.firstName} ${session.user.lastName}`
          : t("businessSetup.team.ownerFallback"),
    }),
    [session, t],
  );
  const owner = teamResponse?.owner ?? fallbackOwner;
  const ownerDetails: BusinessTeamOwnerDetails = useMemo(
    () => ({
      birthdayDay: owner.birthdayDay,
      birthdayMonth: owner.birthdayMonth,
      phoneNumber: owner.phoneNumber,
      providesServices: owner.providesServices,
    }),
    [owner],
  );
  const teamMembers = teamResponse?.teamMembers ?? [];
  const isBodyLoading = teamQuery.isPending && !teamResponse;
  const memberPendingCancelInvitation =
    confirmationState?.type === "cancelInvitation"
      ? confirmationState.member
      : null;
  const memberPendingDeactivate =
    confirmationState?.type === "deactivateMember"
      ? confirmationState.member
      : null;
  const memberFormDialog = useBusinessTeamMemberFormDialog({
    ownerDetails,
  });

  const businessTeamMutations = useBusinessTeamMutations({
    accessToken,
    businessId,
    onCancelInvitationSuccess: () => setConfirmationState(null),
    onDeactivateSuccess: () => setConfirmationState(null),
    onFormSuccess: memberFormDialog.close,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextDayRefresh = () => {
      timeoutId = setTimeout(() => {
        setCurrentTimestampMs(Date.now());
        scheduleNextDayRefresh();
      }, getMillisecondsUntilNextDay());
    };

    scheduleNextDayRefresh();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleCreateInvitation = (member: BusinessTeamMember) => {
    if (
      !accessToken ||
      !member.email ||
      businessTeamMutations.isAnyTeamMutationPending
    ) {
      return;
    }

    businessTeamMutations.createInvitation({
      teamMemberId: member.id,
    });
  };

  const handleCancelInvitation = () => {
    if (
      !accessToken ||
      !memberPendingCancelInvitation ||
      businessTeamMutations.isAnyTeamMutationPending
    ) {
      return;
    }

    const member = memberPendingCancelInvitation;
    const invitationId = member.access.invitationId;

    if (!invitationId) {
      return;
    }

    businessTeamMutations.cancelInvitation({
      invitationId,
      memberId: member.id,
    });
  };

  const handleDeactivateMember = () => {
    if (
      !accessToken ||
      !memberPendingDeactivate ||
      businessTeamMutations.isAnyTeamMutationPending
    ) {
      return;
    }

    businessTeamMutations.deactivateMember({
      teamMemberId: memberPendingDeactivate.id,
    });
  };

  const handleReactivateMember = (member: BusinessTeamMember) => {
    if (!accessToken || businessTeamMutations.isAnyTeamMutationPending) {
      return;
    }

    businessTeamMutations.reactivateMember({
      teamMemberId: member.id,
    });
  };

  const handleListStatusChange = (nextStatus: BusinessTeamMemberListStatus) => {
    if (nextStatus === teamListStatus) {
      return;
    }

    router.push(getBusinessTeamMembersHref(nextStatus));
  };

  const handleCopyInviteUrl = async (inviteUrl: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      appToast.success({
        title: t("managementEmployees.feedback.copied"),
      });
    } catch {
      appToast.error({
        title: t("managementEmployees.feedback.copyFailed"),
      });
    }
  };

  const handleFormSubmit = (payload: BusinessTeamMemberFormSubmitPayload) => {
    if (!accessToken || businessTeamMutations.isAnyTeamMutationPending) {
      return;
    }

    if (payload.mode === "create") {
      businessTeamMutations.createMember({
        values: payload.values,
      });
    }

    if (payload.mode === "editMember") {
      businessTeamMutations.updateMember({
        teamMemberId: payload.member.id,
        values: payload.values,
      });
    }

    if (payload.mode === "editOwner") {
      businessTeamMutations.updateOwner({
        values: payload.values,
      });
    }
  };

  const renderTeamTable = () => (
    <BusinessTeamMembersTable
      currentTimestampMs={currentTimestampMs}
      isActionsDisabled={
        !accessToken || businessTeamMutations.isAnyTeamMutationPending
      }
      isBodyLoading={isBodyLoading}
      listStatus={teamListStatus}
      owner={owner}
      pendingTeamMemberIds={businessTeamMutations.pendingTeamMemberIds}
      teamMembers={teamMembers}
      onCancelInvitation={(member) =>
        setConfirmationState({
          member,
          type: "cancelInvitation",
        })
      }
      onCopyInviteUrl={handleCopyInviteUrl}
      onCreateInvitation={handleCreateInvitation}
      onDeactivateMember={(member) =>
        setConfirmationState({
          member,
          type: "deactivateMember",
        })
      }
      onEditMember={memberFormDialog.openEditMember}
      onEditOwner={memberFormDialog.openEditOwner}
      onReactivateMember={handleReactivateMember}
    />
  );

  return (
    <ManagementPageLayout
      action={
        <Button
          type="button"
          isDisabled={
            !accessToken ||
            teamListStatus === "DEACTIVATED" ||
            businessTeamMutations.isAnyTeamMutationPending
          }
          onClick={memberFormDialog.openCreate}
        >
          <PlusIcon className="size-4" aria-hidden="true" />
          {t("managementEmployees.team.add")}
        </Button>
      }
      className="h-[calc(100dvh-4rem)] md:h-dvh"
      contentClassName="@container/page overflow-hidden"
      description={t("managementEmployees.description")}
      title={t("managementEmployees.title")}
    >
      {teamQuery.isError && !teamResponse ? (
        <div className="grid min-h-80 flex-1 place-items-center rounded-lg border border-line bg-surface p-6 text-center">
          <div className="grid justify-items-center gap-3">
            <p className="text-sm text-copy-muted">
              {t("managementEmployees.feedback.loadFailed")}
            </p>
            <Button
              type="button"
              variant="outline"
              isDisabled={!accessToken}
              onClick={() => {
                void teamQuery.refetch();
              }}
            >
              {t("common.retry")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-0">
          <BusinessTeamMembersStatusTabs
            activeCount={activeCount}
            deactivatedCount={deactivatedCount}
            isDisabled={!accessToken}
            value={teamListStatus}
            onValueChange={handleListStatusChange}
          />
          {renderTeamTable()}
        </div>
      )}

      <BusinessTeamMemberFormDialog
        formKey={memberFormDialog.formKey}
        initialFocusField={memberFormDialog.initialFocusField}
        isOpen={memberFormDialog.isOpen}
        isSubmitting={businessTeamMutations.isFormSubmitting}
        member={memberFormDialog.member}
        mode={memberFormDialog.mode}
        ownerDetails={memberFormDialog.ownerDetails}
        onOpenChange={memberFormDialog.handleOpenChange}
        onSubmit={handleFormSubmit}
      />

      <ConfirmationDialog
        cancelLabel={t("managementEmployees.deactivateDialog.cancel")}
        confirmLabel={t("managementEmployees.deactivateDialog.confirm")}
        confirmVariant="destructive"
        description={t("managementEmployees.deactivateDialog.description", {
          name: memberPendingDeactivate?.fullName ?? "",
        })}
        isConfirmLoading={
          memberPendingDeactivate
            ? businessTeamMutations.isDeactivatePending &&
              businessTeamMutations.pendingDeactivateMemberId ===
                memberPendingDeactivate.id
            : false
        }
        isOpen={Boolean(memberPendingDeactivate)}
        onCancel={() => setConfirmationState(null)}
        onConfirm={handleDeactivateMember}
        title={t("managementEmployees.deactivateDialog.title")}
      />

      <ConfirmationDialog
        cancelLabel={t("managementEmployees.cancelInvitationDialog.cancel")}
        confirmLabel={t("managementEmployees.cancelInvitationDialog.confirm")}
        confirmVariant="destructive"
        description={t("managementEmployees.cancelInvitationDialog.description", {
          name: memberPendingCancelInvitation?.fullName ?? "",
        })}
        isConfirmLoading={
          memberPendingCancelInvitation?.access.invitationId
            ? businessTeamMutations.isCancelInvitationPending &&
              businessTeamMutations.pendingCancelInvitationId ===
                memberPendingCancelInvitation.access.invitationId
            : false
        }
        isOpen={Boolean(memberPendingCancelInvitation)}
        onCancel={() => setConfirmationState(null)}
        onConfirm={handleCancelInvitation}
        title={t("managementEmployees.cancelInvitationDialog.title")}
      />
    </ManagementPageLayout>
  );
};

export const BusinessTeamMembersPanel = ({
  initialBusinessId,
}: BusinessTeamMembersPanelProperties) => {
  const { data: session } = useSession();
  const businessId = session?.user.businessId ?? initialBusinessId;

  if (!businessId) {
    return <BusinessTeamMembersPanelLoadingState />;
  }

  return <BusinessTeamMembersPanelContent businessId={businessId} />;
};

export type {
  BusinessTeamMembersPanelContentProperties,
  BusinessTeamMembersPanelProperties,
};
