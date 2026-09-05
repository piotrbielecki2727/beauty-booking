import { z } from "zod";

import { emailSchema } from "../account";
import type { AccountRole } from "../roles";

export const businessSpecializations = [
  "NAILS",
  "BROWS_AND_LASHES",
  "MAKEUP",
] as const;

export const businessTeamMemberRoles = [
  "Manager",
  "Employee",
  "Intern",
] as const satisfies readonly AccountRole[];

export const businessTypes = ["SOLO", "TEAM"] as const;
export const businessAvailabilityModes = [
  "FIXED_HOURS",
  "INDIVIDUAL_SCHEDULES",
] as const;
export const businessBookingReleaseModes = [
  "ROLLING",
  "MANUAL",
] as const;
export const businessBookingConfirmationModes = [
  "AUTOMATIC",
  "MANUAL",
] as const;
export const businessMobileServiceFeeTypes = [
  "FREE",
  "FIXED",
  "CUSTOM",
] as const;
export const businessWeekdays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const businessOnboardingStatuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export const businessSetupSteps = [
  "BUSINESS_BASICS",
  "LOCATION",
  "TEAM",
  "SERVICES",
  "ADDONS",
  "TEAM_SERVICES",
  "AVAILABILITY",
  "BOOKING_RULES",
  "PUBLIC_PROFILE",
  "SUMMARY",
] as const;

export const businessSetupCompletionRequiredSteps = [
  "BUSINESS_BASICS",
  "LOCATION",
  "PUBLIC_PROFILE",
] as const;

export const businessSpecializationSchema = z.enum(businessSpecializations);
export const businessTypeSchema = z.enum(businessTypes);
export const businessAvailabilityModeSchema = z.enum(
  businessAvailabilityModes,
);
export const businessBookingReleaseModeSchema = z.enum(
  businessBookingReleaseModes,
);
export const businessBookingConfirmationModeSchema = z.enum(
  businessBookingConfirmationModes,
);
export const businessMobileServiceFeeTypeSchema = z.enum(
  businessMobileServiceFeeTypes,
);
export const businessWeekdaySchema = z.enum(businessWeekdays);
export const businessTypeFormSchema = z.object({
  businessType: businessTypeSchema,
});
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

const optionalSocialProfileSchema = (allowedHosts: string[]) =>
  z
    .string()
    .trim()
    .max(200, "validation.business.socialProfileMaxLength")
    .refine((value) => {
      if (!value) {
        return true;
      }

      try {
        const url = new URL(
          /^https?:\/\//i.test(value) ? value : `https://${value}`,
        );
        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

        return allowedHosts.some(
          (host) => hostname === host || hostname.endsWith(`.${host}`),
        );
      } catch {
        return false;
      }
    }, "validation.business.socialProfileInvalid")
    .optional()
    .or(z.literal(""));

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

export const businessSetupStatusResponseSchema = z.object({
  businessType: businessTypeSchema.nullable(),
  status: businessOnboardingStatusSchema,
});

const businessBasicsBaseSchema = z.object({
  name: z.string().trim().min(2, "validation.business.nameMinLength"),
  specializations: z
    .array(businessSpecializationSchema)
    .min(1, "validation.business.specializationsRequired")
    .max(businessSpecializations.length)
    .refine(
      (values) => new Set(values).size === values.length,
      "validation.business.specializationsUnique",
    ),
});

export const businessBasicsFormSchema = businessBasicsBaseSchema.extend({
  businessType: businessTypeSchema,
});

export const businessDetailsFormSchema = z.object({
  contactEmail: emailSchema.optional().or(z.literal("")),
  contactPhone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "validation.account.phone.invalid")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(500, "validation.business.profileDescriptionMaxLength")
    .optional()
    .or(z.literal("")),
  facebookUrl: optionalSocialProfileSchema(["facebook.com", "fb.com"]),
  instagramUrl: optionalSocialProfileSchema(["instagram.com"]),
  pinterestUrl: optionalSocialProfileSchema(["pinterest.com", "pin.it"]),
  tiktokUrl: optionalSocialProfileSchema(["tiktok.com"]),
  youtubeUrl: optionalSocialProfileSchema(["youtube.com", "youtu.be"]),
});

export const businessBasicsResponseSchema = z.object({
  availabilityMode: businessAvailabilityModeSchema.nullable(),
  businessType: businessTypeSchema.nullable(),
  name: z.string().min(1),
  ownerProvidesServices: z.boolean().nullable(),
  specializations: z.array(businessSpecializationSchema),
});

