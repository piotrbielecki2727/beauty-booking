import type { Request, Response } from "express";

import {
  cancelRegistration,
  getCurrentUser,
  login,
  register,
  resendRegistrationCode,
  resumeRegistration,
  verifyEmail,
} from "@/modules/auth/auth.service";
import { resolveTenantContextFromRequest } from "@/modules/tenant/tenant.service";
import { ApiError } from "@/utils/apiError";

const registerController = async (request: Request, response: Response) => {
  const tenantContext = await resolveTenantContextFromRequest(request);
  const result = await register(request.body, tenantContext.business.id);

  response.status(201).json(result);
};

const resumeRegistrationController = async (
  request: Request,
  response: Response,
) => {
  const result = await resumeRegistration(request.body);
  response.json(result);
};

const resendRegistrationCodeController = async (
  request: Request,
  response: Response,
) => {
  const result = await resendRegistrationCode(request.body);
  response.json(result);
};

const cancelRegistrationController = async (
  request: Request,
  response: Response,
) => {
  await cancelRegistration(request.body);
  response.status(204).send();
};

const verifyEmailController = async (request: Request, response: Response) => {
  const result = await verifyEmail(request.body);
  response.json(result);
};

const loginController = async (request: Request, response: Response) => {
  const tenantContext = await resolveTenantContextFromRequest(request);
  const result = await login(request.body, tenantContext.business.id);

  response.json(result);
};

const meController = async (request: Request, response: Response) => {
  if (!request.user) {
    throw new ApiError(401, "Brak aktywnej sesji.");
  }

  const user = await getCurrentUser(request.user.id);
  response.json({ user });
};

const logoutController = async (_request: Request, response: Response) => {
  response.status(204).send();
};

export {
  cancelRegistrationController,
  loginController,
  logoutController,
  meController,
  registerController,
  resendRegistrationCodeController,
  resumeRegistrationController,
  verifyEmailController,
};
