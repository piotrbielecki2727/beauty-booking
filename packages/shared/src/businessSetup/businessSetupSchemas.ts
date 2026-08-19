import { z } from "zod";

export const businessSpecializations = [
  "NAILS",
  "BROWS_AND_LASHES",
  "MAKEUP",
] as const;

export const serviceWorkstationTypes = [
  "ANY",
  ...businessSpecializations,
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
export const serviceWorkstationTypeSchema = z.enum(serviceWorkstationTypes);
export const businessTypeSchema = z.enum(businessTypes);
export const businessOnboardingStatusSchema = z.enum(
  businessOnboardingStatuses,
);
export const businessSetupStepSchema = z.enum(businessSetupSteps);

const optionalBusinessSetupTextSchema = (maxLength: number, message: string) =>
  z.string().trim().max(maxLength, message).optional().or(z.literal(""));

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
  apartmentNumber: optionalBusinessSetupTextSchema(
    20,
    "validation.business.location.apartmentNumberMaxLength",
  ),
  buildingNumber: z
    .string()
    .trim()
    .min(1, "validation.business.location.buildingNumberRequired")
    .max(20, "validation.business.location.buildingNumberMaxLength"),
  city: z
    .string()
    .trim()
    .min(2, "validation.business.location.cityMinLength")
    .max(80, "validation.business.location.cityMaxLength"),
  locationNote: optionalBusinessSetupTextSchema(
    500,
    "validation.business.location.locationNoteMaxLength",
  ),
  parkingNote: optionalBusinessSetupTextSchema(
    500,
    "validation.business.location.parkingNoteMaxLength",
  ),
  postalCode: z
    .string()
    .trim()
    .min(3, "validation.business.location.postalCodeMinLength")
    .max(16, "validation.business.location.postalCodeMaxLength"),
  street: z
    .string()
    .trim()
    .min(2, "validation.business.location.streetMinLength")
    .max(120, "validation.business.location.streetMaxLength"),
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
    .regex(/^[1-9]\d{0,3}$/, "validation.business.services.durationInvalid")
    .refine(
      (value) => Number(value) <= 1440,
      "validation.business.services.durationMax",
    ),
  id: z.string().uuid().optional(),
  isActive: z.boolean(),
  name: z
    .string()
    .trim()
    .min(2, "validation.business.services.nameMinLength")
    .max(100, "validation.business.services.nameMaxLength"),
  price: z
    .string()
    .trim()
    .regex(
      /^\d{1,5}([,.]\d{1,2})?$/,
      "validation.business.services.priceInvalid",
    )
    .refine(
      (value) => Number(value.replace(",", ".")) > 0,
      "validation.business.services.priceMin",
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

export const businessSetupResponseSchema = z.object({
  basics: businessBasicsResponseSchema,
  location: businessLocationResponseSchema,
  services: businessServicesResponseSchema,
  setup: businessSetupStateSchema,
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