export const businessPublicProfileResponseSchema = z.object({
  contactEmail: z.string().nullable(),
  contactPhone: z.string().nullable(),
  description: z.string().nullable(),
  facebookUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
  pinterestUrl: z.string().nullable(),
  tiktokUrl: z.string().nullable(),
  youtubeUrl: z.string().nullable(),
});

const businessAddressSchema = z.object({
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
    .max(60, "validation.business.location.streetMaxLength")
    .refine(
      (value) => value === "" || value.length >= 2,
      "validation.business.location.streetMinLength",
    )
    .refine(
      (value) => value === "" || streetCharactersRegex.test(value),
      "validation.business.location.streetInvalid",
    ),
});

const optionalNumericTextSchema = z.string().trim();

export const businessLocationFormSchema = businessAddressSchema
  .extend({
    mobileServiceFeeType: businessMobileServiceFeeTypeSchema,
    mobileServiceFixedFee: optionalNumericTextSchema,
    mobileServiceMaxDistanceKm: optionalNumericTextSchema,
    mobileServicesEnabled: z.boolean(),
    mobileServiceTravelTimeMinutes: optionalNumericTextSchema,
  })
  .superRefine((values, context) => {
    if (!values.mobileServicesEnabled) {
      return;
    }

    const maxDistanceKm = Number(values.mobileServiceMaxDistanceKm);
    const travelTimeMinutes = Number(values.mobileServiceTravelTimeMinutes);

    if (
      !/^\d+$/.test(values.mobileServiceMaxDistanceKm) ||
      maxDistanceKm < 1 ||
      maxDistanceKm > 200
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.location.mobileServiceMaxDistanceInvalid",
        path: ["mobileServiceMaxDistanceKm"],
      });
    }

    if (
      !/^\d+$/.test(values.mobileServiceTravelTimeMinutes) ||
      travelTimeMinutes < 5 ||
      travelTimeMinutes > 240
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.location.mobileServiceTravelTimeInvalid",
        path: ["mobileServiceTravelTimeMinutes"],
      });
    }

    if (values.mobileServiceFeeType !== "FIXED") {
      return;
    }

    const normalizedFee = values.mobileServiceFixedFee.replace(",", ".");
    const fixedFee = Number(normalizedFee);

    if (
      !/^\d+(?:[.,]\d{1,2})?$/.test(values.mobileServiceFixedFee) ||
      fixedFee <= 0 ||
      fixedFee > 10_000
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.location.mobileServiceFixedFeeInvalid",
        path: ["mobileServiceFixedFee"],
      });
    }
  });

export const businessLocationResponseSchema = z.object({
  apartmentNumber: z.string().nullable(),
  buildingNumber: z.string().nullable(),
  city: z.string().nullable(),
  locationNote: z.string().nullable(),
  mobileServiceFeeType: businessMobileServiceFeeTypeSchema.nullable(),
  mobileServiceFixedFee: z.string(),
  mobileServiceMaxDistanceKm: z.number().int().nullable(),
  mobileServicesEnabled: z.boolean(),
  mobileServiceTravelTimeMinutes: z.number().int().nullable(),
  parkingNote: z.string().nullable(),
  postalCode: z.string().nullable(),
  street: z.string().nullable(),
});

const businessOpeningTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "validation.business.openingHours.timeInvalid");

const closedBusinessOpeningHourSchema = z.object({
  closesAt: z.literal(""),
  dayOfWeek: businessWeekdaySchema,
  isOpen: z.literal(false),
  opensAt: z.literal(""),
});

const openBusinessOpeningHourSchema = z
  .object({
    closesAt: businessOpeningTimeSchema,
    dayOfWeek: businessWeekdaySchema,
    isOpen: z.literal(true),
    opensAt: businessOpeningTimeSchema,
  })
  .refine(({ closesAt, opensAt }) => closesAt > opensAt, {
    message: "validation.business.openingHours.closesAfterOpening",
    path: ["closesAt"],
  });

export const businessOpeningHourSchema = z.discriminatedUnion("isOpen", [
  closedBusinessOpeningHourSchema,
  openBusinessOpeningHourSchema,
]);

export const businessOpeningHoursFormSchema = z
  .object({
    openingHours: z
      .array(businessOpeningHourSchema)
      .length(
        businessWeekdays.length,
        "validation.business.openingHours.allDaysRequired",
      ),
  })
  .refine(
    ({ openingHours }) =>
      new Set(openingHours.map(({ dayOfWeek }) => dayOfWeek)).size ===
        businessWeekdays.length &&
      businessWeekdays.every((dayOfWeek) =>
        openingHours.some((item) => item.dayOfWeek === dayOfWeek),
      ),
    {
      message: "validation.business.openingHours.allDaysRequired",
      path: ["openingHours"],
    },
  );

