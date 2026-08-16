import { PageContainer } from "@/components/layout/PageContainer";
import { CustomerSessionPreview } from "@/features/account/components";

export default function CustomerHomePage() {
  return (
    <PageContainer className="grid gap-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Panel klienta</h1>
      <CustomerSessionPreview />
    </PageContainer>
  );
}
