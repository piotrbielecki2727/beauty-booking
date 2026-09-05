import {
  acceptBusinessTeamInvitationResponseSchema,
  businessTeamMemberMutationResponseSchema,
  businessTeamOwnerMutationResponseSchema,
  businessTeamInvitationPreviewSchema,
  businessTeamResponseSchema,
  cancelBusinessTeamInvitationResponseSchema,
  createBusinessTeamMemberRequestSchema,
  createBusinessTeamInvitationResponseSchema,
  updateBusinessTeamMemberRequestSchema,
  updateBusinessTeamOwnerRequestSchema,
  type AcceptBusinessTeamInvitationResponse,
  type BusinessTeamMemberMutationResponse,
  type BusinessTeamInvitationPreview,
  type BusinessTeamMemberListStatus,
  type BusinessTeamOwnerMutationResponse,
  type BusinessTeamResponse,
  type CancelBusinessTeamInvitationResponse,
  type CreateBusinessTeamMemberRequest,
  type CreateBusinessTeamInvitationResponse,
  type UpdateBusinessTeamMemberRequest,
  type UpdateBusinessTeamOwnerRequest,
} from "@beauty-booking/shared";

import { ApiRequestError, apiRequest } from "@/lib/apiRequest";

const businessTeamApiErrorName = "BusinessTeamApiError";

const getBusinessTeam = ({
  accessToken,
  signal,
  status,
}: {
  accessToken: string;
  signal?: AbortSignal;
  status?: BusinessTeamMemberListStatus;
}): Promise<BusinessTeamResponse> =>
  apiRequest({
    accessToken,
    errorName: businessTeamApiErrorName,
    method: "GET",
    path: `/business/team${status ? `?status=${status}` : ""}`,
    schema: businessTeamResponseSchema,
    signal,
  });

const createBusinessTeamMember = ({
  accessToken,
  signal,
  values,
}: {
  accessToken: string;
  signal?: AbortSignal;
  values: CreateBusinessTeamMemberRequest;
}): Promise<BusinessTeamMemberMutationResponse> =>
  apiRequest({
    accessToken,
    body: createBusinessTeamMemberRequestSchema.parse(values),
    errorName: businessTeamApiErrorName,
    method: "POST",
    path: "/business/team/members",
    schema: businessTeamMemberMutationResponseSchema,
    signal,
  });

const updateBusinessTeamMember = ({
  accessToken,
  signal,
  teamMemberId,
  values,
}: {
  accessToken: string;
  signal?: AbortSignal;
  teamMemberId: string;
  values: UpdateBusinessTeamMemberRequest;
}): Promise<BusinessTeamMemberMutationResponse> =>
  apiRequest({
    accessToken,
    body: updateBusinessTeamMemberRequestSchema.parse(values),
    errorName: businessTeamApiErrorName,
    method: "PATCH",
    path: `/business/team/members/${teamMemberId}`,
    schema: businessTeamMemberMutationResponseSchema,
    signal,
  });

const updateBusinessTeamOwner = ({
  accessToken,
  signal,
  values,
}: {
  accessToken: string;
  signal?: AbortSignal;
  values: UpdateBusinessTeamOwnerRequest;
}): Promise<BusinessTeamOwnerMutationResponse> =>
  apiRequest({
    accessToken,
    body: updateBusinessTeamOwnerRequestSchema.parse(values),
    errorName: businessTeamApiErrorName,
    method: "PATCH",
    path: "/business/team/owner",
    schema: businessTeamOwnerMutationResponseSchema,
    signal,
  });

const deactivateBusinessTeamMember = ({
  accessToken,
  signal,
  teamMemberId,
}: {
  accessToken: string;
  signal?: AbortSignal;
  teamMemberId: string;
}): Promise<BusinessTeamMemberMutationResponse> =>
  apiRequest({
    accessToken,
    errorName: businessTeamApiErrorName,
    method: "POST",
    path: `/business/team/members/${teamMemberId}/deactivate`,
    schema: businessTeamMemberMutationResponseSchema,
    signal,
  });

const reactivateBusinessTeamMember = ({
  accessToken,
  signal,
  teamMemberId,
}: {
  accessToken: string;
  signal?: AbortSignal;
  teamMemberId: string;
}): Promise<BusinessTeamMemberMutationResponse> =>
  apiRequest({
    accessToken,
    errorName: businessTeamApiErrorName,
    method: "POST",
    path: `/business/team/members/${teamMemberId}/reactivate`,
    schema: businessTeamMemberMutationResponseSchema,
    signal,
  });

const createBusinessTeamInvitation = ({
  accessToken,
  signal,
  teamMemberId,
}: {
  accessToken: string;
  signal?: AbortSignal;
  teamMemberId: string;
}): Promise<CreateBusinessTeamInvitationResponse> =>
  apiRequest({
    accessToken,
    errorName: businessTeamApiErrorName,
    method: "POST",
    path: `/business/team/members/${teamMemberId}/invitations`,
    schema: createBusinessTeamInvitationResponseSchema,
    signal,
  });

const cancelBusinessTeamInvitation = ({
  accessToken,
  invitationId,
  signal,
}: {
  accessToken: string;
  invitationId: string;
  signal?: AbortSignal;
}): Promise<CancelBusinessTeamInvitationResponse> =>
  apiRequest({
    accessToken,
    errorName: businessTeamApiErrorName,
    method: "POST",
    path: `/business/team/invitations/${invitationId}/cancel`,
    schema: cancelBusinessTeamInvitationResponseSchema,
    signal,
  });

const getBusinessTeamInvitationPreview = (
  token: string,
  options?: {
    signal?: AbortSignal;
  },
): Promise<BusinessTeamInvitationPreview> =>
  apiRequest({
    errorName: businessTeamApiErrorName,
    method: "GET",
    path: `/team-invitations/${token}`,
    schema: businessTeamInvitationPreviewSchema,
    signal: options?.signal,
  });

const acceptBusinessTeamInvitation = ({
  accessToken,
  signal,
  token,
}: {
  accessToken: string;
  signal?: AbortSignal;
  token: string;
}): Promise<AcceptBusinessTeamInvitationResponse> =>
  apiRequest({
    accessToken,
    errorName: businessTeamApiErrorName,
    method: "POST",
    path: `/team-invitations/${token}/accept`,
    schema: acceptBusinessTeamInvitationResponseSchema,
    signal,
  });

export {
  acceptBusinessTeamInvitation,
  ApiRequestError as BusinessTeamApiError,
  cancelBusinessTeamInvitation,
  createBusinessTeamMember,
  createBusinessTeamInvitation,
  deactivateBusinessTeamMember,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
  reactivateBusinessTeamMember,
  updateBusinessTeamOwner,
  updateBusinessTeamMember,
};