export const businessOpeningHoursResponseSchema = z.array(
  businessOpeningHourSchema,
);

const bookingRulesIntegerSchema = ({
  maximum,
  message,
  minimum,
}: {
  maximum: number;
  message: string;
  minimum: number;
}) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, message)
    .refine(
      (value) => Number(value) >= minimum && Number(value) <= maximum,
      message,
    );

const businessBookingRulesBaseSchema = z.object({
  allowAnyTeamMember: z.boolean(),
  allowSpecificTeamMember: z.boolean(),
  cancellationDeadlineHours: bookingRulesIntegerSchema({
    maximum: 720,
    message: "validation.business.bookingRules.cancellationDeadlineInvalid",
    minimum: 0,
  }),
  inSalonConfirmationMode: businessBookingConfirmationModeSchema,
  minimumAdvanceMinutes: bookingRulesIntegerSchema({
    maximum: 43_200,
    message: "validation.business.bookingRules.minimumAdvanceInvalid",
    minimum: 0,
  }),
});

const rollingBusinessBookingRulesSchema = businessBookingRulesBaseSchema.extend({
  bookingHorizonDays: bookingRulesIntegerSchema({
    maximum: 730,
    message: "validation.business.bookingRules.bookingHorizonInvalid",
    minimum: 1,
  }),
  bookingReleaseMode: z.literal("ROLLING"),
});

const manualBusinessBookingRulesSchema = businessBookingRulesBaseSchema.extend({
  bookingHorizonDays: z.literal(""),
  bookingReleaseMode: z.literal("MANUAL"),
});

export const businessBookingRulesFormSchema = z.discriminatedUnion(
  "bookingReleaseMode",
  [
    rollingBusinessBookingRulesSchema,
    manualBusinessBookingRulesSchema,
  ],
);

export const businessBookingRulesResponseSchema =
  businessBookingRulesFormSchema.nullable();

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
  bookingRules: businessBookingRulesResponseSchema,
  location: businessLocationResponseSchema,
  openingHours: businessOpeningHoursResponseSchema,
  publicProfile: businessPublicProfileResponseSchema,
  services: businessServicesResponseSchema,
  setup: businessSetupStateSchema,
  teamMembers: businessSetupTeamResponseSchema,
});

export type BusinessBasicsForm = z.infer<typeof businessBasicsFormSchema>;
export type BusinessDetailsForm = z.infer<typeof businessDetailsFormSchema>;
export type BusinessAvailabilityMode = z.infer<
  typeof businessAvailabilityModeSchema
>;
export type BusinessBookingRulesForm = z.infer<
  typeof businessBookingRulesFormSchema
>;
export type BusinessBookingConfirmationMode = z.infer<
  typeof businessBookingConfirmationModeSchema
>;
export type BusinessBookingReleaseMode = z.infer<
  typeof businessBookingReleaseModeSchema
>;
export type BusinessBasicsResponse = z.infer<
  typeof businessBasicsResponseSchema
>;
export type BusinessLocationForm = z.infer<typeof businessLocationFormSchema>;
export type BusinessLocationResponse = z.infer<
  typeof businessLocationResponseSchema
>;
export type BusinessPublicProfileResponse = z.infer<
  typeof businessPublicProfileResponseSchema
>;
export type BusinessOnboardingStatus = z.infer<
  typeof businessOnboardingStatusSchema
>;
export type BusinessOpeningHour = z.infer<typeof businessOpeningHourSchema>;
export type BusinessOpeningHoursForm = z.infer<
  typeof businessOpeningHoursFormSchema
>;
export type BusinessWeekday = z.infer<typeof businessWeekdaySchema>;
export type BusinessSetupResponse = z.infer<typeof businessSetupResponseSchema>;
export type BusinessSetupState = z.infer<typeof businessSetupStateSchema>;
export type BusinessSetupStatusResponse = z.infer<
  typeof businessSetupStatusResponseSchema
>;
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
export type BusinessMobileServiceFeeType = z.infer<
  typeof businessMobileServiceFeeTypeSchema
>;
export type BusinessSpecialization = z.infer<
  typeof businessSpecializationSchema
>;
export type BusinessType = z.infer<typeof businessTypeSchema>;
export type BusinessTypeForm = z.infer<typeof businessTypeFormSchema>;
