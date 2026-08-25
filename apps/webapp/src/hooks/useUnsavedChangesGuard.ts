"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseUnsavedChangesGuardProperties = {
  hasUnsavedChanges: boolean;
  isNavigationBlocked?: boolean;
};

export const useUnsavedChangesGuard = ({
  hasUnsavedChanges,
  isNavigationBlocked = false,
}: UseUnsavedChangesGuardProperties) => {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const shouldBypassGuardReference = useRef(false);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBypassGuardReference.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = true;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        shouldBypassGuardReference.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");

      if (
        !link ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.dataset.bypassUnsavedGuard === "true"
      ) {
        return;
      }

      const nextUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isCurrentPage =
        nextUrl.origin === currentUrl.origin &&
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      if (isCurrentPage) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!isNavigationBlocked) {
        setPendingUrl(nextUrl.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [hasUnsavedChanges, isNavigationBlocked]);

  const cancelNavigation = useCallback(() => {
    setPendingUrl(null);
  }, []);

  const confirmNavigation = useCallback(() => {
    if (!pendingUrl) {
      return;
    }

    shouldBypassGuardReference.current = true;
    window.location.assign(pendingUrl);
  }, [pendingUrl]);

  return {
    cancelNavigation,
    confirmNavigation,
    isConfirmationOpen: hasUnsavedChanges && pendingUrl !== null,
  };
};

export type { UseUnsavedChangesGuardProperties };
