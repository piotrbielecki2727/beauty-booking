"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  accountVerificationCodeSchema,
  type AccountVerificationCodeValues,
} from "@/features/account/components/register/schemas/accountVerificationCodeSchema";

const useAccountRegistrationVerificationForm = () =>
  useForm<AccountVerificationCodeValues>({
    defaultValues: {
      code: "",
    },
    mode: "onTouched",
    resolver: zodResolver(accountVerificationCodeSchema),
  });

export { useAccountRegistrationVerificationForm };
