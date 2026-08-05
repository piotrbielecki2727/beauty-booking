"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, LockKeyhole, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { AppButton } from "@/components/common/app-button"
import { FormField } from "@/components/common/form-field"
import { Input } from "@/components/ui/input"
import { mockManagerCredentials } from "@/features/auth/mocks/managerAccount"
import { useAuth } from "@/features/auth/providers/authProvider"
import { managerLoginSchema, type ManagerLoginValues } from "@/features/auth/schemas/managerLoginSchema"

const ManagerLoginForm = () => {
  const router = useRouter()
  const { login, status } = useAuth()
  const [authError, setAuthError] = useState<string>()
  const form = useForm<ManagerLoginValues>({
    defaultValues: {
      email: mockManagerCredentials.email,
      password: mockManagerCredentials.password,
    },
    mode: "onTouched",
    resolver: zodResolver(managerLoginSchema),
  })

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/manager")
    }
  }, [router, status])

  const submitLogin = async (values: ManagerLoginValues) => {
    setAuthError(undefined)

    const isLoggedIn = await login(values)

    if (!isLoggedIn) {
      setAuthError("Nieprawidłowy e-mail lub hasło.")
      return
    }

    router.replace("/manager")
  }

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(submitLogin)}>
      <div className="grid gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="E-mail" reserveMessageSpace required>
              <Input
                autoComplete="email"
                inputMode="email"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="manager@beautybooking.test"
                ref={field.ref}
                type="email"
                value={field.value}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="Hasło" reserveMessageSpace required>
              <Input
                autoComplete="current-password"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="Wpisz hasło"
                ref={field.ref}
                type="password"
                value={field.value}
              />
            </FormField>
          )}
        />
      </div>

      {authError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {authError}
        </div>
      ) : null}

      <AppButton
        disabled={!form.formState.isValid}
        fullWidth
        isLoading={form.formState.isSubmitting}
        loadingText="Logowanie"
        type="submit"
      >
        Zaloguj
        <ArrowRight aria-hidden="true" />
      </AppButton>

      <div className="grid gap-2 rounded-lg border border-border bg-muted/45 p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground">
          <Mail aria-hidden="true" className="size-4 text-primary" />
          <span>{mockManagerCredentials.email}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <LockKeyhole aria-hidden="true" className="size-4 text-primary" />
          <span>{mockManagerCredentials.password}</span>
        </div>
      </div>
    </form>
  )
}

export { ManagerLoginForm }
