"use client"

import type { AccountRegistrationValues } from "@/features/account/components/register/schemas/accountRegistrationSchema"
import type { AccountRegistrationPrefill } from "@/features/account/components/register/types/accountRegistration"
import { AccountRegistrationDetailsStep } from "@/features/account/components/register/components/AccountRegistrationDetailsStep"
import { AccountRegistrationSuccessState } from "@/features/account/components/register/components/AccountRegistrationSuccessState"
import { AccountRegistrationVerificationStep } from "@/features/account/components/register/components/AccountRegistrationVerificationStep"
import { useAccountRegistrationDetailsForm } from "@/features/account/components/register/hooks/useAccountRegistrationDetailsForm"
import { useAccountRegistrationFlow } from "@/features/account/components/register/hooks/useAccountRegistrationFlow"
import { useAccountRegistrationVerificationForm } from "@/features/account/components/register/hooks/useAccountRegistrationVerificationForm"

type AccountRegistrationFormProps = {
  defaultValues?: AccountRegistrationPrefill
}

const AccountRegistrationForm = ({ defaultValues }: AccountRegistrationFormProps) => {
  const detailsForm = useAccountRegistrationDetailsForm(defaultValues)
  const verificationForm = useAccountRegistrationVerificationForm()
  const {
    createdAccount,
    demoVerificationCode,
    isVerificationStep,
    pendingAccountValues,
    resetVerification,
    startVerification: startRegistrationVerification,
    verificationTarget,
    finishRegistration,
  } = useAccountRegistrationFlow(defaultValues)

  const submitAccountDetails = (values: AccountRegistrationValues) => {
    verificationForm.reset({ code: "" })
    startRegistrationVerification(values)
  }

  const handleBack = () => {
    verificationForm.reset({ code: "" })
    resetVerification()
  }

  const submitVerificationCode = async (values: { code: string }) => {
    if (!pendingAccountValues) {
      handleBack()
      return
    }

    if (values.code !== demoVerificationCode) {
      verificationForm.setError("code", {
        message: "Kod jest nieprawidłowy.",
        type: "validate",
      })

      return
    }

    finishRegistration(pendingAccountValues)
  }

  if (createdAccount) {
    return <AccountRegistrationSuccessState createdAccount={createdAccount} />
  }

  if (isVerificationStep) {
    return (
      <AccountRegistrationVerificationStep
        form={verificationForm}
        onBack={handleBack}
        onSubmit={submitVerificationCode}
        verificationTarget={verificationTarget}
      />
    )
  }

  return <AccountRegistrationDetailsStep form={detailsForm} onSubmit={submitAccountDetails} />
}

export { AccountRegistrationForm }
export type { AccountRegistrationFormProps }