import { z } from "zod";

import type {
  BusinessTeamMember,
  CreateBusinessTeamMemberRequest,
  UpdateBusinessTeamMemberRequest,
  UpdateBusinessTeamOwnerRequest,
} from "@beauty-booking/shared";
import {
  accountRegistrationFieldsSchema,
  businessTeamMemberRoles,
} from "@beauty-booking/shared";

import type {
  BusinessTeamMemberFormMode,
  BusinessTeamOwnerDetails,
} from "@/features/businessTeam/lib/businessTeamMembersTypes";

type BusinessTeamMemberFormSubmitPayload =
  | {
      mode: "create";
      values: CreateBusinessTeamMemberRequest;
    }
  | {
      member: BusinessTeamMember;
      mode: "editMember";
      values: UpdateBusinessTeamMemberRequest;
    }
  | {
      mode: "editOwner";
      values: UpdateBusinessTeamOwnerRequest;
    };

const optionalTeamMemberEmailSchema = accountRegistrationFieldsSchema.shape.email
  .optional()
  .or(z.literal(""));
type NameFieldParseResult = ReturnType<
  typeof accountRegistrationFieldsSchema.shape.firstName.safeParse
>;

const addSchemaIssues = (
  context: z.RefinementCtx,
  path: keyof BusinessTeamMemberFormValues,
  result: NameFieldParseResult,
) => {
  if (result.success) {
    return;
  }

  for (const issue of result.error.issues) {
    context.addIssue({
      code: "custom",
      message: issue.message,
      path: [path],
    });
  }
};

const getFullNameValue = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => `${firstName.trim()} ${lastName.trim()}`.trim();

const isValidBirthday = (month: number, day: number) => {
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
};

const baseBusinessTeamMemberFormSchema = z
  .object({
    birthdayDay: z.string(),
    birthdayMonth: z.string(),
    email: optionalTeamMemberEmailSchema,
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z
      .string()
      .refine(
        (value) => value === "" || /^\d{9}$/.test(value),
        "validation.account.phone.invalid",
      ),
    providesServices: z.boolean(),
    role: z.enum(businessTeamMemberRoles),
  })
  .superRefine((values, context) => {
    const hasBirthdayMonth = values.birthdayMonth !== "";
    const hasBirthdayDay = values.birthdayDay !== "";

    if (!hasBirthdayMonth && !hasBirthdayDay) {
      return;
    }

    const birthdayMonth = Number(values.birthdayMonth);
    const birthdayDay = Number(values.birthdayDay);

    if (
      !hasBirthdayMonth ||
      !hasBirthdayDay ||
      !Number.isInteger(birthdayMonth) ||
      !Number.isInteger(birthdayDay) ||
      !isValidBirthday(birthdayMonth, birthdayDay)
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.team.birthdayInvalid",
        path: ["birthdayDay"],
      });
    }
  });

const createBusinessTeamMemberFormSchema =
  baseBusinessTeamMemberFormSchema.superRefine((values, context) => {
    addSchemaIssues(
      context,
      "firstName",
      accountRegistrationFieldsSchema.shape.firstName.safeParse(
        values.firstName,
      ),
    );
    addSchemaIssues(
      context,
      "lastName",
      accountRegistrationFieldsSchema.shape.lastName.safeParse(values.lastName),
    );

    if (
      values.firstName.trim() &&
      values.lastName.trim() &&
      getFullNameValue(values).length > 80
    ) {
      context.addIssue({
        code: "custom",
        message: "validation.business.team.fullNameMaxLength",
        path: ["lastName"],
      });
    }
  });

const editBusinessTeamMemberFormSchema = baseBusinessTeamMemberFormSchema;
const editBusinessTeamOwnerFormSchema = baseBusinessTeamMemberFormSchema;

type BusinessTeamMemberFormValues = z.infer<
  typeof baseBusinessTeamMemberFormSchema
>;

const defaultBusinessTeamMemberFormValues: BusinessTeamMemberFormValues = {
  birthdayDay: "",
  birthdayMonth: "",
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  providesServices: true,
  role: "Employee",
};

