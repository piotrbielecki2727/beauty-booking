"use client"

import type { CSSProperties, ReactNode } from "react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CustomerSidebar } from "@/features/account/components/CustomerSidebar"
import type { CustomerNavigationIntent } from "@/features/account/components/CustomerSidebar"
import type { AccountSession } from "@/features/account/types/accountSession"
import { cn } from "@/lib/utils"

type CustomerAppShellProps = {
  accountSession: AccountSession
  action?: ReactNode
  actionClassName?: string
  children: ReactNode
  contentClassName?: string
  description?: ReactNode
  eyebrow?: ReactNode
  headerContentClassName?: string
  onNavigateRequest?: (intent: CustomerNavigationIntent) => boolean
  title: ReactNode
}

const CustomerAppShell = ({
  accountSession,
  action,
  actionClassName,
  children,
  contentClassName,
  description,
  eyebrow,
  headerContentClassName,
  onNavigateRequest,
  title,
}: CustomerAppShellProps) => (
  <TooltipProvider>
    <SidebarProvider
      className="min-h-screen bg-background text-foreground"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "4rem",
        } as CSSProperties
      }
    >
      <CustomerSidebar accountSession={accountSession} onNavigateRequest={onNavigateRequest} />
      <SidebarInset className="min-w-0">
        <div className="grid min-h-screen grid-rows-[auto_minmax(0,1fr)]">
          <header className="border-b border-border bg-card/80 px-4 py-4 backdrop-blur sm:px-6">
            <div
              className={cn(
                "mx-auto flex w-full max-w-none items-start justify-between gap-6",
                headerContentClassName
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <SidebarTrigger className="mt-1 md:hidden" />
                <div className="grid min-w-0 gap-1">
                  {eyebrow ? <p className="text-sm font-medium text-primary">{eyebrow}</p> : null}
                  <h1 className="font-heading text-3xl font-semibold leading-tight">{title}</h1>
                  {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
                </div>
              </div>
              {action ? <div className={cn("shrink-0", actionClassName)}>{action}</div> : null}
            </div>
          </header>

          <main className="min-w-0 px-4 py-6 sm:px-6">
            <div className={cn("mx-auto w-full max-w-none", contentClassName)}>{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
)

export { CustomerAppShell }
export type { CustomerAppShellProps }
