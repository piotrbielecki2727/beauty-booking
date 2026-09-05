import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/auth";
import { businessTeamQueryOptions } from "@/features/businessTeam/api";
import { BusinessTeamMembersPanel } from "@/features/businessTeam/components";
import { getBusinessTeamMemberListStatusFromSearchParam } from "@/features/businessTeam/lib/businessTeamMembersUrlState";
import { makeQueryClient } from "@/lib/queryClient";

export default async function ManagementEmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const [{ status }, session] = await Promise.all([
    searchParams,
    auth(),
  ]);
  const teamListStatus =
    getBusinessTeamMemberListStatusFromSearchParam(status);
  const queryClient = makeQueryClient();
  const businessId = session?.user.businessId ?? null;

  if (session?.accessToken && businessId) {
    await queryClient.prefetchQuery(
      businessTeamQueryOptions({
        accessToken: session.accessToken,
        businessId,
        status: teamListStatus,
      }),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BusinessTeamMembersPanel initialBusinessId={businessId} />
    </HydrationBoundary>
  );
}
