import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/reusable";

export default function ManagementDashboardPage() {
  return (
    <PageContainer className="grid gap-6" isFullWidth>
      <h1 className="text-2xl font-semibold tracking-tight">
        Panel zarządzania
      </h1>
      <Input placeholder="Wyszukaj..." />
    </PageContainer>
  );
}
