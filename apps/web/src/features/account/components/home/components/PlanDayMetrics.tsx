import {
  Banknote,
  CalendarCheck,
  CalendarClock,
  Clock,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

import type { SalonDashboardSummary } from "@/features/account/types/salonDashboard";
import { formatPrice } from "@/features/booking/utils/serviceFormatters";

type PlanDayMetricsProps = {
  summary: SalonDashboardSummary;
};

type SalonMetricCardProps = {
  icon: ReactNode;
  label: string;
  tone?: "default" | "warning";
  value: string;
};

const SalonMetricCard = ({
  icon,
  label,
  tone = "default",
  value,
}: SalonMetricCardProps) => (
  <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border/60 bg-background/45 px-2.5 py-2">
    <span
      className={
        tone === "warning"
          ? "grid size-7 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive [&_svg]:size-4"
          : "grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-primary [&_svg]:size-4"
      }
    >
      {icon}
    </span>
    <div className="min-w-0">
      <p className="truncate text-[0.7rem] font-medium uppercase leading-4 text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-base font-semibold leading-5 tracking-normal">
        {value}
      </p>
    </div>
  </div>
);

const PlanDayMetrics = ({ summary }: PlanDayMetricsProps) => (
  <section className="rounded-lg border border-border/70 bg-card px-3 py-2.5 shadow-sm">
    <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
      <SalonMetricCard
        icon={<CalendarClock aria-hidden="true" />}
        label="Wizyty"
        value={`${summary.todayMetrics.visits.value}`}
      />
      <SalonMetricCard
        icon={<CalendarCheck aria-hidden="true" />}
        label="Wykonane"
        value={`${summary.todayMetrics.completedVisits.value}`}
      />
      <SalonMetricCard
        icon={<Clock aria-hidden="true" />}
        label="Pozostałe"
        value={`${summary.todayMetrics.remainingVisits.value}`}
      />
      <SalonMetricCard
        icon={<TrendingUp aria-hidden="true" />}
        label="Przewidywany zysk"
        value={formatPrice(summary.todayMetrics.predictedRevenue.amount)}
      />
      <SalonMetricCard
        icon={<Banknote aria-hidden="true" />}
        label="Rzeczywisty zysk"
        value={formatPrice(summary.todayMetrics.actualRevenue.amount)}
      />
      <SalonMetricCard
        icon={<TrendingDown aria-hidden="true" />}
        label="Utracony zysk"
        tone={
          summary.todayMetrics.lostRevenue.amount > 0 ? "warning" : "default"
        }
        value={formatPrice(summary.todayMetrics.lostRevenue.amount)}
      />
    </div>
  </section>
);

export { PlanDayMetrics };
export type { PlanDayMetricsProps, SalonMetricCardProps };
