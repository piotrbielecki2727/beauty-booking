import type { AuthUser } from "@beauty-booking/shared";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
