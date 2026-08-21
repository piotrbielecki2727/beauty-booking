import { z } from "zod";

import type { AccountRole } from "../roles";

export const businessSpecializations = [
  "NAILS",
  "BROWS_AND_LASHES",
  "MAKEUP",
] as const;

export const serviceWorkstationTypes = [
  "ANY",
  ...businessSpecializations,
] as const;

export const businessTeamMemberRoles = [
  "Manager",
  "Employee",
  "Intern",
] as const satisfies readonly AccountRole[];

export const businessTypes = ["SOLO", "TEAM"] as const;

export const businessOnboardingStatuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export const businessSetupSteps = [
  "BUSINESS_BASICS",
  "LOCATION",
  "TEAM",
  "WORKSTATIONS",
  "SERVICES",
  "ADDONS",
  "TEAM_SERVICES",
  "AVAILABILITY",
  "BOOKING_RULES",
  "PUBLIC_PROFILE",
  "SUMMARY",
] as const;

export const businessSpecializationSchema = z.enum(businessSpecializations);
export const serviceWorkstationTypeSchema = z.enum(serviceWorkstationTypes);
export const businessTypeSchema = z.enum(businessTypes);
export const businessOnboardingStatusSchema = z.enum(
  businessOnboardingStatuses,
);
export const businessSetupStepSchema = z.enum(businessSetupSteps);

const optionalBusinessSetupTextSchema = (maxLength: number, message: string) =>
  z.string().trim().max(maxLength, message).optional().or(z.literal(""));

const cityCharactersRegex = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż -]+$/u;
const cityStartsWithUppercaseRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ]/u;
const streetCharactersRegex = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .-]+$/u;
const buildingNumberRegex = /^\d+[A-Za-z]?$/;
const apartmentNumberRegex = /^[1-9]\d{0,3}$/;
const postalCodeRegex = /^\d{2}-\d{3}$/;
const noteCharactersRegex = /^[\p{L}\p{N}\s.,;:!?'"()/-]+$/u;
const linkRegex = /(https?:\/\/|www\.)/i;
const serviceNameRegex = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 -]{2,60}$/u;
const teamMemberNameRegex = /^[\p{L}\p{M}'\u2019 -]{2,80}$/u;

const optionalBusinessSetupPatternTextSchema = ({
  invalidMessage,
  maxLength,
  maxLengthMessage,
  pattern,
}: {
  invalidMessage: string;
  maxLength: number;
  maxLengthMessage: string;
  pattern: RegExp;
}) =>
  z
    .string()
    .trim()
    .max(maxLength, maxLengthMessage)
    .regex(pattern, invalidMessage)
    .optional()
    .or(z.literal(""));

const optionalBusinessSetupNoteSchema = (maxLengthMessage: string) =>
  z
    .string()
    .trim()
    .max(500, maxLengthMessage)
    .refine(
      (value) => value === "" || noteCharactersRegex.test(value),
      "validation.business.location.noteInvalid",
    )
    .refine(
      (value) => !linkRegex.test(value),
      "validation.business.location.noteInvalid",
    )
    .optional()
    .or(z.literal(""));

export const businessSetupStateSchema = z.object({
  status: businessOnboardingStatusSchema,
  currentStep: businessSetupStepSchema.nullable(),
  completedSteps: z.array(businessSetupStepSchema),
  onboardingCompletedAt: z.string().datetime().nullable(),
});

const businessBasicsBaseSchema = z.object({
  name: z.string().trim().min(2, "validation.business.nameMinLength"),
  specialization: businessSpecializationSchema,
});

export const businessBasicsFormSchema = z.discriminatedUnion("businessType", [
  businessBasicsBaseSchema.extend({
    businessType: z.literal("SOLO"),
    ownerProvidesServices: z.literal(true),
  }),
  businessBasicsBaseSchema.extend({
    businessType: z.literal("TEAM"),
    ownerProvidesServices: z.boolean({
      error: "validation.business.ownerProvidesServicesRequired",
    }),
  }),
]);

export const businessBasicsResponseSchema = z.object({
  businessType: businessTypeSchema.nullable(),
  name: z.string().min(1),
  ownerProvidesServices: z.boolean().nullable(),
  specialization: businessSpecializationSchema.nullable(),
});

export const businessLocationFormSchema = z.object({
  apartmentNumber: optionalBusinessSetupPatternTextSchema({
    invalidMessage: "validation.business.location.apartmentNumberInvalid",
    maxLength: 4,
    maxLengthMessage: "validation.business.location.apartmentNumberMaxLength",
    pattern: apartmentNumberRegex,
  }),
  buildingNumber: z
    .string()
    .trim()
    .min(1, "validation.business.location.buildingNumberRequired")
    .max(6, "validation.business.location.buildingNumberMaxLength")
    .regex(
      buildingNumberRegex,
      "validation.business.location.buildingNumberInvalid",
    ),
  city: z
    .string()
    .trim()
    .min(2, "validation.business.location.cityMinLength")
    .max(50, "validation.business.location.cityMaxLength")
    .regex(cityCharactersRegex, "validation.business.location.cityInvalid")
    .regex(
      cityStartsWithUppercaseRegex,
      "validation.business.location.cityCapitalized",
    ),
  locationNote: optionalBusinessSetupNoteSchema(
    "validation.business.location.locationNoteMaxLength",
  ),
  parkingNote: optionalBusinessSetupNoteSchema(
    "validation.business.location.parkingNoteMaxLength",
  ),
  postalCode: z
    .string()
    .trim()
    .regex(postalCodeRegex, "validation.business.location.postalCodeInvalid"),
  street: z
    .string()
    .trim()
    .min(2, "validation.business.location.streetMinLength")
    .max(60, "validation.business.location.streetMaxLength")
    .regex(streetCharactersRegex, "validation.business.location.streetInvalid"),
});

export const businessLocationResponseSchema = z.object({
  apartmentNumber: z.string().nullable(),
  buildingNumber: z.string().nullable(),
  city: z.string().nullable(),
  locationNote: z.string().nullable(),
  parkingNote: z.string().nullable(),
  postalCode: z.string().nullable(),
  street: z.string().nullable(),
});

export const businessWorkstationFormItemSchema = z.object({
  id: z.string().uuid().optional(),
  isActive: z.boolean(),
  name: z
    .string()
    .trim()
    .min(2, "validation.business.workstations.nameMinLength")
    .max(80, "validation.business.workstations.nameMaxLength"),
  note: optionalBusinessSetupTextSchema(
    300,
    "validation.business.workstations.noteMaxLength",
  ),
  type: businessSpecializationSchema,
});

export const businessWorkstationsFormSchema = z.object({
  workstations: z
    .array(businessWorkstationFormItemSchema)
    .min(1, "validation.business.workstations.minItems")
    .max(30, "validation.business.workstations.maxItems"),
});

export const businessWorkstationResponseSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
  name: z.string(),
  note: z.string().nullable(),
  type: businessSpecializationSchema,
});

