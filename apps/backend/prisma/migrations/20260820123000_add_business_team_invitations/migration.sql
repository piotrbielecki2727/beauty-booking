CREATE TABLE "BusinessTeamInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamMemberId" TEXT NOT NULL,

    CONSTRAINT "BusinessTeamInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BusinessTeamInvitation_tokenHash_key" ON "BusinessTeamInvitation"("tokenHash");
CREATE INDEX "BusinessTeamInvitation_teamMemberId_idx" ON "BusinessTeamInvitation"("teamMemberId");

ALTER TABLE "BusinessTeamInvitation" ADD CONSTRAINT "BusinessTeamInvitation_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "BusinessTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
