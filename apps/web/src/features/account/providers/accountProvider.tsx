"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AccountSession } from "@/features/account/types/accountSession";

type AccountProviderProps = {
  children: ReactNode;
};

type AccountContextValue = {
  clearAccountSession: () => void;
  session?: AccountSession;
  setAccountSession: (session: AccountSession) => void;
};

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined,
);

const AccountProvider = ({ children }: AccountProviderProps) => {
  const [session, setSession] = useState<AccountSession>();

  const setAccountSession = useCallback((nextSession: AccountSession) => {
    setSession(nextSession);
  }, []);

  const clearAccountSession = useCallback(() => {
    setSession(undefined);
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      clearAccountSession,
      session,
      setAccountSession,
    }),
    [clearAccountSession, session, setAccountSession],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

const useAccountSession = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccountSession must be used within AccountProvider");
  }

  return context.session;
};

const useAccountSessionActions = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error(
      "useAccountSessionActions must be used within AccountProvider",
    );
  }

  return {
    clearAccountSession: context.clearAccountSession,
    setAccountSession: context.setAccountSession,
  };
};

export { AccountProvider, useAccountSession, useAccountSessionActions };
export type { AccountContextValue, AccountProviderProps };
