"use client";

import { useCallback, useSyncExternalStore } from "react";

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

  const setValue = useCallback(
    (nextValue: boolean) => {
      try {
        window.localStorage.setItem(key, String(nextValue));
      } finally {
        window.dispatchEvent(new Event(getPersistentBooleanEventName(key)));
      }
    },
    [key],
  );

  return [value, setValue] as const;
};
