import { ManagementPageLayout } from "@/components/layout/ManagementPageLayout";
import { Input } from "@/components/reusable";

export default function ManagementDashboardPage() {
  return (
    <ManagementPageLayout title="Panel zarządzania">
      <Input placeholder="Wyszukaj..." />
    </ManagementPageLayout>
  );
}