const teamMemberNameCharactersRegex = /[^\p{L}\p{M}'\u2019 -]/gu;

const formatTeamMemberNamePartValue = (value: string) =>
  value.replace(teamMemberNameCharactersRegex, "").slice(0, 40);

const getNullableNumberValue = (value: string) => (value ? Number(value) : null);

const getNullableStringValue = (value: string | null | undefined) =>
  value?.trim() || null;

const getNameParts = (fullName: string) => {
  const [firstName = "", ...lastNameParts] = fullName.trim().split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};

const getMemberDefaultValues = (
  member: BusinessTeamMember | null | undefined,
): BusinessTeamMemberFormValues => {
  if (!member) {
    return {
      ...defaultBusinessTeamMemberFormValues,
    };
  }

  const { firstName, lastName } = getNameParts(member.fullName);

  return {
    birthdayDay: member.birthdayDay ? String(member.birthdayDay) : "",
    birthdayMonth: member.birthdayMonth ? String(member.birthdayMonth) : "",
    email: member.email ?? "",
    firstName,
    lastName,
    phoneNumber: member.phoneNumber ?? "",
    providesServices: member.providesServices,
    role: member.role,
  };
};

const getOwnerDefaultValues = (
  ownerDetails: BusinessTeamOwnerDetails,
): BusinessTeamMemberFormValues => ({
  ...defaultBusinessTeamMemberFormValues,
  birthdayDay: ownerDetails.birthdayDay ? String(ownerDetails.birthdayDay) : "",
  birthdayMonth: ownerDetails.birthdayMonth
    ? String(ownerDetails.birthdayMonth)
    : "",
  firstName: "",
  lastName: "",
  phoneNumber: ownerDetails.phoneNumber ?? "",
  providesServices: ownerDetails.providesServices,
});

const getBusinessTeamMemberFormDefaultValues = ({
  member,
  mode,
  ownerDetails,
}: {
  member?: BusinessTeamMember | null;
  mode: BusinessTeamMemberFormMode;
  ownerDetails: BusinessTeamOwnerDetails;
}) =>
  mode === "editOwner"
    ? getOwnerDefaultValues(ownerDetails)
    : getMemberDefaultValues(member);

const getCreateBusinessTeamMemberRequest = (
  values: BusinessTeamMemberFormValues,
): CreateBusinessTeamMemberRequest => ({
  birthdayDay: getNullableNumberValue(values.birthdayDay),
  birthdayMonth: getNullableNumberValue(values.birthdayMonth),
  email: getNullableStringValue(values.email),
  fullName: getFullNameValue(values),
  phoneNumber: getNullableStringValue(values.phoneNumber),
  providesServices: values.providesServices,
  role: values.role,
});

const getUpdateBusinessTeamMemberRequest = (
  values: BusinessTeamMemberFormValues,
  member: BusinessTeamMember,
): UpdateBusinessTeamMemberRequest => ({
  birthdayDay: getNullableNumberValue(values.birthdayDay),
  birthdayMonth: getNullableNumberValue(values.birthdayMonth),
  email: member.email ?? getNullableStringValue(values.email),
  fullName: member.fullName,
  phoneNumber: getNullableStringValue(values.phoneNumber),
  providesServices: values.providesServices,
  role: values.role,
});

const getUpdateBusinessTeamOwnerRequest = (
  values: BusinessTeamMemberFormValues,
): UpdateBusinessTeamOwnerRequest => ({
  birthdayDay: getNullableNumberValue(values.birthdayDay),
  birthdayMonth: getNullableNumberValue(values.birthdayMonth),
  phoneNumber: getNullableStringValue(values.phoneNumber),
  providesServices: values.providesServices,
});

const getBusinessTeamMemberFormSubmitPayload = ({
  member,
  mode,
  values,
}: {
  member?: BusinessTeamMember | null;
  mode: BusinessTeamMemberFormMode;
  values: BusinessTeamMemberFormValues;
}): BusinessTeamMemberFormSubmitPayload | null => {
  if (mode === "editOwner") {
    return {
      mode,
      values: getUpdateBusinessTeamOwnerRequest(values),
    };
  }

  if (mode === "editMember") {
    if (!member) {
      return null;
    }

    return {
      member,
      mode,
      values: getUpdateBusinessTeamMemberRequest(values, member),
    };
  }

  return {
    mode: "create",
    values: getCreateBusinessTeamMemberRequest(values),
  };
};

const getBusinessTeamMemberFormSchema = (mode: BusinessTeamMemberFormMode) => {
  if (mode === "create") {
    return createBusinessTeamMemberFormSchema;
  }

  if (mode === "editOwner") {
    return editBusinessTeamOwnerFormSchema;
  }

  return editBusinessTeamMemberFormSchema;
};

export {
  defaultBusinessTeamMemberFormValues,
  formatTeamMemberNamePartValue,
  getCreateBusinessTeamMemberRequest,
  getBusinessTeamMemberFormDefaultValues,
  getBusinessTeamMemberFormSchema,
  getFullNameValue,
  getBusinessTeamMemberFormSubmitPayload,
  getUpdateBusinessTeamMemberRequest,
  getUpdateBusinessTeamOwnerRequest,
};
export type {
  BusinessTeamMemberFormSubmitPayload,
  BusinessTeamMemberFormValues,
};
