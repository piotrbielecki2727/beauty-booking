"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  businessTeamKeys,
  businessTeamMutationKeys,
  businessTeamMutationScope,
  cancelBusinessTeamInvitation,
  createBusinessTeamInvitation,
  createBusinessTeamMember,
  deactivateBusinessTeamMember,
  reactivateBusinessTeamMember,
  updateBusinessTeamMember,
  updateBusinessTeamOwner,
} from "@/features/businessTeam/api";
import { getBusinessTeamErrorMessageKey } from "@/features/businessTeam/lib/businessTeamErrorMessages";
import { appToast } from "@/features/notifications";

import type {
  CreateBusinessTeamMemberRequest,
  UpdateBusinessTeamMemberRequest,
  UpdateBusinessTeamOwnerRequest,
} from "@beauty-booking/shared";

type UseBusinessTeamMutationsParameters = {
  accessToken?: string;
  businessId: string;
  onCancelInvitationSuccess: () => void;
  onDeactivateSuccess: () => void;
  onFormSuccess: () => void;
};

const missingAccessTokenError = new Error("Missing business team access token");

export const useBusinessTeamMutations = ({
  accessToken,
  businessId,
  onCancelInvitationSuccess,
  onDeactivateSuccess,
  onFormSuccess,
}: UseBusinessTeamMutationsParameters) => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const invalidateBusinessTeamLists = async () => {
    await queryClient.invalidateQueries({
      queryKey: businessTeamKeys.lists(businessId),
    });
  };
  const getErrorDescription = (
    error: unknown,
    fallbackKey: Parameters<typeof getBusinessTeamErrorMessageKey>[1],
  ) => t(getBusinessTeamErrorMessageKey(error, fallbackKey));
  const getAccessToken = () => {
    if (!accessToken) {
      throw missingAccessTokenError;
    }

    return accessToken;
  };

  const createMemberMutation = useMutation({
    mutationFn: ({ values }: { values: CreateBusinessTeamMemberRequest }) =>
      createBusinessTeamMember({
        accessToken: getAccessToken(),
        values,
      }),
    mutationKey: businessTeamMutationKeys.createMember(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.saveFailed",
        ),
        title: t("managementEmployees.feedback.saveFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      onFormSuccess();
      appToast.success({
        title: t("managementEmployees.feedback.created"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({
      teamMemberId,
      values,
    }: {
      teamMemberId: string;
      values: UpdateBusinessTeamMemberRequest;
    }) =>
      updateBusinessTeamMember({
        accessToken: getAccessToken(),
        teamMemberId,
        values,
      }),
    mutationKey: businessTeamMutationKeys.updateMember(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.saveFailed",
        ),
        title: t("managementEmployees.feedback.saveFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      onFormSuccess();
      appToast.success({
        title: t("managementEmployees.feedback.updated"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const updateOwnerMutation = useMutation({
    mutationFn: ({ values }: { values: UpdateBusinessTeamOwnerRequest }) =>
      updateBusinessTeamOwner({
        accessToken: getAccessToken(),
        values,
      }),
    mutationKey: businessTeamMutationKeys.updateOwner(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.saveFailed",
        ),
        title: t("managementEmployees.feedback.saveFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      onFormSuccess();
      appToast.success({
        title: t("managementEmployees.feedback.updated"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const createInvitationMutation = useMutation({
    mutationFn: ({ teamMemberId }: { teamMemberId: string }) =>
      createBusinessTeamInvitation({
        accessToken: getAccessToken(),
        teamMemberId,
      }),
    mutationKey: businessTeamMutationKeys.createInvitation(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.inviteFailed",
        ),
        title: t("managementEmployees.feedback.inviteFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      appToast.success({
        title: t("managementEmployees.feedback.inviteCreated"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: ({ invitationId }: { invitationId: string; memberId: string }) =>
      cancelBusinessTeamInvitation({
        accessToken: getAccessToken(),
        invitationId,
      }),
    mutationKey: businessTeamMutationKeys.cancelInvitation(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.cancelFailed",
        ),
        title: t("managementEmployees.feedback.cancelFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      onCancelInvitationSuccess();
      appToast.success({
        title: t("managementEmployees.feedback.inviteCancelled"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const deactivateMemberMutation = useMutation({
    mutationFn: ({ teamMemberId }: { teamMemberId: string }) =>
      deactivateBusinessTeamMember({
        accessToken: getAccessToken(),
        teamMemberId,
      }),
    mutationKey: businessTeamMutationKeys.deactivateMember(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.deactivateFailed",
        ),
        title: t("managementEmployees.feedback.deactivateFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      onDeactivateSuccess();
      appToast.success({
        title: t("managementEmployees.feedback.deactivated"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const reactivateMemberMutation = useMutation({
    mutationFn: ({ teamMemberId }: { teamMemberId: string }) =>
      reactivateBusinessTeamMember({
        accessToken: getAccessToken(),
        teamMemberId,
      }),
    mutationKey: businessTeamMutationKeys.reactivateMember(),
    onError: (error: unknown) => {
      appToast.error({
        description: getErrorDescription(
          error,
          "managementEmployees.feedback.reactivateFailed",
        ),
        title: t("managementEmployees.feedback.reactivateFailed"),
      });
    },
    onSuccess: async () => {
      await invalidateBusinessTeamLists();
      appToast.success({
        title: t("managementEmployees.feedback.reactivated"),
      });
    },
    scope: businessTeamMutationScope,
  });

  const isFormSubmitting =
    createMemberMutation.isPending ||
    updateMemberMutation.isPending ||
    updateOwnerMutation.isPending;
  const isAnyTeamMutationPending =
    isFormSubmitting ||
    createInvitationMutation.isPending ||
    cancelInvitationMutation.isPending ||
    deactivateMemberMutation.isPending ||
    reactivateMemberMutation.isPending;
  const pendingTeamMemberIds = useMemo(
    () => ({
      deactivate: deactivateMemberMutation.isPending
        ? deactivateMemberMutation.variables?.teamMemberId ?? null
        : null,
      invite: createInvitationMutation.isPending
        ? createInvitationMutation.variables?.teamMemberId ?? null
        : null,
      reactivate: reactivateMemberMutation.isPending
        ? reactivateMemberMutation.variables?.teamMemberId ?? null
        : null,
    }),
    [
      createInvitationMutation.isPending,
      createInvitationMutation.variables?.teamMemberId,
      deactivateMemberMutation.isPending,
      deactivateMemberMutation.variables?.teamMemberId,
      reactivateMemberMutation.isPending,
      reactivateMemberMutation.variables?.teamMemberId,
    ],
  );

  return {
    cancelInvitation: cancelInvitationMutation.mutate,
    createInvitation: createInvitationMutation.mutate,
    createMember: createMemberMutation.mutate,
    deactivateMember: deactivateMemberMutation.mutate,
    isAnyTeamMutationPending,
    isCancelInvitationPending: cancelInvitationMutation.isPending,
    isDeactivatePending: deactivateMemberMutation.isPending,
    isFormSubmitting,
    pendingTeamMemberIds,
    pendingCancelInvitationId:
      cancelInvitationMutation.variables?.invitationId ?? null,
    pendingDeactivateMemberId:
      deactivateMemberMutation.variables?.teamMemberId ?? null,
    reactivateMember: reactivateMemberMutation.mutate,
    updateMember: updateMemberMutation.mutate,
    updateOwner: updateOwnerMutation.mutate,
  };
};

export type { UseBusinessTeamMutationsParameters };
