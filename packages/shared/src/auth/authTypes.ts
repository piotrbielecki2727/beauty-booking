import type { z } from "zod";

import type { PublicAccount } from "../account";
import type { authResponseSchema, authTokensSchema } from "./authSchemas";

export type AuthTokens = z.infer<typeof authTokensSchema>;

export type AuthUser = PublicAccount;

export type AuthResponse = z.infer<typeof authResponseSchema>;
