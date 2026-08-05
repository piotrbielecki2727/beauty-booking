"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { AccountLoginProps } from "@/features/account/components/login/types/accountLogin"
import { accountLoginSchema, type AccountLoginValues } from "@/features/account/components/login/schemas/accountLoginSchema"

const useAccountLoginForm = ({ defaultEmail = "" }: AccountLoginProps) =>
  useForm<AccountLoginValues>({
    defaultValues: {
      email: defaultEmail,
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(accountLoginSchema),
  })

export { useAccountLoginForm }