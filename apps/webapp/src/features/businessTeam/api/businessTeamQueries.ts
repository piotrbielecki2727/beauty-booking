import { CancelledError, queryOptions } from "@tanstack/react-query";

import {
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
} from "@/features/businessTeam/api/businessTeamApi";
import { isApiRequestCancellationError } from "@/lib/apiRequest";

import type { BusinessTeamMemberListStatus } from "@beauty-booking/shared";

type BusinessTeamListKeyParameters = {
  businessId: string;
  status: BusinessTeamMemberListStatus;
};

type BusinessTeamQueryOptionsParameters = BusinessTeamListKeyParameters & {
  accessToken?: string;
};

const businessTeamKeys = {
  all: ["businessTeam"] as const,
  business: (businessId: string) =>
    [...businessTeamKeys.all, businessId] as const,
  invitationPreview: (token: string) =>
    [...businessTeamKeys.all, "invitationPreview", token] as const,
  list: ({ businessId, status }: BusinessTeamListKeyParameters) =>
    [...businessTeamKeys.lists(businessId), status] as const,
  lists: (businessId: string) =>
    [...businessTeamKeys.business(businessId), "list"] as const,
};

const missingBusinessTeamAccessTokenError = new Error(
  "Missing business team access token",
);

const businessTeamQueryOptions = ({
  accessToken,
  businessId,
  status,
}: BusinessTeamQueryOptionsParameters) =>
  queryOptions({
    queryFn: async ({ signal }) => {
      if (!accessToken) {
        throw missingBusinessTeamAccessTokenError;
      }

      try {
        return await getBusinessTeam({
          accessToken,
          signal,
          status,
        });
      } catch (error: unknown) {
        if (isApiRequestCancellationError(error)) {
          throw new CancelledError();
        }

        throw error;
      }
    },
    queryKey: businessTeamKeys.list({
      businessId,
      status,
    }),
    staleTime: 60_000,
  });

const businessTeamInvitationPreviewQueryOptions = (token: string) =>
  queryOptions({
    queryFn: async ({ signal }) => {
      try {
        return await getBusinessTeamInvitationPreview(token, {
          signal,
        });
      } catch (error: unknown) {
        if (isApiRequestCancellationError(error)) {
          throw new CancelledError();
        }

        throw error;
      }
    },
    queryKey: businessTeamKeys.invitationPreview(token),
    staleTime: 60_000,
  });

export {
  businessTeamInvitationPreviewQueryOptions,
  businessTeamKeys,
  businessTeamQueryOptions,
};
export type { BusinessTeamListKeyParameters, BusinessTeamQueryOptionsParameters };
