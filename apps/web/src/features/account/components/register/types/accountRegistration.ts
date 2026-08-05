import type { AccountRegistrationValues } from "@/features/account/components/register/schemas/accountRegistrationSchema";
import type { AccountSession } from "@/features/account/types/accountSession";

type AccountRegistrationPrefill = Partial<
  Pick<
    AccountRegistrationValues,
    "birthDate" | "email" | "firstName" | "lastName" | "phone"
  >
>;

type AccountRegistrationStep = "details" | "verification" | "success";

type AccountRegistrationFlowState = {
  createdAccount?: AccountSession;
  pendingAccountValues?: AccountRegistrationValues;
  step: AccountRegistrationStep;
  verificationTarget: string;
};

export type {
  AccountRegistrationFlowState,
  AccountRegistrationPrefill,
  AccountRegistrationStep,
};
