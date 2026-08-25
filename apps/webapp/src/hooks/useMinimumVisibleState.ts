"use client";

import { useEffect, useRef, useState } from "react";

export const useMinimumVisibleState = (
  isVisible: boolean,
  minimumVisibleTime = 500,
) => {
  const [shouldShow, setShouldShow] = useState(isVisible);
  const visibleSinceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isVisible) {
      visibleSinceRef.current = Date.now();
      const timeoutId = window.setTimeout(() => {
        setShouldShow(true);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const visibleSince = visibleSinceRef.current ?? Date.now();
    const remainingVisibleTime = Math.max(
      minimumVisibleTime - (Date.now() - visibleSince),
      0,
    );
    const timeoutId = window.setTimeout(() => {
      visibleSinceRef.current = undefined;
      setShouldShow(false);
    }, remainingVisibleTime);

    return () => window.clearTimeout(timeoutId);
  }, [isVisible, minimumVisibleTime]);

  return shouldShow;
};
