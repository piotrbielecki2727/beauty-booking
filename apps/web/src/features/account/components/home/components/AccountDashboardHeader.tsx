type DashboardFactProps = {
  label: string;
  value: string;
};

type AccountDashboardHeaderProps = {
  facts?: DashboardFactProps[];
  greeting: string;
  subtitle: string;
  title?: string;
};

const DashboardFact = ({ label, value }: DashboardFactProps) => (
  <div className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2">
    <p className="text-xs font-medium uppercase text-muted-foreground">
      {label}
    </p>
    <p className="mt-1 font-medium">{value}</p>
  </div>
);

const AccountDashboardHeader = ({
  facts = [],
  greeting,
  subtitle,
  title,
}: AccountDashboardHeaderProps) => (
  <section className="rounded-lg border border-border/70 bg-card px-4 py-4 shadow-sm sm:px-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid gap-1">
        <p className="text-sm font-medium text-primary">{greeting}</p>
        {title ? (
          <h2 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {title}
          </h2>
        ) : null}
        <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </div>

      {facts.length > 0 ? (
        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[28rem]">
          {facts.map((fact) => (
            <DashboardFact
              key={fact.label}
              label={fact.label}
              value={fact.value}
            />
          ))}
        </div>
      ) : null}
    </div>
  </section>
);

export { AccountDashboardHeader };
export type { AccountDashboardHeaderProps, DashboardFactProps };
