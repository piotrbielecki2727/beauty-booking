import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "@/utils/apiError";

const errorMiddleware = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "ValidationError",
      issues: error.issues,
      message: "Nieprawidłowe dane wejściowe.",
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: "ApiError",
      message: error.message,
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    error: "InternalServerError",
    message: "Wystąpił nieoczekiwany błąd.",
  });
};

export { errorMiddleware };
