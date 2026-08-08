import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type ManagementNavLabelKey =
  | "dashboard"
  | "calendar"
  | "bookings"
  | "services"
  | "employees"
  | "settings";

export type ManagementNavItemConfig = {
  href: string;
  icon: ComponentType<LucideProps>;
  labelKey: ManagementNavLabelKey;
};

export type ManagementSidebarTransition = {
  handleCollapseSidebar: () => void;
  handleExpandSidebar: () => void;
  isCollapsing: boolean;
  isExpanding: boolean;
  isTransitioning: boolean;
};
