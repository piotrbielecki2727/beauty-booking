import {
  CalendarDaysIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  ScissorsIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import type { ManagementNavItemConfig } from "@/components/layout/managementSidebar/managementSidebarTypes";

export const SIDEBAR_TRANSITION_DURATION = 300;

export const managementNavItems: ManagementNavItemConfig[] = [
  {
    href: "/management",
    icon: LayoutDashboardIcon,
    labelKey: "dashboard",
  },
  {
    href: "/management/calendar",
    icon: CalendarDaysIcon,
    labelKey: "calendar",
  },
  {
    href: "/management/bookings",
    icon: ClipboardListIcon,
    labelKey: "bookings",
  },
  {
    href: "/management/services",
    icon: ScissorsIcon,
    labelKey: "services",
  },
  {
    href: "/management/employees",
    icon: UsersIcon,
    labelKey: "employees",
  },
  {
    href: "/management/settings",
    icon: SettingsIcon,
    labelKey: "settings",
  },
];
