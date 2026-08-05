"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { AccountRegistrationPrefill } from "@/features/account/components/register/types/accountRegistration";
import {
  accountRegistrationSchema,
  type AccountRegistrationValues,
} from "@/features/account/components/register/schemas/accountRegistrationSchema";

const useAccountRegistrationDetailsForm = (
  defaultValues?: AccountRegistrationPrefill,
) =>
  useForm<AccountRegistrationValues>({
    defaultValues: {
      birthDate: defaultValues?.birthDate ?? "",
      confirmPassword: "",
      email: defaultValues?.email ?? "",
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      password: "",
      phone: defaultValues?.phone ?? "",
    },
    mode: "onTouched",
    resolver: zodResolver(accountRegistrationSchema),
  });

export { useAccountRegistrationDetailsForm };
