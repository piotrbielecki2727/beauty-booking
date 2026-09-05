import { z } from "zod";

import { emailSchema } from "../account";
import {
  businessTeamMemberRoles,
  teamMemberNameRegex,
} from "../businessSetup";

export const businessTeamAccessStatuses = [
  "NO_ACCESS",
  "INVITED",
  "ACTIVE",
  "EXPIRED",
] as const;

export const businessTeamMemberListStatuses = [
  "ACTIVE",
  "DEACTIVATED",
] as const;

export const businessTeamAccessStatusSchema = z.enum(
  businessTeamAccessStatuses,
);

export const businessTeamMemberListStatusSchema = z.enum(
  businessTeamMemberListStatuses,
);

export const businessTeamMemberAccessSchema = z.discriminatedUnion("status", [
  z.object({
    acceptedAt: z.string().datetime().nullable(),
    email: emailSchema.nullable(),
    expiresAt: z.null(),
    invitationId: z.null(),
    inviteUrl: z.null(),
    sentAt: z.null(),
    status: z.literal("ACTIVE"),
  }),
  z.object({
    acceptedAt: z.null(),
    email: emailSchema,
    expiresAt: z.string().datetime(),
    invitationId: z.string().uuid(),
    inviteUrl: z.string(),
    sentAt: z.string().datetime(),
    status: z.literal("INVITED"),
  }),
  z.object({
    acceptedAt: z.null(),
    email: emailSchema,
    expiresAt: z.string().datetime(),
    invitationId: z.string().uuid(),
    inviteUrl: z.null(),
    sentAt: z.string().datetime(),
    status: z.literal("EXPIRED"),
  }),
  z.object({
    acceptedAt: z.null(),
    email: emailSchema.nullable(),
    expiresAt: z.null(),
    invitationId: z.null(),
    inviteUrl: z.null(),
    sentAt: z.null(),
    status: z.literal("NO_ACCESS"),
  }),
]);

const optionalBusinessTeamEmailSchema = emailSchema
  .nullable()
  .optional()
  .or(z.literal(""));

const optionalBusinessTeamPhoneNumberSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{9}$/.test(value),
    "validation.account.phone.invalid",
  )
  .nullable()
  .optional();

const nullableBirthdayPartSchema = z.number().int().nullable().optional();

const isValidBirthday = (month: number, day: number) => {
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
};

const businessTeamMemberMutationSchema = z
  .object({
    birthdayDay: nullableBirthdayPartSchema,
    birthdayMonth: nullableBirthdayPartSchema,
    email: optionalBusinessTeamEmailSchema,
    fullName: z
      .string()
      .trim()
      .min(2, "validation.business.team.fullNameMinLength")
      .max(80, "validation.business.team.fullNameMaxLength")
      .regex(teamMemberNameRegex, "validation.business.team.fullNameInvalid"),
    phoneNumber: optionalBusinessTeamPhoneNumberSchema,
    providesServices: z.boolean(),
    role: z.enum(businessTeamMemberRoles),
  })
  .superRefine((values, context) => {
    const hasBirthdayMonth =
      values.birthdayMonth !== null && values.birthdayMonth !== undefined;
    const hasBirthdayDay =
      values.birthdayDay !== null && values.birthdayDay !== undefined;

    if (!hasBirthdayMonth && !hasBirthdayDay) {
      return;
    }

    if (
      !hasBirthdayMonth ||
      !hasBirthdayDay ||
      !isValidBirthday(values.birthdayMonth ?? 0, values.birthdayDay ?? 0)
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.team.birthdayInvalid",
        path: ["birthdayDay"],
      });
    }
  });

export const businessTeamMemberSchema = z.object({
  access: businessTeamMemberAccessSchema,
  birthdayDay: z.number().int().nullable(),
  birthdayMonth: z.number().int().nullable(),
  createdAt: z.string().datetime(),
  deactivatedAt: z.string().datetime().nullable(),
  email: emailSchema.nullable(),
  fullName: z.string(),
  id: z.string().uuid(),
  phoneNumber: z.string().nullable(),
  providesServices: z.boolean(),
  role: z.enum(businessTeamMemberRoles),
});

export const businessTeamOwnerSchema = z.object({
  birthdayDay: z.number().int().nullable(),
  birthdayMonth: z.number().int().nullable(),
  email: emailSchema,
  fullName: z.string(),
  phoneNumber: z.string().nullable(),
  providesServices: z.boolean(),
});

