import { z } from "zod";

import {
  accountRegistrationSchema,
  accountVerificationCodeSchema,
  accountValidationMessageKeys,
  emailSchema,
  publicAccountSchema,
} from "../account";

export const accountLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, accountValidationMessageKeys.password.required),
});

export const authRegisterRequestSchema = accountRegistrationSchema.transform(
  ({ confirmPassword, ...values }) => values,
);

export const authRegistrationTokenSchema = z.object({
  registrationToken: z.string().min(1),
});

export const authVerifyEmailRequestSchema = accountVerificationCodeSchema.extend(
  {
    registrationToken: authRegistrationTokenSchema.shape.registrationToken,
  },
);

export const authTokensSchema = z.object({
  accessToken: z.string().min(1),
});

export const authResponseSchema = z.object({
  tokens: authTokensSchema,
  user: publicAccountSchema,
});

export const authRegistrationStatusSchema = z.enum([
  "PENDING",
  "REGISTRATION_EXPIRED",
  "VERIFIED",
  "INVALID",
]);

const authRegistrationActiveResponseSchema = z.object({
  canResendAt: z.string().datetime().nullable(),
  codeExpiresAt: z.string().datetime(),
  email: emailSchema,
  remainingResends: z.number().int().min(0),
  registrationExpiresAt: z.string().datetime(),
  registrationToken: authRegistrationTokenSchema.shape.registrationToken,
  status: z.literal("PENDING"),
  verificationRequired: z.literal(true),
});

const authRegistrationClosedResponseSchema = z.object({
  email: emailSchema.optional(),
  status: z.enum(["REGISTRATION_EXPIRED", "VERIFIED", "INVALID"]),
  verificationRequired: z.literal(false),
});

export const authRegistrationFlowResponseSchema = z.discriminatedUnion(
  "status",
  [authRegistrationActiveResponseSchema, authRegistrationClosedResponseSchema],
);

export const authVerifyEmailResponseSchema = z.object({
  email: emailSchema,
  status: z.literal("VERIFIED"),
  verificationRequired: z.literal(false),
});

export type AccountLoginValues = z.infer<typeof accountLoginSchema>;
export type AuthRegistrationFlowResponse = z.infer<
  typeof authRegistrationFlowResponseSchema
>;
export type AuthRegistrationStatus = z.infer<typeof authRegistrationStatusSchema>;
export type AuthRegistrationTokenRequest = z.infer<
  typeof authRegistrationTokenSchema
>;
export type AuthRegisterRequestInput = z.input<typeof authRegisterRequestSchema>;
export type AuthRegisterRequest = z.output<typeof authRegisterRequestSchema>;
export type AuthVerifyEmailRequest = z.infer<typeof authVerifyEmailRequestSchema>;
export type AuthVerifyEmailResponse = z.infer<
  typeof authVerifyEmailResponseSchema
>;
