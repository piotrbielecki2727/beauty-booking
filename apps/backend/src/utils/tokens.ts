import jwt from "jsonwebtoken";

import type { AuthUser } from "@beauty-booking/shared";
import { env } from "@/config/env";

type AccessTokenPayload = {
  businessId: string;
  email: string;
  role: AuthUser["role"];
  sub: string;
};

type RegistrationTokenPayload = {
  purpose: "email-verification";
  sub: string;
};

type RegistrationTokenResult =
  | {
      status: "valid";
      userId: string;
    }
  | {
      status: "expired" | "invalid";
    };

const signAccessToken = (user: AuthUser) =>
  jwt.sign(
    {
      businessId: user.businessId,
      email: user.email,
      role: user.role,
      sub: user.id,
    } satisfies AccessTokenPayload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    },
  );

const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

const signRegistrationToken = (userId: string) =>
  jwt.sign(
    {
      purpose: "email-verification",
      sub: userId,
    } satisfies RegistrationTokenPayload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );

const verifyRegistrationToken = (
  token: string,
): RegistrationTokenResult => {
  try {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as Partial<RegistrationTokenPayload>;

    if (payload.purpose !== "email-verification" || !payload.sub) {
      return {
        status: "invalid",
      };
    }

    return {
      status: "valid",
      userId: payload.sub,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        status: "expired",
      };
    }

    return {
      status: "invalid",
    };
  }
};

export {
  signAccessToken,
  signRegistrationToken,
  verifyAccessToken,
  verifyRegistrationToken,
};
export type {
  AccessTokenPayload,
  RegistrationTokenPayload,
  RegistrationTokenResult,
};
