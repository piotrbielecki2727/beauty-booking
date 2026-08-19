"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { endAccountSession } from "@/features/account/lib";
import {
  BusinessSetupApiError,
  getBusinessSetup,
  saveBusinessBasics,
} from "@/features/businessSetup/api";
import { appToast } from "@/features/notifications";

import type { ReactNode } from "react";
import type {
  BusinessBasicsForm,
  BusinessSetupResponse,
  BusinessSetupStep,
} from "@beauty-booking/shared";

type BusinessSetupContextValue = {
  activeStep: BusinessSetupStep;
  clearDraft: (step: BusinessSetupDraftStep) => void;
  dirtySteps: BusinessSetupStep[];
  drafts: BusinessSetupDrafts;
  hasActiveStepValidationErrors: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isSetupLoading: boolean;
  saveBasics: (values: BusinessBasicsForm) => Promise<void>;
  setActiveStep: (step: BusinessSetupStep) => void;
  setDraft: <Step extends BusinessSetupDraftStep>(
    step: Step,
    values: NonNullable<BusinessSetupDrafts[Step]>,
  ) => void;
  setStepHasValidationErrors: (
    step: BusinessSetupDraftStep,
    hasValidationErrors: boolean,
  ) => void;
  setup: BusinessSetupResponse | null;
};

type BusinessSetupDrafts = {
  BUSINESS_BASICS?: BusinessBasicsForm;
};

type BusinessSetupDraftStep = keyof BusinessSetupDrafts;

type SaveBusinessSetupRequest<Values> = (properties: {
  accessToken: string;
  values: Values;
}) => Promise<BusinessSetupResponse>;

const BusinessSetupContext = createContext<BusinessSetupContextValue | null>(
  null,
);

