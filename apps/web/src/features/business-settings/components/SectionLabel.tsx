import type { ReactNode } from "react"

type SectionLabelProps = {
  icon: ReactNode
  label: string
}

const SectionLabel = ({ icon, label }: SectionLabelProps) => (
  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
    <span className="text-primary [&_svg]:size-4">{icon}</span>
    {label}
  </div>
)

export { SectionLabel }
export type { SectionLabelProps }
