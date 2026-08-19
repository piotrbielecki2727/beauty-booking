"use client";

import { useEffect, useState } from "react";

export const useClientHydrated = () => {
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsClientHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return isClientHydrated;
};
