import type { Request, Response } from "express";

import {
  acceptBusinessTeamInvitation,
  cancelBusinessTeamInvitation,
  createBusinessTeamInvitation,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
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

const getBusinessTeamController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await getBusinessTeam(request.user);
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
    values: request.body,
  });
  response.status(201).json(result);
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
  createBusinessTeamInvitationController,
  getBusinessTeamController,
  getBusinessTeamInvitationPreviewController,
};
