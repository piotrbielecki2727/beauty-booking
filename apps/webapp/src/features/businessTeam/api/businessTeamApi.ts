import { z } from "zod";

import {
  acceptBusinessTeamInvitationResponseSchema,
  businessTeamInvitationPreviewSchema,
  businessTeamResponseSchema,
  createBusinessTeamInvitationResponseSchema,
  type AcceptBusinessTeamInvitationResponse,
  type BusinessTeamInvitationPreview,
  type BusinessTeamResponse,
  type CreateBusinessTeamInvitationResponse,
} from "@beauty-booking/shared";

import { backendApiUrl } from "@/config";

type BusinessTeamRequestOptions<ResponseSchema extends z.ZodType> = {
  accessToken?: string;
  body?: unknown;
  method: "GET" | "POST";
  path: string;
  schema: ResponseSchema;
};

class BusinessTeamApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BusinessTeamApiError";
    this.status = status;
  }
}

const requestBusinessTeam = async <ResponseSchema extends z.ZodType>({
  accessToken,
  body,
  method,
  path,
  schema,
}: BusinessTeamRequestOptions<ResponseSchema>) => {
  const headers = new Headers();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${backendApiUrl}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers,
    method,
  });
  const payload = (await response.json().catch(() => undefined)) as unknown;

  if (!response.ok) {
    const errorPayload = payload as { message?: string } | undefined;

    throw new BusinessTeamApiError(
      errorPayload?.message ?? "Request failed",
      response.status,
    );
  }

  const parsedPayload = schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new BusinessTeamApiError("Invalid response");
  }

  return parsedPayload.data;
};

const getBusinessTeam = (
  accessToken: string,
): Promise<BusinessTeamResponse> =>
  requestBusinessTeam({
    accessToken,
    method: "GET",
    path: "/business/team",
    schema: businessTeamResponseSchema,
  });

const createBusinessTeamInvitation = ({
  accessToken,
  email,
  teamMemberId,
}: {
  accessToken: string;
  email?: string;
  teamMemberId: string;
}): Promise<CreateBusinessTeamInvitationResponse> =>
  requestBusinessTeam({
    accessToken,
    body: email ? { email } : {},
    method: "POST",
    path: `/business/team/members/${teamMemberId}/invitations`,
    schema: createBusinessTeamInvitationResponseSchema,
  });

const cancelBusinessTeamInvitation = ({
  accessToken,
  invitationId,
}: {
  accessToken: string;
  invitationId: string;
}): Promise<BusinessTeamResponse> =>
  requestBusinessTeam({
    accessToken,
    method: "POST",
    path: `/business/team/invitations/${invitationId}/cancel`,
    schema: businessTeamResponseSchema,
  });

const getBusinessTeamInvitationPreview = (
  token: string,
): Promise<BusinessTeamInvitationPreview> =>
  requestBusinessTeam({
    method: "GET",
    path: `/team-invitations/${token}`,
    schema: businessTeamInvitationPreviewSchema,
  });

const acceptBusinessTeamInvitation = ({
  accessToken,
  token,
}: {
  accessToken: string;
  token: string;
}): Promise<AcceptBusinessTeamInvitationResponse> =>
  requestBusinessTeam({
    accessToken,
    method: "POST",
    path: `/team-invitations/${token}/accept`,
    schema: acceptBusinessTeamInvitationResponseSchema,
  });

export {
  acceptBusinessTeamInvitation,
  BusinessTeamApiError,
  cancelBusinessTeamInvitation,
  createBusinessTeamInvitation,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
};
