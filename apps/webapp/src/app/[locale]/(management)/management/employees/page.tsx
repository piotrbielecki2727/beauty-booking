import { getTranslations } from "next-intl/server";

import { ManagementPageLayout } from "@/components/layout/ManagementPageLayout";
import { BusinessTeamInvitationTestPanel } from "@/features/businessTeam/components";

export default async function ManagementEmployeesPage() {
  const t = await getTranslations();

  return (
    <ManagementPageLayout
      contentClassName="@container/page"
      title={t("managementEmployees.title")}
    >
      <BusinessTeamInvitationTestPanel />
    </ManagementPageLayout>
  );
}
