import { Router } from "express";

import {
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
} from "@/modules/businessSetup/businessSetup.controller";
import {
  businessBasicsFormSchema,
  businessBookingRulesFormSchema,
  businessDetailsFormSchema,
  businessLocationFormSchema,
  businessOpeningHoursFormSchema,
  businessServicesFormSchema,
  businessTeamFormSchema,
  businessTypeFormSchema,
} from "@/modules/businessSetup/businessSetup.schemas";
import { requireAuth } from "@/modules/auth/auth.middleware";
import { validateBody } from "@/middlewares/validateRequest";
import { asyncHandler } from "@/utils/asyncHandler";

const businessSetupRouter = Router();

businessSetupRouter.get(
  "/setup/status",
  asyncHandler(requireAuth),
  asyncHandler(getBusinessSetupStatusController),
);

businessSetupRouter.get(
  "/setup",
  asyncHandler(requireAuth),
  asyncHandler(getBusinessSetupController),
);

businessSetupRouter.patch(
  "/setup/complete",
  asyncHandler(requireAuth),
  asyncHandler(completeBusinessSetupController),
);

businessSetupRouter.patch(
  "/setup/start",
  asyncHandler(requireAuth),
  asyncHandler(startBusinessSetupController),
);

businessSetupRouter.patch(
  "/setup/business-type",
  asyncHandler(requireAuth),
  validateBody(businessTypeFormSchema),
  asyncHandler(saveBusinessTypeController),
);

businessSetupRouter.patch(
  "/setup/business-basics",
  asyncHandler(requireAuth),
  validateBody(businessBasicsFormSchema),
  asyncHandler(saveBusinessBasicsController),
);

businessSetupRouter.patch(
  "/setup/location",
  asyncHandler(requireAuth),
  validateBody(businessLocationFormSchema),
  asyncHandler(saveBusinessLocationController),
);

businessSetupRouter.patch(
  "/setup/business-details",
  asyncHandler(requireAuth),
  validateBody(businessDetailsFormSchema),
  asyncHandler(saveBusinessDetailsController),
);

businessSetupRouter.patch(
  "/setup/opening-hours",
  asyncHandler(requireAuth),
  validateBody(businessOpeningHoursFormSchema),
  asyncHandler(saveBusinessOpeningHoursController),
);

businessSetupRouter.patch(
  "/setup/booking-rules",
  asyncHandler(requireAuth),
  validateBody(businessBookingRulesFormSchema),
  asyncHandler(saveBusinessBookingRulesController),
);

businessSetupRouter.patch(
  "/setup/team",
  asyncHandler(requireAuth),
  validateBody(businessTeamFormSchema),
  asyncHandler(saveBusinessTeamController),
);

businessSetupRouter.patch(
  "/setup/services",
  asyncHandler(requireAuth),
  validateBody(businessServicesFormSchema),
  asyncHandler(saveBusinessServicesController),
);

export { businessSetupRouter };
