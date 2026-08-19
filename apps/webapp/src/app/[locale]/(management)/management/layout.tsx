import { cookies } from "next/headers";

import type { ReactNode } from "react";

import { ManagementAppShell } from "@/components/layout/ManagementAppShell";
import { MANAGEMENT_SIDEBAR_COLLAPSED_KEY } from "@/components/layout/managementSidebar/managementSidebarConfig";

export default async function ManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const isSidebarInitiallyCollapsed =
    cookieStore.get(MANAGEMENT_SIDEBAR_COLLAPSED_KEY)?.value === "true";

  return (
    <ManagementAppShell
      isSidebarInitiallyCollapsed={isSidebarInitiallyCollapsed}
    >
      {children}
    </ManagementAppShell>
  );
}