export const businessTeamResponseSchema = z.object({
  owner: businessTeamOwnerSchema,
  teamMembers: z.array(businessTeamMemberSchema),
});

export const createBusinessTeamMemberRequestSchema =
  businessTeamMemberMutationSchema;

export const updateBusinessTeamMemberRequestSchema =
  businessTeamMemberMutationSchema;

export const updateBusinessTeamOwnerRequestSchema = z
  .object({
    birthdayDay: nullableBirthdayPartSchema,
    birthdayMonth: nullableBirthdayPartSchema,
    phoneNumber: optionalBusinessTeamPhoneNumberSchema,
    providesServices: z.boolean(),
  })
  .superRefine((values, context) => {
    const hasBirthdayMonth =
      values.birthdayMonth !== null && values.birthdayMonth !== undefined;
    const hasBirthdayDay =
      values.birthdayDay !== null && values.birthdayDay !== undefined;

    if (!hasBirthdayMonth && !hasBirthdayDay) {
      return;
    }

    if (
      !hasBirthdayMonth ||
      !hasBirthdayDay ||
      !isValidBirthday(values.birthdayMonth ?? 0, values.birthdayDay ?? 0)
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.team.birthdayInvalid",
        path: ["birthdayDay"],
      });
    }
  });

export const businessTeamInvitationSchema = z.object({
  email: emailSchema,
  expiresAt: z.string().datetime(),
  id: z.string().uuid(),
  inviteUrl: z.string(),
  sentAt: z.string().datetime(),
  teamMemberId: z.string().uuid(),
});

export const businessTeamMemberMutationResponseSchema = z.object({
  teamMemberId: z.string().uuid(),
});

export const businessTeamOwnerMutationResponseSchema = z.object({
  ok: z.literal(true),
});

export const createBusinessTeamInvitationResponseSchema = z.object({
  invitation: businessTeamInvitationSchema,
});

export const cancelBusinessTeamInvitationResponseSchema = z.object({
  invitationId: z.string().uuid(),
});

export const businessTeamInvitationPreviewSchema = z.object({
  businessName: z.string(),
  email: emailSchema,
  expiresAt: z.string().datetime(),
  fullName: z.string(),
  role: z.enum(businessTeamMemberRoles),
  sentAt: z.string().datetime(),
  status: z.enum(["PENDING", "ACCEPTED", "CANCELLED", "EXPIRED"]),
});

export const acceptBusinessTeamInvitationResponseSchema = z.object({
  role: z.enum(businessTeamMemberRoles),
});

export type BusinessTeamAccessStatus = z.infer<
  typeof businessTeamAccessStatusSchema
>;
export type BusinessTeamMemberListStatus = z.infer<
  typeof businessTeamMemberListStatusSchema
>;
export type BusinessTeamMember = z.infer<typeof businessTeamMemberSchema>;
export type BusinessTeamOwner = z.infer<typeof businessTeamOwnerSchema>;
export type BusinessTeamResponse = z.infer<typeof businessTeamResponseSchema>;
export type CreateBusinessTeamMemberRequest = z.infer<
  typeof createBusinessTeamMemberRequestSchema
>;
export type UpdateBusinessTeamMemberRequest = z.infer<
  typeof updateBusinessTeamMemberRequestSchema
>;
export type UpdateBusinessTeamOwnerRequest = z.infer<
  typeof updateBusinessTeamOwnerRequestSchema
>;
export type BusinessTeamMemberMutationResponse = z.infer<
  typeof businessTeamMemberMutationResponseSchema
>;
export type BusinessTeamOwnerMutationResponse = z.infer<
  typeof businessTeamOwnerMutationResponseSchema
>;
export type CreateBusinessTeamInvitationResponse = z.infer<
  typeof createBusinessTeamInvitationResponseSchema
>;
export type CancelBusinessTeamInvitationResponse = z.infer<
  typeof cancelBusinessTeamInvitationResponseSchema
>;
export type BusinessTeamInvitationPreview = z.infer<
  typeof businessTeamInvitationPreviewSchema
>;
export type AcceptBusinessTeamInvitationResponse = z.infer<
  typeof acceptBusinessTeamInvitationResponseSchema
>;
