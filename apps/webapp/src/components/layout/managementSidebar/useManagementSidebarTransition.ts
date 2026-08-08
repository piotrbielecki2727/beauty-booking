"use client";

import { useEffect, useRef, useState } from "react";

import { SIDEBAR_TRANSITION_DURATION } from "@/components/layout/managementSidebar/managementSidebarConfig";

type UseManagementSidebarTransitionParams = {
  onIsCollapsedChange: (isCollapsed: boolean) => void;
};

export const useManagementSidebarTransition = ({
  onIsCollapsedChange,
}: UseManagementSidebarTransitionParams) => {
  const timeoutRef = useRef<number | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const isTransitioning = isExpanding || isCollapsing;

  const clearTransitionTimeout = () => {
    if (!timeoutRef.current) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const finishTransition = (callback: () => void) => {
    clearTransitionTimeout();

    timeoutRef.current = window.setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, SIDEBAR_TRANSITION_DURATION);
  };

  const handleExpandSidebar = () => {
    if (isTransitioning) {
      return;
    }

    setIsExpanding(true);
    onIsCollapsedChange(false);

    finishTransition(() => {
      setIsExpanding(false);
    });
  };

  const handleCollapseSidebar = () => {
    if (isTransitioning) {
      return;
    }

    setIsCollapsing(true);
    onIsCollapsedChange(true);

    finishTransition(() => {
      setIsCollapsing(false);
    });
  };

  useEffect(() => {
    return clearTransitionTimeout;
  }, []);

  return {
    handleCollapseSidebar,
    handleExpandSidebar,
    isCollapsing,
    isExpanding,
    isTransitioning,
  };
};
