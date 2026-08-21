import { Router } from "express";

import {
  acceptBusinessTeamInvitationController,
  cancelBusinessTeamInvitationController,
  createBusinessTeamInvitationController,
  getBusinessTeamController,
  getBusinessTeamInvitationPreviewController,
} from "@/modules/businessTeam/businessTeam.controller";
import { createBusinessTeamInvitationRequestSchema } from "@/modules/businessTeam/businessTeam.schemas";
import { requireAuth } from "@/modules/auth/auth.middleware";
import { validateBody } from "@/middlewares/validateRequest";
import { asyncHandler } from "@/utils/asyncHandler";

const businessTeamRouter = Router();
const teamInvitationsRouter = Router();

businessTeamRouter.get(
  "/",
  asyncHandler(requireAuth),
  asyncHandler(getBusinessTeamController),
);

businessTeamRouter.post(
  "/members/:teamMemberId/invitations",
  asyncHandler(requireAuth),
  validateBody(createBusinessTeamInvitationRequestSchema),
  asyncHandler(createBusinessTeamInvitationController),
);

businessTeamRouter.post(
  "/invitations/:invitationId/cancel",
  asyncHandler(requireAuth),
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
