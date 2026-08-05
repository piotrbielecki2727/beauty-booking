import type { AccountRegistrationPrefill } from "@/features/account/components/register/types/accountRegistration";
import type { AccountSession } from "@/features/account/types/accountSession";
import { defaultAccountRole } from "@/features/account/types/accountRole";

const demoVerificationCode = "111111";

const getSearchParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

const buildAccountRegistrationPrefill = (
  params: Record<string, string | string[] | undefined>,
): AccountRegistrationPrefill => ({
  birthDate: getSearchParam(params.birthDate),
  email: getSearchParam(params.email),
  firstName: getSearchParam(params.firstName),
  lastName: getSearchParam(params.lastName),
  phone: getSearchParam(params.phone),
});

const buildAccountSessionFromRegistration = (values: {
  birthDate: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}): AccountSession => ({
  birthDate: values.birthDate,
  createdAt: new Date().toISOString(),
  email: values.email.trim(),
  firstName: values.firstName.trim(),
  id: crypto.randomUUID(),
  lastName: values.lastName.trim(),
  phone: values.phone,
  role: defaultAccountRole,
});

export {
  buildAccountRegistrationPrefill,
  buildAccountSessionFromRegistration,
  demoVerificationCode,
};
