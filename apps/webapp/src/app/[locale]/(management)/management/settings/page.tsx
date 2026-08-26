import { getTranslations } from "next-intl/server";

import { ManagementPageLayout } from "@/components/layout/ManagementPageLayout";
import { BusinessSetupProvider } from "@/features/businessSetup/providers";
import { BusinessSalonSettings } from "@/features/businessSettings";

export default async function ManagementSettingsPage() {
  const t = await getTranslations();
  return (
    <ManagementPageLayout
      description={t("managementSettings.description")}
      title={t("managementSettings.title")}
    >
      <BusinessSetupProvider>
        <BusinessSalonSettings />
      </BusinessSetupProvider>
    </ManagementPageLayout>
  );
}
