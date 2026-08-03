import type { ReactNode } from "react"

type BookingStepShellProps = {
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}

const BookingStepShell = ({ children, description, footer, title }: BookingStepShellProps) => (
  <div className="grid w-full min-w-0 gap-5">
    <div className="grid gap-2">
      <h2 className="font-heading text-3xl font-semibold leading-tight">{title}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {children}
    {footer ? <div>{footer}</div> : null}
  </div>
)

export { BookingStepShell }
export type { BookingStepShellProps }
