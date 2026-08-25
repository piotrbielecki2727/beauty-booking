import { BusinessSetupWizard } from "@/features/businessSetup";
import { BusinessSetupProvider } from "@/features/businessSetup/providers";

export default function ManagementSetupPage() {
  return (
    <BusinessSetupProvider>
      <BusinessSetupWizard />
    </BusinessSetupProvider>
  );
}
