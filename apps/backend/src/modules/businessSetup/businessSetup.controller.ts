import type { Request, Response } from "express";

import {
  completeBusinessSetup,
  getBusinessSetup,
  getBusinessSetupStatus,
  saveBusinessBasics,
  saveBusinessBookingRules,
  saveBusinessDetails,
  saveBusinessLocation,
  saveBusinessOpeningHours,
  saveBusinessServices,
  saveBusinessTeam,
  saveBusinessType,
  startBusinessSetup,
} from "@/modules/businessSetup/businessSetup.service";
import { ApiError } from "@/utils/apiError";

const getBusinessSetupController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await getBusinessSetup(request.user);
  response.json(result);
};

const getBusinessSetupStatusController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await getBusinessSetupStatus(request.user);
  response.json(result);
};

const completeBusinessSetupController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await completeBusinessSetup(request.user);
  response.json(result);
};

const startBusinessSetupController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await startBusinessSetup(request.user);
  response.json(result);
};

const saveBusinessBasicsController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessBasics(request.user, request.body);
  response.json(result);
};

const saveBusinessTypeController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessType(request.user, request.body);
  response.json(result);
};

const saveBusinessDetailsController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessDetails(request.user, request.body);
  response.json(result);
};

const saveBusinessBookingRulesController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessBookingRules(request.user, request.body);
  response.json(result);
};

const saveBusinessLocationController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessLocation(request.user, request.body);
  response.json(result);
};

const saveBusinessOpeningHoursController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessOpeningHours(request.user, request.body);
  response.json(result);
};

const saveBusinessServicesController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessServices(request.user, request.body);
  response.json(result);
};

const saveBusinessTeamController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessTeam(request.user, request.body);
  response.json(result);
};

export {
  completeBusinessSetupController,
  getBusinessSetupController,
  getBusinessSetupStatusController,
  saveBusinessBasicsController,
  saveBusinessBookingRulesController,
  saveBusinessDetailsController,
  saveBusinessLocationController,
  saveBusinessOpeningHoursController,
  saveBusinessServicesController,
  saveBusinessTeamController,
  saveBusinessTypeController,
  startBusinessSetupController,
};
