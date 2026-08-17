import { Router } from "express";

import {
  accountLoginSchema,
  authRegistrationTokenSchema,
  authRegisterRequestSchema,
  authVerifyEmailRequestSchema,
} from "@/modules/auth/auth.schemas";
import {
  cancelRegistrationController,
  loginController,
  logoutController,
  meController,
  registerController,
  resendRegistrationCodeController,
  resumeRegistrationController,
  verifyEmailController,
} from "@/modules/auth/auth.controller";
import { requireAuth } from "@/modules/auth/auth.middleware";
import { validateBody } from "@/middlewares/validateRequest";
import { asyncHandler } from "@/utils/asyncHandler";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(authRegisterRequestSchema),
  asyncHandler(registerController),
);
authRouter.post(
  "/register/resume",
  validateBody(authRegistrationTokenSchema),
  asyncHandler(resumeRegistrationController),
);
authRouter.post(
  "/register/resend-code",
  validateBody(authRegistrationTokenSchema),
  asyncHandler(resendRegistrationCodeController),
);
authRouter.post(
  "/register/cancel",
  validateBody(authRegistrationTokenSchema),
  asyncHandler(cancelRegistrationController),
);
authRouter.post(
  "/verify-email",
  validateBody(authVerifyEmailRequestSchema),
  asyncHandler(verifyEmailController),
);
authRouter.post(
  "/login",
  validateBody(accountLoginSchema),
  asyncHandler(loginController),
);
authRouter.get("/me", asyncHandler(requireAuth), asyncHandler(meController));
authRouter.post(
  "/logout",
  asyncHandler(logoutController),
);

export { authRouter };
