import { Router } from "express";

import {
  getBusinessSetupController,
  saveBusinessBasicsController,
  saveBusinessLocationController,
  saveBusinessServicesController,
  saveBusinessTeamController,
  saveBusinessWorkstationsController,
} from "@/modules/businessSetup/businessSetup.controller";
import {
  businessBasicsFormSchema,
  businessLocationFormSchema,
  businessServicesFormSchema,
  businessTeamFormSchema,
  businessWorkstationsFormSchema,
} from "@/modules/businessSetup/businessSetup.schemas";
import { requireAuth } from "@/modules/auth/auth.middleware";
import { validateBody } from "@/middlewares/validateRequest";
import { asyncHandler } from "@/utils/asyncHandler";

const businessSetupRouter = Router();

businessSetupRouter.get(
  "/setup",
  asyncHandler(requireAuth),
  asyncHandler(getBusinessSetupController),
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
  "/setup/team",
  asyncHandler(requireAuth),
  validateBody(businessTeamFormSchema),
  asyncHandler(saveBusinessTeamController),
);

businessSetupRouter.patch(
  "/setup/workstations",
  asyncHandler(requireAuth),
  validateBody(businessWorkstationsFormSchema),
  asyncHandler(saveBusinessWorkstationsController),
);

businessSetupRouter.patch(
  "/setup/services",
  asyncHandler(requireAuth),
  validateBody(businessServicesFormSchema),
  asyncHandler(saveBusinessServicesController),
);

export { businessSetupRouter };
