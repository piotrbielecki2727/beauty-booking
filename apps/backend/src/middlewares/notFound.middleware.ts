import type { Request, Response } from "express";

const notFoundMiddleware = (request: Request, response: Response) => {
  response.status(404).json({
    error: "NotFound",
    message: `Endpoint ${request.method} ${request.path} nie istnieje.`,
  });
};

export { notFoundMiddleware };
