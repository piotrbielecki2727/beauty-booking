import type { Request, Response } from "express";

import { businessTeamMemberListStatusSchema } from "@beauty-booking/shared";

import {
  acceptBusinessTeamInvitation,
  cancelBusinessTeamInvitation,
  createBusinessTeamMember,
  createBusinessTeamInvitation,
  deactivateBusinessTeamMember,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
  reactivateBusinessTeamMember,
  updateBusinessTeamOwner,
  updateBusinessTeamMember,
} from "@/modules/businessTeam/businessTeam.service";
import { ApiError } from "@/utils/apiError";

const getInviteBaseUrl = (request: Request) => {
  const origin = request.get("origin");

  if (origin) {
    return origin;
  }

  const host = request.get("x-tenant-host") ?? request.get("host");

  if (!host) {
    return `${request.protocol}://${request.hostname}`;
  }

  return `${request.protocol}://${host}`;
};

const getRouteParam = (request: Request, name: string) => {
  const value = request.params[name];

  if (typeof value !== "string") {
    throw new ApiError(400, "Nieprawidłowy parametr ścieżki.");
  }

  return value;
};

const getTeamListStatus = (request: Request) => {
  const parsedStatus = businessTeamMemberListStatusSchema.safeParse(
    request.query.status,
  );

  return parsedStatus.success ? parsedStatus.data : "ACTIVE";
};

const getBusinessTeamController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await getBusinessTeam({
    inviteBaseUrl: getInviteBaseUrl(request),
    listStatus: getTeamListStatus(request),
    user: request.user,
  });
  response.json(result);
};

const createBusinessTeamInvitationController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await createBusinessTeamInvitation({
    inviteBaseUrl: getInviteBaseUrl(request),
    teamMemberId: getRouteParam(request, "teamMemberId"),
    user: request.user,
  });
  response.status(201).json(result);
};

const createBusinessTeamMemberController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await createBusinessTeamMember({
    user: request.user,
    values: request.body,
  });
  response.status(201).json(result);
};

const updateBusinessTeamMemberController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await updateBusinessTeamMember({
    teamMemberId: getRouteParam(request, "teamMemberId"),
    user: request.user,
    values: request.body,
  });
  response.json(result);
};

const updateBusinessTeamOwnerController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await updateBusinessTeamOwner({
    user: request.user,
    values: request.body,
  });
  response.json(result);
};

const deactivateBusinessTeamMemberController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await deactivateBusinessTeamMember({
    teamMemberId: getRouteParam(request, "teamMemberId"),
    user: request.user,
  });
  response.json(result);
};

const reactivateBusinessTeamMemberController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await reactivateBusinessTeamMember({
    teamMemberId: getRouteParam(request, "teamMemberId"),
    user: request.user,
  });
  response.json(result);
};

const cancelBusinessTeamInvitationController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await cancelBusinessTeamInvitation({
    invitationId: getRouteParam(request, "invitationId"),
    user: request.user,
  });
  response.json(result);
};

const getBusinessTeamInvitationPreviewController = async (
  request: Request,
  response: Response,
) => {
  const result = await getBusinessTeamInvitationPreview(
    getRouteParam(request, "token"),
  );
  response.json(result);
};

const acceptBusinessTeamInvitationController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await acceptBusinessTeamInvitation({
    token: getRouteParam(request, "token"),
    user: request.user,
  });
  response.json(result);
};

export {
  acceptBusinessTeamInvitationController,
  cancelBusinessTeamInvitationController,
  createBusinessTeamMemberController,
  createBusinessTeamInvitationController,
  deactivateBusinessTeamMemberController,
  getBusinessTeamController,
  getBusinessTeamInvitationPreviewController,
  reactivateBusinessTeamMemberController,
  updateBusinessTeamOwnerController,
  updateBusinessTeamMemberController,
};