export const BusinessSetupProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [setup, setSetup] = useState<BusinessSetupResponse | null>(null);
  const [activeStep, setActiveStepState] = useState<BusinessSetupStep | null>(
    null,
  );
  const [drafts, setDrafts] = useState<BusinessSetupDrafts>({});
  const [dirtySteps, setDirtySteps] = useState<BusinessSetupStep[]>([]);
  const [stepsWithValidationErrors, setStepsWithValidationErrors] = useState<
    BusinessSetupStep[]
  >([]);
  const [isSetupRequestLoading, setIsSetupRequestLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const accessToken = session?.accessToken;
  const isSetupLoading =
    status === "loading" || (Boolean(accessToken) && isSetupRequestLoading);

  const endExpiredSession = useCallback(async () => {
    appToast.error({
      title: t("businessSetup.feedback.sessionExpired"),
    });
    await endAccountSession(`/${locale}/login`);
  }, [locale, t]);

  const handleUnauthorizedError = useCallback(
    async (error: unknown) => {
      if (error instanceof BusinessSetupApiError && error.status === 401) {
        await endExpiredSession();
        return true;
      }

      return false;
    },
    [endExpiredSession],
  );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!accessToken) {
      return;
    }

    let isMounted = true;

    const loadSetup = async () => {
      setIsSetupRequestLoading(true);

      try {
        const nextSetup = await getBusinessSetup(accessToken);

        if (isMounted) {
          setSetup(nextSetup);
          setActiveStepState(
            (currentStep) =>
              currentStep ?? nextSetup.setup.currentStep ?? "BUSINESS_BASICS",
          );
        }
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        if (!(await handleUnauthorizedError(error))) {
          appToast.error({
            title: t("businessSetup.feedback.loadFailed"),
          });
        }
      } finally {
        if (isMounted) {
          setIsSetupRequestLoading(false);
        }
      }
    };

    void loadSetup();

    return () => {
      isMounted = false;
    };
  }, [accessToken, handleUnauthorizedError, status, t]);

  const saveStep = useCallback(
    async <Values,>(
      step: BusinessSetupDraftStep,
      values: Values,
      request: SaveBusinessSetupRequest<Values>,
    ) => {
      if (!accessToken || isSaving) {
        return;
      }

      setIsSaving(true);

      try {
        const nextSetup = await request({ accessToken, values });

        setSetup(nextSetup);
        setActiveStepState(nextSetup.setup.currentStep ?? step);
        setDrafts((currentDrafts) => {
          const nextDrafts = { ...currentDrafts };

          delete nextDrafts[step];

          return nextDrafts;
        });
        setDirtySteps((currentSteps) =>
          currentSteps.filter((currentStep) => currentStep !== step),
        );
        setStepsWithValidationErrors((currentSteps) =>
          currentSteps.filter((currentStep) => currentStep !== step),
        );
      } catch (error: unknown) {
        if (!(await handleUnauthorizedError(error))) {
          throw error;
        }
      } finally {
        setIsSaving(false);
      }
    },
    [accessToken, handleUnauthorizedError, isSaving],
  );

  const setActiveStep = useCallback(
    (step: BusinessSetupStep) => {
      if (!isSaving) {
        setActiveStepState(step);
      }
    },
    [isSaving],
  );

  const setDraft = useCallback(
    <Step extends BusinessSetupDraftStep>(
      step: Step,
      values: NonNullable<BusinessSetupDrafts[Step]>,
    ) => {
      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [step]: values,
      }));
      setDirtySteps((currentSteps) =>
        currentSteps.includes(step) ? currentSteps : [...currentSteps, step],
      );
    },
    [],
  );

  const clearDraft = useCallback((step: BusinessSetupDraftStep) => {
    setDrafts((currentDrafts) => {
      if (!currentDrafts[step]) {
        return currentDrafts;
      }

      const nextDrafts = { ...currentDrafts };

      delete nextDrafts[step];

      return nextDrafts;
    });
    setDirtySteps((currentSteps) =>
      currentSteps.includes(step)
        ? currentSteps.filter((currentStep) => currentStep !== step)
        : currentSteps,
    );
  }, []);

  const setStepHasValidationErrors = useCallback(
    (
      step: BusinessSetupDraftStep,
      hasValidationErrors: boolean,
    ) => {
      setStepsWithValidationErrors((currentSteps) => {
        const alreadyHasValidationErrors = currentSteps.includes(step);

        if (hasValidationErrors === alreadyHasValidationErrors) {
          return currentSteps;
        }

        return hasValidationErrors
          ? [...currentSteps, step]
          : currentSteps.filter((currentStep) => currentStep !== step);
      });
    },
    [],
  );

  const resolvedActiveStep =
    activeStep ?? setup?.setup.currentStep ?? "BUSINESS_BASICS";
  const hasUnsavedChanges = dirtySteps.length > 0;
  const hasActiveStepValidationErrors = stepsWithValidationErrors.includes(
    resolvedActiveStep,
  );

  const saveBasics = useCallback(
    (values: BusinessBasicsForm) =>
      saveStep("BUSINESS_BASICS", values, saveBusinessBasics),
    [saveStep],
  );

  const value = useMemo<BusinessSetupContextValue>(
    () => ({
      activeStep: resolvedActiveStep,
      clearDraft,
      dirtySteps,
      drafts,
      hasActiveStepValidationErrors,
      hasUnsavedChanges,
      isSaving,
      isSetupLoading,
      saveBasics,
      setActiveStep,
      setDraft,
      setStepHasValidationErrors,
      setup,
    }),
    [
      clearDraft,
      dirtySteps,
      drafts,
      hasActiveStepValidationErrors,
      hasUnsavedChanges,
      isSaving,
      isSetupLoading,
      resolvedActiveStep,
      saveBasics,
      setActiveStep,
      setDraft,
      setStepHasValidationErrors,
      setup,
    ],
  );

  return (
    <BusinessSetupContext.Provider value={value}>
      {children}
    </BusinessSetupContext.Provider>
  );
};

export const useBusinessSetup = () => {
  const context = useContext(BusinessSetupContext);

  if (!context) {
    throw new Error("useBusinessSetup must be used within BusinessSetupProvider.");
  }

  return context;
};

export type {
  BusinessSetupContextValue,
  BusinessSetupDrafts,
  BusinessSetupDraftStep,
};
