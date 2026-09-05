import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { RegisterPageShell } from "@/features/account/components/register";
import { businessTeamInvitationPreviewQueryOptions } from "@/features/businessTeam/api";
import { BusinessTeamInvitationPage } from "@/features/businessTeam/components";
import { makeQueryClient } from "@/lib/queryClient";

export default async function TeamInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    businessTeamInvitationPreviewQueryOptions(token),
  );

  return (
    <RegisterPageShell>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BusinessTeamInvitationPage token={token} />
      </HydrationBoundary>
    </RegisterPageShell>
  );
}
