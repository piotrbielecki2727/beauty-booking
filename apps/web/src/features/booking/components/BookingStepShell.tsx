import type { ReactNode } from "react"

type BookingStepShellProps = {
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}

const BookingStepShell = ({ children, description, footer, title }: BookingStepShellProps) => (
  <div className="grid min-h-[calc(100svh-13rem)] w-full min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-5">
    <div className="grid gap-2">
      <h2 className="font-heading text-3xl font-semibold leading-tight">{title}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    <div className="grid min-w-0 content-start">{children}</div>
    {footer ? <div className="pt-1">{footer}</div> : null}
  </div>
)

export { BookingStepShell }
export type { BookingStepShellProps }
