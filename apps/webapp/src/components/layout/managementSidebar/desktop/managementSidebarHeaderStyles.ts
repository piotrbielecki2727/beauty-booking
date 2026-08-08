type ManagementSidebarHeaderState = {
  isCollapsed: boolean;
  isCollapsing: boolean;
  isExpanding: boolean;
  isSidebarHovered: boolean;
  isTransitioning: boolean;
};

export const getManagementSidebarHeaderState = ({
  isCollapsed,
  isCollapsing,
  isExpanding,
  isSidebarHovered,
  isTransitioning,
}: ManagementSidebarHeaderState) => {
  const isCollapsedIdle = isCollapsed && !isTransitioning;
  const isCollapsedHovered = isCollapsedIdle && isSidebarHovered;
  const isExpandedIdle = !isCollapsed && !isTransitioning;

  const logoButtonClassName = (() => {
    if (isExpanding) {
      return "pointer-events-none opacity-0";
    }

    if (isCollapsing) {
      return "pointer-events-none opacity-100";
    }

    if (isCollapsedHovered) {
      return "pointer-events-none scale-95 opacity-0";
    }

    return "scale-100 opacity-100";
  })();

  const expandButtonClassName = (() => {
    if (isExpanding) {
      return "pointer-events-none opacity-100";
    }

    if (isCollapsing || !isCollapsed) {
      return "pointer-events-none opacity-0";
    }

    return isSidebarHovered
      ? "pointer-events-auto scale-100 opacity-100"
      : "pointer-events-none scale-95 opacity-0";
  })();

  const brandLabelClassName = (() => {
    if (isExpanding) {
      return "pointer-events-none translate-x-1 opacity-0";
    }

    if (isCollapsed || isCollapsing) {
      return "pointer-events-none translate-x-0 opacity-0";
    }

    return "translate-x-0 opacity-100";
  })();

  const collapseButtonClassName = isExpandedIdle
    ? "pointer-events-auto opacity-100"
    : "pointer-events-none opacity-0";

  return {
    brandLabelClassName,
    collapseButtonClassName,
    expandButtonClassName,
    isExpandedIdle,
    logoButtonClassName,
  };
};
