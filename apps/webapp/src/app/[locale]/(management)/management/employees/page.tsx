import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/PageContainer";
import { BusinessTeamInvitationTestPanel } from "@/features/businessTeam/components";

export default async function ManagementEmployeesPage() {
  const t = await getTranslations();

  return (
    <PageContainer isFullWidth>
      <div className="@container/page grid gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("managementEmployees.title")}
        </h1>
        <BusinessTeamInvitationTestPanel />
      </div>
    </PageContainer>
  );
}
