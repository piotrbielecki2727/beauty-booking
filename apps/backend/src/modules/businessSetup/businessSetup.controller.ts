import type { Request, Response } from "express";

import {
  getBusinessSetup,
  saveBusinessBasics,
  saveBusinessLocation,
  saveBusinessServices,
  saveBusinessWorkstations,
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

const saveBusinessWorkstationsController = async (
  request: Request,
  response: Response,
) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const result = await saveBusinessWorkstations(request.user, request.body);
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

export {
  getBusinessSetupController,
  saveBusinessBasicsController,
  saveBusinessLocationController,
  saveBusinessServicesController,
  saveBusinessWorkstationsController,
};
