import { z } from "zod";

export const businessSpecializations = [
  "NAILS",
  "BROWS_AND_LASHES",
  "MAKEUP",
] as const;

export const businessTypes = ["SOLO", "TEAM"] as const;

export const businessOnboardingStatuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export const businessSetupSteps = [
  "BUSINESS_BASICS",
  "LOCATION",
  "WORKSTATIONS",
  "SERVICES",
  "ADDONS",
  "TEAM",
  "TEAM_SERVICES",
  "AVAILABILITY",
  "BOOKING_RULES",
  "PUBLIC_PROFILE",
  "SUMMARY",
] as const;

export const businessSpecializationSchema = z.enum(businessSpecializations);
export const businessTypeSchema = z.enum(businessTypes);
export const businessOnboardingStatusSchema = z.enum(
  businessOnboardingStatuses,
);
export const businessSetupStepSchema = z.enum(businessSetupSteps);

export const businessSetupStateSchema = z.object({
  completedSteps: z.array(businessSetupStepSchema),
  currentStep: businessSetupStepSchema.nullable(),
  onboardingCompletedAt: z.string().datetime().nullable(),
  status: businessOnboardingStatusSchema,
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

export const businessSetupResponseSchema = z.object({
  basics: businessBasicsResponseSchema,
  setup: businessSetupStateSchema,
});

export type BusinessBasicsForm = z.infer<typeof businessBasicsFormSchema>;
export type BusinessBasicsResponse = z.infer<
  typeof businessBasicsResponseSchema
>;
export type BusinessOnboardingStatus = z.infer<
  typeof businessOnboardingStatusSchema
>;
export type BusinessSetupResponse = z.infer<typeof businessSetupResponseSchema>;
export type BusinessSetupState = z.infer<typeof businessSetupStateSchema>;
export type BusinessSetupStep = z.infer<typeof businessSetupStepSchema>;
export type BusinessSpecialization = z.infer<
  typeof businessSpecializationSchema
>;
export type BusinessType = z.infer<typeof businessTypeSchema>;
