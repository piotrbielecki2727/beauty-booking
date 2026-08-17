import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getCurrentUser } from "@/modules/auth/auth.service";
import { ApiError } from "@/utils/apiError";
import { verifyAccessToken } from "@/utils/tokens";

const getBearerToken = (authorizationHeader: string | undefined) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorizationHeader.slice("Bearer ".length);
};

const requireAuth = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  try {
    const token = getBearerToken(request.headers.authorization);

    if (!token) {
      throw new ApiError(401, "Brak tokenu autoryzacyjnego.");
    }

    const payload = verifyAccessToken(token);
    request.user = await getCurrentUser(payload.sub);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, "Sesja wygasła. Zaloguj się ponownie."));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Token autoryzacyjny jest nieprawidłowy."));
      return;
    }

    next(error);
  }
};

export { requireAuth };