export const businessWorkstationsResponseSchema = z.array(
  businessWorkstationResponseSchema,
);

export const businessServiceFormItemSchema = z.object({
  description: optionalBusinessSetupTextSchema(
    500,
    "validation.business.services.descriptionMaxLength",
  ),
  durationMinutes: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, "validation.business.services.durationInvalid")
    .refine(
      (value) => Number(value) >= 1 && Number(value) <= 600,
      "validation.business.services.durationMax",
    ),
  id: z.string().uuid().optional(),
  isActive: z.boolean(),
  name: z
    .string()
    .trim()
    .min(2, "validation.business.services.nameMinLength")
    .max(60, "validation.business.services.nameMaxLength")
    .regex(serviceNameRegex, "validation.business.services.nameInvalid"),
  price: z
    .string()
    .trim()
    .regex(
      /^\d{1,4}([,.]\d{1,2})?$/,
      "validation.business.services.priceInvalid",
    )
    .refine(
      (value) => Number(value.replace(",", ".")) <= 9999.99,
      "validation.business.services.priceMax",
    ),
  specialization: businessSpecializationSchema,
  workstationType: serviceWorkstationTypeSchema,
});

export const businessServicesFormSchema = z.object({
  services: z
    .array(businessServiceFormItemSchema)
    .min(1, "validation.business.services.minItems")
    .max(100, "validation.business.services.maxItems"),
});

export const businessServiceResponseSchema = z.object({
  description: z.string().nullable(),
  durationMinutes: z.number().int(),
  id: z.string().uuid(),
  isActive: z.boolean(),
  name: z.string(),
  priceAmount: z.number().int(),
  specialization: businessSpecializationSchema,
  workstationType: businessSpecializationSchema.nullable(),
});

