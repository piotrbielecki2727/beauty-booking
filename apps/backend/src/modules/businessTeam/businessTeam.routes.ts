import { Router } from "express";

import {
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
} from "@/modules/businessTeam/businessTeam.controller";
import {
  createBusinessTeamMemberRequestSchema,
  updateBusinessTeamMemberRequestSchema,
  updateBusinessTeamOwnerRequestSchema,
} from "@/modules/businessTeam/businessTeam.schemas";
import { requireAuth } from "@/modules/auth/auth.middleware";
import {
  requireCompletedBusinessSetup,
  requireTeamBusiness,
} from "@/modules/businessSetup/businessSetup.middleware";
import { validateBody } from "@/middlewares/validateRequest";
import { asyncHandler } from "@/utils/asyncHandler";

const businessTeamRouter = Router();
const teamInvitationsRouter = Router();

businessTeamRouter.use(
  asyncHandler(requireAuth),
  asyncHandler(requireCompletedBusinessSetup),
  asyncHandler(requireTeamBusiness),
);

businessTeamRouter.get(
  "/",
  asyncHandler(getBusinessTeamController),
);

businessTeamRouter.post(
  "/members",
  validateBody(createBusinessTeamMemberRequestSchema),
  asyncHandler(createBusinessTeamMemberController),
);

businessTeamRouter.patch(
  "/owner",
  validateBody(updateBusinessTeamOwnerRequestSchema),
  asyncHandler(updateBusinessTeamOwnerController),
);

businessTeamRouter.patch(
  "/members/:teamMemberId",
  validateBody(updateBusinessTeamMemberRequestSchema),
  asyncHandler(updateBusinessTeamMemberController),
);

businessTeamRouter.post(
  "/members/:teamMemberId/deactivate",
  asyncHandler(deactivateBusinessTeamMemberController),
);

businessTeamRouter.post(
  "/members/:teamMemberId/reactivate",
  asyncHandler(reactivateBusinessTeamMemberController),
);

businessTeamRouter.post(
  "/members/:teamMemberId/invitations",
  asyncHandler(createBusinessTeamInvitationController),
);

businessTeamRouter.post(
  "/invitations/:invitationId/cancel",
  asyncHandler(cancelBusinessTeamInvitationController),
);

teamInvitationsRouter.get(
  "/:token",
  asyncHandler(getBusinessTeamInvitationPreviewController),
);

teamInvitationsRouter.post(
  "/:token/accept",
  asyncHandler(requireAuth),
  asyncHandler(acceptBusinessTeamInvitationController),
);

export { businessTeamRouter, teamInvitationsRouter };
