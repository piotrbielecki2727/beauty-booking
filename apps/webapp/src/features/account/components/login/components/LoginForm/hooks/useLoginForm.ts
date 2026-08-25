"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  accountLoginSchema,
  type AccountLoginValues,
} from "@beauty-booking/shared";

export const useLoginForm = () => {
  return useForm<AccountLoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(accountLoginSchema),
  });
};
