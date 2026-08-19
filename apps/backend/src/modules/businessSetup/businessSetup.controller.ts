import type { Request, Response } from "express";

import {
  getBusinessSetup,
  saveBusinessBasics,
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

export { getBusinessSetupController, saveBusinessBasicsController };
