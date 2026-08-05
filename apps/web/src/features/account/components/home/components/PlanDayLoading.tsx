import { LoadingState } from "@/components/common/loading-state";

const PlanDayLoading = () => (
  <div className="grid min-h-[42rem] rounded-lg border border-border/70 bg-card shadow-sm">
    <LoadingState
      className="min-h-[42rem]"
      message="Przeliczamy plan dnia i aktualizujemy wizyty."
    />
  </div>
);

export { PlanDayLoading };
