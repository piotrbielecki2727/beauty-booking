import type { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler =
  (handler: AsyncRouteHandler) =>
  (request: Request, response: Response, next: NextFunction) => {
    handler(request, response, next).catch(next);
  };

export { asyncHandler };
