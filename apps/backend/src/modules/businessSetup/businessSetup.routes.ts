import { Router } from "express";

import {
  getBusinessSetupController,
  saveBusinessBasicsController,
} from "@/modules/businessSetup/businessSetup.controller";
import { businessBasicsFormSchema } from "@/modules/businessSetup/businessSetup.schemas";
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

export { businessSetupRouter };
