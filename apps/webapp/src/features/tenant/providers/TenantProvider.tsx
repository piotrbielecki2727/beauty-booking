"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getTenantContext,
  TenantContextApiError,
} from "@/features/tenant/api";
import { TenantNotFoundState } from "@/features/tenant/components";

import type { ReactNode } from "react";
import type { TenantBusiness } from "@beauty-booking/shared";

type TenantContextValue = {
  business: TenantBusiness | null;
  tenantContextErrorStatus?: number;
  isTenantContextLoading: boolean;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [business, setBusiness] = useState<TenantBusiness | null>(null);
  const [tenantContextErrorStatus, setTenantContextErrorStatus] =
    useState<number>();
  const [isTenantContextLoading, setIsTenantContextLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const loadTenantContext = async () => {
      try {
        const tenantContext = await getTenantContext({
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        setBusiness(tenantContext.business);
        setTenantContextErrorStatus(undefined);
      } catch (error: unknown) {
        if (abortController.signal.aborted) {
          return;
        }

        setBusiness(null);
        setTenantContextErrorStatus(
          error instanceof TenantContextApiError ? error.status : undefined,
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsTenantContextLoading(false);
        }
      }
    };

    void loadTenantContext();

    return () => {
      abortController.abort();
    };
  }, []);

  const value = useMemo(
    () => ({
      business,
      tenantContextErrorStatus,
      isTenantContextLoading,
    }),
    [business, isTenantContextLoading, tenantContextErrorStatus],
  );

  if (tenantContextErrorStatus === 404) {
    return <TenantNotFoundState />;
  }

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};

export const useTenantContext = () => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenantContext must be used within TenantProvider.");
  }

  return context;
};
