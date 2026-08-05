"use client";

import {
  BarChart3,
  Building2,
  CalendarClock,
  LogOut,
  PlusCircle,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAccountSessionActions } from "@/features/account/providers/accountProvider";
import type { AccountSession } from "@/features/account/types/accountSession";
import { canCreateStaffReservation } from "@/features/account/utils/accountRoleGuards";
import { canEditBusinessAvailability } from "@/features/business-settings/utils/businessSettingsPermissions";

type CustomerSidebarProps = {
  accountSession: AccountSession;
  onNavigateRequest?: (intent: CustomerNavigationIntent) => boolean;
};

type CustomerNavigationIntent = {
  href: string;
  onConfirm?: () => void;
};

type CustomerNavigationItem = {
  href: string;
  icon: ReactNode;
  label: string;
};

const baseCustomerNavigationItems: CustomerNavigationItem[] = [
  {
    href: "/",
    icon: <CalendarClock aria-hidden="true" />,
    label: "Plan dnia",
  },
];

const salonManagementNavigationItem: CustomerNavigationItem = {
  href: "/account/settings",
  icon: <Building2 aria-hidden="true" />,
  label: "Zarządzanie salonem",
};

const salonStatsNavigationItem: CustomerNavigationItem = {
  href: "/account/stats",
  icon: <BarChart3 aria-hidden="true" />,
  label: "Statystyki i finanse",
};

const sidebarButtonClassName =
  "text-primary-foreground/82 hover:bg-primary-foreground/12 hover:text-primary-foreground data-active:bg-primary-foreground data-active:text-primary";

const CustomerSidebar = ({
  accountSession,
  onNavigateRequest,
}: CustomerSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAccountSession } = useAccountSessionActions();
  const customerNavigationItems = canEditBusinessAvailability(
    accountSession.role,
  )
    ? [
        ...baseCustomerNavigationItems,
        salonManagementNavigationItem,
        salonStatsNavigationItem,
      ]
    : baseCustomerNavigationItems;

  const logout = () => {
    const confirmLogout = () => {
      clearAccountSession();
      router.push("/");
    };

    if (
      onNavigateRequest &&
      !onNavigateRequest({ href: "/", onConfirm: confirmLogout })
    ) {
      return;
    }

    confirmLogout();
  };

  const handleNavigationClick =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (href === pathname) {
        return;
      }

      if (onNavigateRequest && !onNavigateRequest({ href })) {
        event.preventDefault();
      }
    };

  return (
    <Sidebar
      collapsible="icon"
      className="border-primary/20 text-primary-foreground [&_[data-slot=sidebar-inner]]:bg-primary [&_[data-slot=sidebar-inner]]:text-primary-foreground"
    >
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={`h-12 ${sidebarButtonClassName}`}
              render={<Link href="/" onClick={handleNavigationClick("/")} />}
              tooltip="Beauty Booking"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground font-heading text-primary">
                B
              </div>
              <span className="font-heading text-base font-medium">
                Beauty Booking
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {canCreateStaffReservation(accountSession.role) ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="bg-primary-foreground text-primary shadow-sm hover:bg-primary-foreground/90 hover:text-primary data-active:bg-primary-foreground data-active:text-primary"
                    render={
                      <Link
                        href={{
                          pathname: "/booking",
                          query: { source: "staff" },
                        }}
                        onClick={handleNavigationClick("/booking")}
                      />
                    }
                    tooltip="Utwórz wizytę"
                  >
                    <PlusCircle aria-hidden="true" />
                    <span>Utwórz wizytę</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground/60">
            Nawigacja
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerNavigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={sidebarButtonClassName}
                    isActive={pathname === item.href}
                    render={
                      <Link
                        href={item.href}
                        onClick={handleNavigationClick(item.href)}
                      />
                    }
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary-foreground/15 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={sidebarButtonClassName}
              render={
                <Link
                  href="/account/profile"
                  onClick={handleNavigationClick("/account/profile")}
                />
              }
              tooltip={accountSession.email}
            >
              <UserRound aria-hidden="true" />
              <span>Dane konta</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={sidebarButtonClassName}
              onClick={logout}
              tooltip="Wyloguj"
            >
              <LogOut aria-hidden="true" />
              <span>Wyloguj</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { CustomerSidebar };
export type { CustomerNavigationIntent, CustomerSidebarProps };
