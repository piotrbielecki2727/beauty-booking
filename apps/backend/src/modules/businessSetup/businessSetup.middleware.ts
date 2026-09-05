import type { NextFunction, Request, Response } from "express";

import { findBusinessSetupStatusById } from "@/modules/businessSetup/businessSetup.repository";
import { ApiError } from "@/utils/apiError";

const requireCompletedBusinessSetup = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  try {
    if (!request.user) {
      throw new ApiError(401, "Brak aktywnej sesji.");
    }

    const business = await findBusinessSetupStatusById(
      request.user.businessId,
    );

    if (!business) {
      throw new ApiError(404, "Nie znaleziono biznesu.");
    }

    if (business.onboardingStatus !== "COMPLETED") {
      throw new ApiError(
        409,
        "Przed wykonaniem tej operacji zakończ konfigurację salonu.",
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

const requireTeamBusiness = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  try {
    if (!request.user) {
      throw new ApiError(401, "Brak aktywnej sesji.");
    }

    const business = await findBusinessSetupStatusById(
      request.user.businessId,
    );

    if (!business) {
      throw new ApiError(404, "Nie znaleziono biznesu.");
    }

    if (business.businessType !== "TEAM") {
      throw new ApiError(
        409,
        "Zarządzanie pracownikami wymaga zespołowego modelu działalności.",
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { requireCompletedBusinessSetup, requireTeamBusiness };