export const businessServicesResponseSchema = z.array(
  businessServiceResponseSchema,
);

const optionalBusinessTeamMemberEmailSchema = z
  .string()
  .trim()
  .email("validation.business.team.emailInvalid")
  .optional()
  .or(z.literal(""));

export const businessTeamMemberFormItemSchema = z.object({
  email: optionalBusinessTeamMemberEmailSchema,
  fullName: z
    .string()
    .trim()
    .min(2, "validation.business.team.fullNameMinLength")
    .max(80, "validation.business.team.fullNameMaxLength")
    .regex(teamMemberNameRegex, "validation.business.team.fullNameInvalid"),
  id: z.string().uuid().optional(),
  providesServices: z.boolean(),
  role: z.enum(businessTeamMemberRoles),
});

export const businessTeamFormSchema = z
  .object({
    teamMembers: z
      .array(businessTeamMemberFormItemSchema)
      .max(50, "validation.business.team.maxItems"),
  })
  .superRefine((values, context) => {
    const emailIndexes = new Map<string, number>();

    values.teamMembers.forEach((member, index) => {
      const normalizedEmail = member.email?.trim().toLowerCase();

      if (!normalizedEmail) {
        return;
      }

      const duplicateIndex = emailIndexes.get(normalizedEmail);

      if (duplicateIndex === undefined) {
        emailIndexes.set(normalizedEmail, index);
        return;
      }

      context.addIssue({
        code: "custom",
        message: "validation.business.team.emailDuplicate",
        path: ["teamMembers", index, "email"],
      });
    });
  });

export const businessTeamMemberResponseSchema = z.object({
  email: z.string(),
  fullName: z.string(),
  id: z.string().uuid(),
  providesServices: z.boolean(),
  role: z.enum(businessTeamMemberRoles),
});

export const businessSetupTeamResponseSchema = z.array(
  businessTeamMemberResponseSchema,
);

export const businessSetupResponseSchema = z.object({
  basics: businessBasicsResponseSchema,
  location: businessLocationResponseSchema,
  services: businessServicesResponseSchema,
  setup: businessSetupStateSchema,
  teamMembers: businessSetupTeamResponseSchema,
  workstations: businessWorkstationsResponseSchema,
});

export type BusinessBasicsForm = z.infer<typeof businessBasicsFormSchema>;
export type BusinessBasicsResponse = z.infer<
  typeof businessBasicsResponseSchema
>;
export type BusinessLocationForm = z.infer<typeof businessLocationFormSchema>;
export type BusinessLocationResponse = z.infer<
  typeof businessLocationResponseSchema
>;
export type BusinessOnboardingStatus = z.infer<
  typeof businessOnboardingStatusSchema
>;
export type BusinessSetupResponse = z.infer<typeof businessSetupResponseSchema>;
export type BusinessSetupState = z.infer<typeof businessSetupStateSchema>;
export type BusinessSetupStep = z.infer<typeof businessSetupStepSchema>;
export type BusinessTeamForm = z.infer<typeof businessTeamFormSchema>;
export type BusinessTeamMemberFormItem = z.infer<
  typeof businessTeamMemberFormItemSchema
>;
export type BusinessTeamMemberResponse = z.infer<
  typeof businessTeamMemberResponseSchema
>;
export type BusinessTeamMemberRole = (typeof businessTeamMemberRoles)[number];
export type BusinessServiceFormItem = z.infer<
  typeof businessServiceFormItemSchema
>;
export type BusinessServiceResponse = z.infer<
  typeof businessServiceResponseSchema
>;
export type BusinessServicesForm = z.infer<typeof businessServicesFormSchema>;
export type BusinessSpecialization = z.infer<
  typeof businessSpecializationSchema
>;
export type BusinessType = z.infer<typeof businessTypeSchema>;
export type BusinessWorkstationFormItem = z.infer<
  typeof businessWorkstationFormItemSchema
>;
export type BusinessWorkstationResponse = z.infer<
  typeof businessWorkstationResponseSchema
>;
export type BusinessWorkstationsForm = z.infer<
  typeof businessWorkstationsFormSchema
>;
export type ServiceWorkstationType = z.infer<
  typeof serviceWorkstationTypeSchema
>;
