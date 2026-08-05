"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  mockManagerCredentials,
  mockManagerSession,
} from "@/features/auth/mocks/managerAccount";
import type { ManagerLoginValues } from "@/features/auth/schemas/managerLoginSchema";
import type {
  AuthSession,
  AuthStatus,
} from "@/features/auth/types/authSession";

type AuthContextValue = {
  login: (values: ManagerLoginValues) => Promise<boolean>;
  logout: () => void;
  session?: AuthSession;
  status: AuthStatus;
};

type AuthProviderProps = {
  children: ReactNode;
};

const authSessionRestoreDelay = 500;
const authLoginDelay = 700;

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession>();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSession(undefined);
      setStatus("unauthenticated");
    }, authSessionRestoreDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const login = useCallback(async (values: ManagerLoginValues) => {
    await wait(authLoginDelay);

    const hasValidCredentials =
      values.email.trim().toLowerCase() === mockManagerCredentials.email &&
      values.password === mockManagerCredentials.password;

    if (!hasValidCredentials) {
      setSession(undefined);
      setStatus("unauthenticated");
      return false;
    }

    setSession(mockManagerSession);
    setStatus("authenticated");

    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(undefined);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      logout,
      session,
      status,
    }),
    [login, logout, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
export type { AuthContextValue, AuthProviderProps };
