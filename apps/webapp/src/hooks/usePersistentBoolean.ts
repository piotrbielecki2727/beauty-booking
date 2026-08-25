"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const PERSISTENT_BOOLEAN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const getPersistentBooleanEventName = (key: string) => {
  return `persistent-boolean-change:${key}`;
};

const getPersistentBooleanValue = (key: string, defaultValue: boolean) => {
  try {
    const value = window.localStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return value === "true";
  } catch {
    return defaultValue;
  }
};

const setPersistentBooleanCookie = (key: string, value: boolean) => {
  document.cookie = `${encodeURIComponent(key)}=${String(value)}; Path=/; Max-Age=${PERSISTENT_BOOLEAN_COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const usePersistentBoolean = (
  key: string,
  defaultValue: boolean,
) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const eventName = getPersistentBooleanEventName(key);

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key) {
          onStoreChange();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener(eventName, onStoreChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener(eventName, onStoreChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    return getPersistentBooleanValue(key, defaultValue);
  }, [defaultValue, key]);

  const getServerSnapshot = useCallback(() => {
    return defaultValue;
  }, [defaultValue]);

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    setPersistentBooleanCookie(key, value);
  }, [key, value]);

  const setValue = useCallback(
    (nextValue: boolean) => {
      try {
        window.localStorage.setItem(key, String(nextValue));
      } finally {
        setPersistentBooleanCookie(key, nextValue);
        window.dispatchEvent(new Event(getPersistentBooleanEventName(key)));
      }
    },
    [key],
  );

  return [value, setValue] as const;
};
